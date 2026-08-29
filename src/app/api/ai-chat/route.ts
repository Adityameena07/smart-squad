import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Smart Squad Career Advisor — an expert AI assistant embedded inside Smart Squad, a premium engineering career portal for college students across all 12 engineering disciplines: AI/Data Science, Computer Science (CSE), Information Technology (IT), Electronics & Communication (ECE), Electrical & Electronics (EEE), Mechanical Engineering, Civil Engineering, Chemical Engineering, Aerospace Engineering, Robotics & Automation, Biotechnology Engineering, and Metallurgical & Materials Engineering.

Your expertise covers:
- Job & Internship Guidance: Roles, companies, application strategies, portals (LinkedIn, Naukri, Internshala, Unstop, AICTE, Wellfound, etc.)
- Campus Placement Preparation: OA rounds, technical interviews, HR interviews, aptitude tests, DSA, system design, domain-specific technical rounds
- Resume & CV Building: ATS optimization, project descriptions, skill keywords, GitHub profiles, certifications
- Career Roadmaps: Branch-wise career paths, specializations, higher studies (GATE, GRE, GMAT, MBA), industry transitions
- Salary Benchmarks: Stipend ranges, CTC packages, compensation by company tier and location
- Skills to Learn: Programming languages, tools, frameworks, certifications recommended for each branch
- Company Insights: Culture, interview process, difficulty, rounds at FAANG, PSUs, startups, core companies
- CGPA & Eligibility: Tips for students with different CGPA bands
- Rejection Recovery: What to do after rejection, skill gaps, improvement plans

Be concise (under 250 words per reply), practical, warm, and encouraging. Use bullet points for clarity when listing items. Use emojis sparingly. Address the student's specific question directly.`;

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

