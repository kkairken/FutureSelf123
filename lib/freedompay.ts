import crypto from "crypto";

type Params = Record<string, string | number | boolean | null | undefined>;

export function buildSig(scriptName: string, params: Params, secretKey: string) {
  const keys = Object.keys(params)
    .filter((key) => key !== "pg_sig")
    .sort((a, b) => a.localeCompare(b));

  const values = keys.map((key) => String(params[key] ?? ""));
  const raw = [scriptName, ...values, secretKey].join(";");
  return crypto.createHash("md5").update(raw, "utf8").digest("hex");
}

export function verifySig(scriptName: string, params: Params, secretKey: string) {
  const expected = buildSig(scriptName, params, secretKey);
  const provided = String(params.pg_sig ?? "");
  return expected === provided;
}

export function getScriptNameFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

export function parseXmlToObject(xml: string) {
  const result: Record<string, string> = {};
  const regex = /<([a-zA-Z0-9_:-]+)>([\s\S]*?)<\/\1>/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(xml)) !== null) {
    const tag = match[1];
    const value = match[2].trim();
    if (value.includes("<")) {
      continue;
    }
    result[tag] = value;
  }

  return result;
}

export function randomSalt() {
  return crypto.randomBytes(8).toString("hex");
}

export async function postForm(
  baseUrl: string,
  path: string,
  params: Record<string, string>
) {
  const url = `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const body = new URLSearchParams(params);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const text = await response.text();
  return { ok: response.ok, status: response.status, raw: text, parsed: parseXmlToObject(text) };
}

export function normalizeParams(params: Params) {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    normalized[key] = String(value);
  }
  return normalized;
}

export function buildResponseXml(
  scriptName: string,
  status: "ok" | "rejected" | "error",
  description: string,
  secretKey: string
) {
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
