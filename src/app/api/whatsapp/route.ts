export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === "pesa_true_2024") {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Pesa True Assistant API Live ✅", { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const msg = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body || "";
    console.log("WhatsApp:", msg);
    const amount = Number(msg.match(/(\d+)/)?.[0] || 0);
    return Response.json({ success: true, amount, name: "Pesa True Assistant" });
  } catch {
    return Response.json({ error: "fail" }, { status: 500 });
  }
}