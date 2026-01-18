import OpenAI from "openai";

// Lazy initialization - only create client when needed
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

interface ChapterInput {
  name: string;
  currentLife: string;
  pastEvents: string;
  fears: string;
  futureVision: string;
  archetype: string;
  tone: string;
  language?: string;
  previousContent?: string;
  chapterNumber?: number;
}

const languageInstructions: Record<string, string> = {
  en: "Write the entire chapter in English.",
  ru: "Напиши всю главу на русском языке. Используй естественный, живой русский язык, избегая дословного перевода с английского.",
  kz: "Бүкіл тарауды қазақ тілінде жаз. Табиғи, тірі қазақ тілін пайдалан, ағылшын тілінен сөзбе-сөз аударудан аулақ бол.",
};

export async function generateChapter(input: ChapterInput): Promise<string> {
  const openai = getOpenAIClient();

  const lang = input.language || "en";
  const langInstruction = languageInstructions[lang] || languageInstructions["en"];

  const systemPrompt = `You are a master storyteller specializing in identity transformation narratives.
Your task is to write a powerful, immersive chapter (900-1100 words) in first person where the protagonist HAS ALREADY BECOME who they wanted to be.

${langInstruction}

Key principles:
- Write from FUTURE perspective, as if the transformation has already happened
- Use deep psychological insight, not mysticism
- Create visceral, sensory details that make the reader FEEL the new identity
- Build emotional resonance through concrete moments
- End with a powerful, memorable statement
- Match the requested tone: ${input.tone}
- Embody the archetype: ${input.archetype}

This is NOT advice. This is LIVED EXPERIENCE from the future self.`;

  const userPrompt = `Create a chapter where I have become my future self.

MY CURRENT REALITY:
${input.currentLife}

KEY PAST EVENTS THAT SHAPED ME:
${input.pastEvents}

MY FEARS AND LIMITATIONS:
${input.fears}

WHO I WANT TO BECOME:
${input.futureVision}

ARCHETYPE: ${input.archetype}
TONE: ${input.tone}

Write a 900-1100 word chapter where I (${input.name}) am living as this transformed version of myself. Make it feel REAL, PRESENT, POWERFUL.

${langInstruction}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content || "";
}

export async function generateChapterContinuation(input: ChapterInput): Promise<string> {
  const openai = getOpenAIClient();

  const lang = input.language || "en";
  const langInstruction = languageInstructions[lang] || languageInstructions["en"];
  const chapterNumber = input.chapterNumber || 2;

  const systemPrompt = `You are a master storyteller specializing in identity transformation narratives.
Continue an existing story in first person where the protagonist HAS ALREADY BECOME who they wanted to be.

${langInstruction}

Key principles:
- Maintain continuity with the previous chapter
- Keep the same tone: ${input.tone}
- Embody the archetype: ${input.archetype}
- Do not repeat the previous content; move the story forward
- End with a strong, memorable line
`;

  const userPrompt = `Continue the story as Chapter ${chapterNumber}.

STORY CONTEXT (do not repeat verbatim, continue from here):
${input.previousContent || ""}

BACKSTORY (keep consistent):
Current reality: ${input.currentLife}
Key past events: ${input.pastEvents}
Fears and limitations: ${input.fears}
Future vision: ${input.futureVision}

Write 900-1100 words in the same voice and style. First person, present tense, already achieved.

${langInstruction}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content || "";
}

export const ARCHETYPES = [
  { value: "creator", label: "The Creator - Building something meaningful" },
  { value: "leader", label: "The Leader - Inspiring and guiding others" },
  { value: "sage", label: "The Sage - Wisdom and mastery" },
  { value: "rebel", label: "The Rebel - Breaking conventions" },
  { value: "lover", label: "The Lover - Deep connections and relationships" },
  { value: "hero", label: "The Hero - Overcoming challenges" },
  { value: "magician", label: "The Magician - Transformation and influence" },
  { value: "explorer", label: "The Explorer - Freedom and discovery" },
];

export const TONES = [
  { value: "calm", label: "Calm & Reflective" },
  { value: "powerful", label: "Powerful & Bold" },
  { value: "philosophical", label: "Philosophical & Deep" },
  { value: "triumphant", label: "Triumphant & Victorious" },
];
