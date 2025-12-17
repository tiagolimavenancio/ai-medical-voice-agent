/* eslint-disable @typescript-eslint/no-explicit-any */
import { openai } from "@/config/OpenAiModel";
import { doctorList } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content: `
You are a helpful medical triage AI.
You will be given symptoms and must return a JSON in this format:
{
  "doctorIds": [1, 3, 4]
}
Only choose from this list of doctor IDs:
${doctorList.map((d) => d.id).join(", ")}

Only return valid JSON — no explanations, markdown, or formatting.
          `,
        },
        { role: "user", content: `User symptoms: ${notes}. Recommend 2–3 doctorIds.` },
      ],
    });

    const rawResp = completion.choices[0].message.content || "";
    const cleanedResp = rawResp
      .trim()
      .replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "");

    const parsed = JSON.parse(cleanedResp);

    const matchedDoctors = parsed.doctorIds
      .map((id: number) => doctorList.find((doc) => doc.id === id))
      .filter(Boolean);

    return NextResponse.json({ doctors: matchedDoctors });
  } catch (e: any) {
    return NextResponse.json({
      doctors: [
        doctorList.find((d) => d.id === 1) || {
          id: 1,
          specialist: "General Physician",
          description: "Helps with everyday health concerns and common symptoms.",
          image: "/doctor1.png",
          agentPrompt:
            "You are a friendly General Physician AI. Greet the user and quickly ask what symptoms they’re experiencing. Keep responses short and helpful.",
          voiceId: "will",
        },
      ],
      error: true,
      message: "Fallback: Unable to parse AI response.",
    });
  }
}
