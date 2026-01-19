/**
 * FreedomPay Integration Library
 * Documentation: https://docs.freedompay.kz/
 *
 * Supports:
 * - One-time payments via init_payment.php
 * - Recurring payments via pg_recurring_start
 * - Callback verification (check_url, result_url)
 */

import crypto from "crypto";

// =============================================================================
// TYPES
// =============================================================================

export type Params = Record<string, string | number | boolean | null | undefined>;

export interface FreedomPayConfig {
  merchantId: string;
  secretKey: string;
  baseUrl: string;
  appUrl: string;
  resultUrl: string;
  checkUrl: string;
  successUrl: string;
  failureUrl: string;
}

export interface InitPaymentParams {
  orderId: string;
  amount: number;
  description: string;
  currency?: string;
  language?: string;
  userId?: string;
  productType?: string;
  // Recurring payment options
  recurringStart?: boolean;
  recurringLifetime?: number; // months (1-156)
}

export interface FreedomPayResponse {
  ok: boolean;
  status: number;
  raw: string;
  parsed: Record<string, string>;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Load FreedomPay configuration from environment variables
 * Validates that all required variables are set
 */
export function getConfig(): FreedomPayConfig {
  const merchantId = process.env.FREEDOMPAY_MERCHANT_ID;
  const secretKey = process.env.FREEDOMPAY_SECRET_KEY;
  const baseUrl = process.env.FREEDOMPAY_GATEWAY_BASE || "https://api.freedompay.kz";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!merchantId || !secretKey) {
    throw new Error(
      "FreedomPay not configured. Set FREEDOMPAY_MERCHANT_ID and FREEDOMPAY_SECRET_KEY in .env"
    );
  }

  return {
    merchantId,
    secretKey,
    baseUrl,
    appUrl,
    resultUrl: process.env.FREEDOMPAY_RESULT_URL || `${appUrl}/api/v1/payments/freedompay/result`,
    checkUrl: process.env.FREEDOMPAY_CHECK_URL || `${appUrl}/api/v1/payments/freedompay/check`,
    successUrl: process.env.FREEDOMPAY_SUCCESS_URL || `${appUrl}/payment/success?status=success`,
    failureUrl: process.env.FREEDOMPAY_FAILURE_URL || `${appUrl}/payment/success?status=failed`,
  };
}

/**
 * Validate that config URLs are publicly accessible (not localhost in production)
 */
export function validateConfig(config: FreedomPayConfig): string[] {
  const warnings: string[] = [];

  if (config.resultUrl.includes("localhost")) {
    warnings.push("FREEDOMPAY_RESULT_URL contains localhost - FreedomPay won't be able to reach it");
  }
  if (config.checkUrl.includes("localhost")) {
    warnings.push("FREEDOMPAY_CHECK_URL contains localhost - FreedomPay won't be able to reach it");
  }

  return warnings;
}

// =============================================================================
// SIGNATURE FUNCTIONS
// =============================================================================

/**
 * Build signature (pg_sig) according to FreedomPay documentation
 *
 * Algorithm:
 * 1. Take all parameters except pg_sig
 * 2. Sort keys alphabetically
 * 3. Join: scriptName;value1;value2;...;secretKey
 * 4. Calculate MD5 hash
 *
 * @param scriptName - Script name (e.g., "init_payment.php", "result", "check")
 * @param params - Request parameters
 * @param secretKey - Merchant secret key
 */
export function buildSig(scriptName: string, params: Params, secretKey: string): string {
  // Filter out pg_sig and get sorted keys
  const keys = Object.keys(params)
    .filter((key) => key !== "pg_sig")
    .sort((a, b) => a.localeCompare(b));

  // Get values in sorted order
  const values = keys.map((key) => String(params[key] ?? ""));

  // Build signature string: scriptName;val1;val2;...;secretKey
  const signatureString = [scriptName, ...values, secretKey].join(";");

  // Calculate MD5
  const signature = crypto.createHash("md5").update(signatureString, "utf8").digest("hex");

  // Debug logging (remove in production or make conditional)
  console.log("[FreedomPay] Signature calculation:", {
    scriptName,
    keys,
    signatureString: signatureString.replace(secretKey, "[SECRET]"),
    signature,
  });

  return signature;
}

/**
 * Verify incoming signature from FreedomPay callback
 */
export function verifySig(scriptName: string, params: Params, secretKey: string): boolean {
  const expected = buildSig(scriptName, params, secretKey);
  const provided = String(params.pg_sig ?? "");

  const isValid = expected === provided;

  if (!isValid) {
    console.error("[FreedomPay] Signature verification failed:", {
      expected,
      provided,
      scriptName,
    });
  }

  return isValid;
}

/**
 * Extract script name from URL path for signature verification
 * e.g., "/api/v1/payments/freedompay/result" -> "result"
 */
