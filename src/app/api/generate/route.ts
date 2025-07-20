import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ⏱️ Dictionnaire simple pour enregistrer le timestamp des appels par IP
const lastRequestPerIp = new Map<string, number>();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ reply: "❌ Utilisateur non authentifié." }, { status: 401 });
  }

  // ⏱️ Protection anti-spam basique par IP
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const lastCall = lastRequestPerIp.get(ip);

  if (lastCall && now - lastCall < 3000) {
    return NextResponse.json(
      { reply: "⏱️ Merci de patienter quelques secondes avant une nouvelle génération." },
      { status: 429 }
    );
  }

  lastRequestPerIp.set(ip, now);

  const { prompt } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ reply: "❌ Clé API OpenAI manquante." }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Tu es une IA spécialisée dans la rédaction de réponses aux avis Google. Réponds toujours de façon professionnelle, empathique et rassurante.",
          },
          {
            role: "user",
            content: `Voici un avis client : "${prompt}". Rédige une réponse adaptée.`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    console.log("✅ Réponse OpenAI brute :", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0]) {
      return NextResponse.json(
        { reply: "❌ Erreur lors de la génération de la réponse." },
        { status: 500 }
      );
    }

    const reply = data.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("❌ Erreur API OpenAI :", error);
    return NextResponse.json(
      { reply: "❌ Une erreur est survenue côté serveur." },
      { status: 500 }
    );
  }
}