function generateOfflineReply(message: string): string {
    const msg = message.toLowerCase();

    if (msg.includes('salary') || msg.includes('stipend') || msg.includes('ctc') || msg.includes('package')) {
        return "💰 **Salary Benchmarks (2025-26):**\n\n• **Internships:** ₹8,000–₹80,000/month (startups to FAANG)\n• **Top MNCs (Google, Microsoft, Amazon):** ₹40–60 LPA CTC\n• **Mid-tier IT (TCS, Infosys, Wipro):** ₹3.5–7 LPA\n• **Core Engineering (L&T, BHEL, Tata):** ₹4–12 LPA\n• **PSU (ONGC, NTPC, BHEL via GATE):** ₹8–12 LPA + perks\n• **Startups (funded):** ₹10–30 LPA + ESOPs\n\nFocus on building a strong portfolio to target the higher ranges!";
    }

    if (msg.includes('resume') || msg.includes('cv')) {
        return "📄 **Resume Tips for Engineering Students:**\n\n• Keep it to **1 page** for freshers\n• Lead with a **strong summary** (2–3 lines about your branch + key skills)\n• List **projects before education** — companies care more about what you've built\n• Use **action verbs**: Built, Designed, Optimized, Deployed, Reduced...\n• Add **GitHub links** to every project\n• Include relevant **certifications** (AWS, Google, Coursera, NPTEL)\n• ATS tip: Mirror keywords from the job description\n• Quantify impact: \"Reduced API latency by 40%\" > \"Worked on APIs\"\n\nUse free tools: Overleaf (LaTeX resume), Canva, or Novoresume.";
    }

    if (msg.includes('internship')) {
        return "🎯 **How to Land Your First Internship:**\n\n• **Start early** — Apply 3–4 months before the target start\n• **Best portals:** Internshala, LinkedIn, Unstop, AICTE Portal, Wellfound (startups)\n• **Build 2–3 projects** on GitHub relevant to your branch\n• **Cold email** professors and startup founders directly\n• **Competitive coding** profiles (LeetCode, CodeChef) help for tech roles\n• **LinkedIn profile** is critical — 40% of recruiters check it first\n• Attend college placement drives and hackathons\n\nWant specific advice for your branch? Just tell me which branch you're in!";
    }

    if (msg.includes('placement') || msg.includes('campus')) {
        return "🏢 **Campus Placement Strategy:**\n\n• **CGPA ≥ 7.5** opens most company doors; ≥ 8.5 for top-tier\n• **For software roles:** Master DSA (LeetCode 150+), CS fundamentals (OS, DBMS, Networks)\n• **For core roles:** Focus on domain knowledge + simulation tools\n• **Resume shortlisting:** Apply in the first wave — early applicants get priority\n• **Mock interviews:** Practice with seniors, use Pramp or InterviewBit\n• **Soft skills:** Many companies filter 30–50% at the HR round\n\nKey timeline:\n→ Aug–Oct: Prep & apply\n→ Nov–Jan: OA rounds + technical interviews\n→ Feb–Mar: Offers roll out";
    }

    if (msg.includes('gate') || msg.includes('higher stud') || msg.includes('mtech') || msg.includes('m.tech')) {
        return "📚 **GATE & Higher Studies:**\n\n• **GATE score** is valid for 3 years and opens doors to IITs, NITs, IISc + PSU jobs\n• **Cutoffs (2025):** IIT Bombay CSE ~750+, IIT Delhi ECE ~680+\n• **Study plan:** 8–10 months, focus on: Engineering Mathematics, Subject-specific topics, Previous year papers\n• **Resources:** Made Easy, ACE Academy, NPTEL, GATE Overflow (CSE)\n• **PSU through GATE:** BHEL, NTPC, GAIL, ONGC, HPCL recruit via GATE scores\n• **Abroad (GRE):** Target GRE 320+ for US MS, focus on SOP + 2 recommendation letters\n\nDecide based on your career goal — GATE for research/PSU, GRE for global exposure.";
    }

    if (msg.includes('interview') || msg.includes('technical round') || msg.includes('oa') || msg.includes('aptitude')) {
        return "🎤 **Interview Preparation Guide:**\n\n**Online Assessment (OA):**\n• Practice on LeetCode, HackerRank, Unstop\n• Topics: Arrays, Strings, DP, Graphs, Trees (for tech roles)\n\n**Technical Interview:**\n• DSA: Top 150 LeetCode problems\n• CS Fundamentals: OS, DBMS, Computer Networks, OOPs\n• Core branches: Domain-specific theory + simulation tools\n• System Design (for senior roles): HLD/LLD, Scalability\n\n**HR Interview:**\n• Prepare STAR stories (Situation, Task, Action, Result)\n• Research the company's recent news, products, culture\n• Know your resume inside-out\n\n**Resources:** NeetCode, Abdul Bari (DSA), InterviewBit, GeeksforGeeks";
    }

    if (msg.includes('skill') || msg.includes('learn') || msg.includes('course') || msg.includes('certification')) {
        return "🛠️ **Skills & Certifications by Branch:**\n\n• **AI/DS/CSE/IT:** Python, SQL, ML, Docker, AWS/GCP, React/Node.js\n• **ECE:** Embedded C, RTOS, Verilog, MATLAB, PCB Design\n• **EEE:** MATLAB/Simulink, Power Electronics, SCADA, PLC\n• **Mechanical:** SolidWorks, ANSYS, AutoCAD, CATIA, Python\n• **Civil:** AutoCAD, STAAD Pro, Revit, BIM, GIS\n• **Aero/Robotics:** ANSYS Fluent, ROS, Simulink, Python, C++\n• **Biotech:** Python/R, Bioinformatics tools, GMP knowledge\n\n**Free Certifications:** Google (Coursera), AWS Free Tier, NPTEL, AICTE FDP\n\nWhich branch are you in? I can give a specific learning roadmap!";
    }

    if (msg.includes('company') || msg.includes('google') || msg.includes('microsoft') || msg.includes('amazon') || msg.includes('tcs') || msg.includes('infosys')) {
        return "🏢 **Company Tier Guide:**\n\n**Tier 1 (Dream):** Google, Microsoft, Amazon, Apple, Meta, Goldman Sachs\n→ Require: Strong DSA, system design, referrals help\n\n**Tier 2 (Mass/Good):** Adobe, Flipkart, PayPal, Walmart, Razorpay, Zomato\n→ Require: Good DSA + domain knowledge\n\n**Tier 3 (Service):** TCS, Infosys, Wipro, Cognizant, Capgemini\n→ Require: Verbal aptitude, basic coding, positive attitude\n\n**Core Engineering:** L&T, Tata Steel, BHEL, Siemens, ABB, DRDO, HAL, ISRO\n→ Require: Domain expertise + GATE score for PSUs\n\nTarget based on your preparation level. Service companies are great stepping stones!";
    }

    // Default response
    return "👋 I'm Smart Squad's AI Career Advisor! I can help you with:\n\n• **Job & Internship** opportunities and strategy\n• **Campus Placement** preparation (OA, Tech rounds, HR)\n• **Resume & CV** building tips\n• **Career roadmaps** for all 12 engineering branches\n• **Salary benchmarks** and package expectations\n• **Skills & certifications** to learn\n• **Company insights** and interview processes\n• **GATE / Higher studies** guidance\n\nJust ask me anything specific — like \"How do I prepare for Amazon interviews?\" or \"What skills should a Mechanical engineer learn for industry?\"";
}

export async function POST(request: NextRequest) {
    try {
        const { message, history } = await request.json() as { message: string; history: ChatMessage[] };

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ reply: "Please send a valid message." }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // If no API key configured, use offline smart responses
        if (!apiKey) {
            const reply = generateOfflineReply(message);
            return NextResponse.json({ reply });
        }

        // Build conversation history for Gemini
        const contents = [
            ...(history || []).slice(-8).map((msg: ChatMessage) => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            })),
            {
                role: 'user',
                parts: [{ text: message }]
            }
        ];

        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: SYSTEM_PROMPT }]
                    },
                    contents,
                    generationConfig: {
                        maxOutputTokens: 600,
                        temperature: 0.75,
                        topP: 0.9
                    },
                    safetySettings: [
                        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
                    ]
                })
            }
        );

        if (!geminiRes.ok) {
            console.error('Gemini API error:', geminiRes.status);
            return NextResponse.json({ reply: generateOfflineReply(message) });
        }

        const data = await geminiRes.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
            return NextResponse.json({ reply: generateOfflineReply(message) });
        }

        return NextResponse.json({ reply });

    } catch (error) {
        console.error('AI chat error:', error);
        return NextResponse.json({
            reply: "I'm having a moment — please try again! In the meantime, check out the Jobs Feed for 2000+ opportunities. 🚀"
        });
    }
}
