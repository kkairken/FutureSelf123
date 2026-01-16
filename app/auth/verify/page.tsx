import { Suspense } from "react";
import VerifyClient from "./verify-client";

export const runtime = "edge";

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyClient />
    </Suspense>
  );
}