export function getScriptNameFromPath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate random salt string for pg_salt parameter
 */
export function randomSalt(): string {
  return crypto.randomBytes(8).toString("hex");
}

/**
 * Generate unique order ID
 */
export function generateOrderId(): string {
  return `${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
}

/**
 * Normalize parameters - convert all values to strings, remove null/undefined
 */
export function normalizeParams(params: Params): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    normalized[key] = String(value);
  }
  return normalized;
}

/**
 * Parse XML response from FreedomPay to object
 */
export function parseXmlToObject(xml: string): Record<string, string> {
  const result: Record<string, string> = {};
  const regex = /<([a-zA-Z0-9_:-]+)>([\s\S]*?)<\/\1>/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(xml)) !== null) {
    const tag = match[1];
    const value = match[2].trim();
    // Skip nested tags
    if (value.includes("<")) {
      continue;
    }
    result[tag] = value;
  }

  return result;
}

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Send POST request to FreedomPay API
 */
export async function postForm(
  baseUrl: string,
  path: string,
  params: Record<string, string>
): Promise<FreedomPayResponse> {
  const url = `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const body = new URLSearchParams(params);

  console.log("[FreedomPay] Sending request:", {
    url,
    params: { ...params, pg_sig: params.pg_sig ? "[PRESENT]" : "[MISSING]" },
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const text = await response.text();
  const parsed = parseXmlToObject(text);

  console.log("[FreedomPay] Response:", {
    status: response.status,
    ok: response.ok,
    parsed,
    raw: text.substring(0, 500), // Truncate for logging
  });

  return { ok: response.ok, status: response.status, raw: text, parsed };
}

/**
 * Initialize payment via init_payment.php
 *
 * @param config - FreedomPay configuration
 * @param params - Payment parameters
 * @returns Response with redirect URL or error
 */
export async function initPayment(
  config: FreedomPayConfig,
  params: InitPaymentParams
): Promise<FreedomPayResponse> {
  const pg_salt = randomSalt();

  // Map language codes
  const pgLanguage = params.language === "kz" ? "kz" : params.language === "ru" ? "ru" : "en";

  // Build request parameters (alphabetically sorted keys matter for signature!)
  const requestParams: Record<string, string> = {
    pg_amount: String(Math.round(params.amount)),
    pg_check_url: config.checkUrl,
    pg_currency: params.currency || "KZT",
    pg_description: params.description,
    pg_failure_url: config.failureUrl,
    pg_language: pgLanguage,
    pg_merchant_id: config.merchantId,
    pg_order_id: params.orderId,
    pg_result_url: config.resultUrl,
    pg_salt,
    pg_success_url: config.successUrl,
  };

  // Add recurring parameters if requested
  if (params.recurringStart) {
    requestParams.pg_recurring_start = "1";
    if (params.recurringLifetime) {
      requestParams.pg_recurring_lifetime = String(params.recurringLifetime);
    }
  }

  // Add custom parameters (will be passed to callbacks)
  if (params.userId) {
    requestParams.user_id = params.userId;
  }
  if (params.productType) {
    requestParams.product_type = params.productType;
  }

  // Calculate signature
  const pg_sig = buildSig("init_payment.php", requestParams, config.secretKey);
  const payload = { ...requestParams, pg_sig };

  return postForm(config.baseUrl, "init_payment.php", payload);
}

// =============================================================================
// RESPONSE XML BUILDER
// =============================================================================

/**
 * Build XML response for FreedomPay callbacks (check_url, result_url)
 */
export function buildResponseXml(
  scriptName: string,
  status: "ok" | "rejected" | "error",
  description: string,
  secretKey: string
): string {
  const pg_salt = randomSalt();
  const responseParams = {
    pg_status: status,
    pg_description: description,
    pg_salt,
  };
  const pg_sig = buildSig(scriptName, responseParams, secretKey);

  return `<?xml version="1.0" encoding="utf-8"?>
<response>
  <pg_status>${status}</pg_status>
  <pg_description>${description}</pg_description>
  <pg_salt>${pg_salt}</pg_salt>
  <pg_sig>${pg_sig}</pg_sig>
</response>`;
}

// =============================================================================
// ERROR CODES
// =============================================================================

export const FREEDOMPAY_ERRORS: Record<string, string> = {
  "0": "Unknown error",
  "100": "Invalid request",
  "101": "Invalid merchant",
  "102": "Invalid signature",
  "103": "Transaction not found",
  "104": "Invalid amount",
  "105": "Invalid currency",
  "9998": "Merchant not found (check pg_merchant_id)",
  "99999": "Unknown payment system error",
};

export function getErrorDescription(code: string): string {
  return FREEDOMPAY_ERRORS[code] || `Unknown error (code: ${code})`;
}
