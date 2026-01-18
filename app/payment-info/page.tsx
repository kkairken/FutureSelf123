import { getDocContent } from "@/lib/docs";

export const dynamic = "force-static";

export default function PaymentInfoPage() {
  const { title, body } = getDocContent("payment");

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
        <div className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
          {body}
        </div>
      </div>
    </div>
  );
}
