import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { transcript, fillers, wpm } = await request.json() as { transcript: string; fillers: number; wpm: number };

        if (!transcript) {
            return NextResponse.json({ reply: '{"confidence_score": 0, "content_accuracy_score": 0, "hesitation_notes": "No transcript provided.", "wrong_statements_detected": ["None"], "improvement_plan": "Please speak into the microphone."}' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ reply: '{"confidence_score": 70, "content_accuracy_score": 75, "hesitation_notes": "Offline mock. Filler words detected.", "wrong_statements_detected": ["Offline mock data"], "improvement_plan": "Add GEMINI_API_KEY to test real AI evaluation."}' });
        }

        const SYSTEM_PROMPT = `You are a strict, highly analytical senior technical interviewer evaluating a candidate's spoken response.
The candidate had ${fillers} filler words ("um", "like", "you know") and spoke at ${wpm} Words Per Minute (WPM).
Read their transcript and return a STRICT JSON object representing their evaluation scorecard.
Do not output markdown code blocks. Just output raw JSON.

JSON Schema required:
{
  "confidence_score": <number 0-100 based on tone, filler words, and pacing>,
  "content_accuracy_score": <number 0-100 based on factual correctness of their technical answer>,
  "hesitation_notes": "<string feedback on pauses, filler words, and delivery>",
  "wrong_statements_detected": ["<array of specific factually wrong technical statements made>"],
  "improvement_plan": "<string with 3 specific bullet points on how to improve>"
}`;

        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                    contents: [{ role: 'user', parts: [{ text: `Candidate Transcript: ${transcript}` }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        temperature: 0.2
                    }
                })
            }
        );

        if (!geminiRes.ok) throw new Error('Gemini API error');

        const data = await geminiRes.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        return NextResponse.json({ reply });

    } catch (error) {
        console.error('Interview evaluation error:', error);
        return NextResponse.json({ reply: '{"confidence_score": 50, "content_accuracy_score": 50, "hesitation_notes": "Evaluation failed due to server error.", "wrong_statements_detected": ["Server Error"], "improvement_plan": "Please try again later."}' });
    }
}
