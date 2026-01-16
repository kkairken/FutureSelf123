import { Suspense } from "react";
import PaymentSuccessClient from "./success-client";

export const runtime = "edge";

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessClient />
    </Suspense>
  );
}
