#!/usr/bin/env bash
set -euo pipefail

if [[ -f ".env" ]]; then
  set -a
  . ".env"
  set +a
fi

BASE_URL="${FREEDOMPAY_GATEWAY_BASE:-https://api.freedompay.kz}"
MERCHANT_ID="${FREEDOMPAY_MERCHANT_ID:-}"
SECRET_KEY="${FREEDOMPAY_SECRET_KEY:-}"
APP_URL="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"

if [[ -z "$MERCHANT_ID" || -z "$SECRET_KEY" ]]; then
  echo "Missing FREEDOMPAY_MERCHANT_ID or FREEDOMPAY_SECRET_KEY" >&2
  exit 1
fi

ORDER_ID="${ORDER_ID:-$(date +%s)$(printf "%03d" $((RANDOM % 1000)))}"
AMOUNT="${AMOUNT:-2000}"
DESCRIPTION="${DESCRIPTION:-5 chapters}"
LANGUAGE="${LANGUAGE:-en}"
RESULT_URL="${FREEDOMPAY_RESULT_URL:-$APP_URL/api/v1/payments/freedompay/result}"
CHECK_URL="${FREEDOMPAY_CHECK_URL:-$APP_URL/api/v1/payments/freedompay/check}"
ORIGIN="$(printf "%s" "$RESULT_URL" | sed -E 's#(https?://[^/]+).*#\\1#')"
SUCCESS_URL="${FREEDOMPAY_SUCCESS_URL:-$ORIGIN/payment/success?status=success}"
FAILURE_URL="${FREEDOMPAY_FAILURE_URL:-$ORIGIN/payment/success?status=failed}"

if [[ "$SUCCESS_URL" == *"localhost"* || "$FAILURE_URL" == *"localhost"* ]]; then
  echo "Success/failure URLs point to localhost; set FREEDOMPAY_SUCCESS_URL/FREEDOMPAY_FAILURE_URL in .env" >&2
  exit 1
fi
SALT="${SALT:-$(openssl rand -hex 8)}"

# Build signature string (sorted keys)
# Keys order: pg_amount, pg_check_url, pg_currency, pg_description, pg_failure_url,
# pg_language, pg_merchant_id, pg_order_id, pg_result_url, pg_salt, pg_success_url
SIGNATURE_STRING="init_payment;${AMOUNT};${CHECK_URL};KZT;${DESCRIPTION};${FAILURE_URL};${LANGUAGE};${MERCHANT_ID};${ORDER_ID};${RESULT_URL};${SALT};${SUCCESS_URL};${SECRET_KEY}"
PG_SIG="$(printf "%s" "$SIGNATURE_STRING" | md5)"

set -x
curl -sS -X POST "${BASE_URL}/init_payment.php" \
  -F "pg_merchant_id=${MERCHANT_ID}" \
  -F "pg_order_id=${ORDER_ID}" \
  -F "pg_amount=${AMOUNT}" \
  -F "pg_currency=KZT" \
  -F "pg_description=${DESCRIPTION}" \
  -F "pg_salt=${SALT}" \
  -F "pg_language=${LANGUAGE}" \
  -F "pg_result_url=${RESULT_URL}" \
  -F "pg_success_url=${SUCCESS_URL}" \
  -F "pg_failure_url=${FAILURE_URL}" \
  -F "pg_check_url=${CHECK_URL}" \
  -F "pg_sig=${PG_SIG}"
