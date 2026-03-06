import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.toLowerCase();

    const res = await authFetch("http://localhost:3000/api/providers");
    const data = await res.json();

    const providers = Array.isArray(data) ? data : (data.providers ?? []);

    if (!q) {
      return NextResponse.json({
        services: [],
        agencies: [],
      });
    }

    const filtered = providers.filter(
      (p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.desc?.toLowerCase().includes(q) ||
        p.tags?.some((t: string) => t.toLowerCase().includes(q)),
    );

    return NextResponse.json({
      services: filtered,
      agencies: [],
    });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
