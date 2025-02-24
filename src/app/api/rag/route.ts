import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {
    const { query } = await req.json();
    
    if (!query) return NextResponse.json({ error: "Query is not provided" }, { status: 400 });

    const response = await fetch("https://rag-integration.onrender.com/query", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    return NextResponse.json(data)
  }
  catch (error) {
    console.log(error);
    return NextResponse.json({ error: error}, { status: 400 });
  };
}
