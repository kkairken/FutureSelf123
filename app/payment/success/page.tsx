import { Suspense } from "react";
import PaymentSuccessClient from "./success-client";

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessClient />
    </Suspense>
  );
}
