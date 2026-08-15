import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";




async function readIdeas(tab) {
    try {
         const filePath = path.join(
            process.cwd(),
            "data",
            `${tab}.json`
        );
        const raw = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(raw);

    } catch {
        return [];
    }
}

export async function GET(request) {
  const tab = request.nextUrl.searchParams.get("tab");
  return NextResponse.json(await readIdeas(tab));
}


async function writeIdeas(tab, ideas) {
    const filePath = path.join(process.cwd(), "data", `${tab}.json`);
  await fs.writeFile(filePath, JSON.stringify(ideas, null, 2), "utf8");
}

export async function POST(request) {
    const {tab, text} = await request.json();

    if (!text || !text.trim()) {
    return NextResponse.json({ error: "متن ایده خالی است" }, { status: 400 });
  }

    const ideas = await readIdeas(tab);

    const newIdea = {
    id: Date.now().toString(),
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  ideas.unshift(newIdea);
  await writeIdeas(tab, ideas);

  return NextResponse.json(newIdea, { status: 201 });

}

export async function DELETE(request) {
  const tab = request.nextUrl.searchParams.get("tab");
  const id = request.nextUrl.searchParams.get("id");

  const ideas = await readIdeas(tab);
  await writeIdeas(tab, ideas.filter((idea) => idea.id !== id));

  return NextResponse.json({ ok: true });
}