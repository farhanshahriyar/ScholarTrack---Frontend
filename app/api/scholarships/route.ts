// import { supabase } from "@/lib/supabase";
// import { NextResponse } from "next/server";

// export async function GET() {
//   const { data, error } = await supabase.from("scholarships").select("*");
//   return error
//     ? NextResponse.json({ error: error.message }, { status: 500 })
//     : NextResponse.json(data);
// }


import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase.from("scholarships").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { data, error } = await supabase.from("scholarships").insert(body);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
