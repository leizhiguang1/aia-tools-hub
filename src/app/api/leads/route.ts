import { NextResponse } from "next/server";
import { createLead } from "@/db/queries";
import { createId } from "@paralleldrive/cuid2";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, whatsapp, locale, source } = body;

    // We can allow either email or whatsapp, or require both. The user didn't specify exactly,
    // but typically at least one or both are required. Let's require them to be present in the body.
    if (!email && !whatsapp) {
      return NextResponse.json(
        { error: "Email or WhatsApp is required" },
        { status: 400 }
      );
    }

    // Clean whatsapp number (remove spaces and dashes)
    const cleanWhatsapp = whatsapp ? whatsapp.replace(/[\s-]/g, "") : "";
    if (cleanWhatsapp && !/^\+?[0-9]{8,20}$/.test(cleanWhatsapp)) {
      return NextResponse.json(
        { error: "Invalid WhatsApp number format" },
        { status: 400 }
      );
    }

    // locale IS the market id (cn, my, tw)
    const id = createId();
    await createLead({
      id,
      email: email || "",
      whatsapp: cleanWhatsapp,
      locale: locale || "",
      market_id: locale || "cn",
      source: source || "",
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
