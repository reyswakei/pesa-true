import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase.from("debts").select("*").order("created_at", {ascending:false});
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // bulletproof insert - we generate id ourselves
    const { data, error } = await supabase.from("debts").insert([{
      id: crypto.randomUUID(),
      customer_name: (body.name || body.customer_name || "").trim(),
      phone: (body.phone || "").trim() || null,
      amount: Number(body.amount),
      status: "unpaid"
    }]).select();
    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message, hint: error.hint }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}