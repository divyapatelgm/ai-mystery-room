import { getGeminiClient, DEFAULT_GEMINI_MODEL } from '../config/gemini.js';
import { validateMystery, DIFFICULTY_CONSTRAINTS } from './mysteryValidator.js';

const SYSTEM_PROMPT = `You are a master Noir mystery author, forensic scientist, and detective puzzle architect.
Your task is to generate a logically consistent, solvable detective investigation.

CRITICAL LOGICAL INTEGRITY REQUIREMENTS:
1. Exactly ONE identifiable culprit among the suspects.
2. The culprit must have a clear motive, means, and opportunity.
3. Every innocent suspect must have a verifiable alibi or evidence proving their innocence.
4. The crime MUST be logically solvable from the clues provided.
5. The solution must cite at least 2 specific supportingClueIds that directly reveal the culprit's guilt (e.g. broken alibi, forensic toolmatch, timeline contradiction).
6. Clue categories must be one of: "physical", "testimony", "document", "forensic".
7. All suspect IDs must be "suspect_1", "suspect_2", etc.
8. All clue IDs must be "clue_1", "clue_2", etc.
9. All hint IDs must be "hint_1", "hint_2", etc.
10. Hints must give progressive, subtle deductive advice without directly spoiling the culprit.
11. Return strictly valid JSON with no markdown formatting or commentary.`;

function buildUserPrompt(premise, difficulty) {
  const constraints = DIFFICULTY_CONSTRAINTS[difficulty] || DIFFICULTY_CONSTRAINTS.medium;

  const premiseText = premise && premise.trim().length > 0
    ? `User-requested mystery premise: "${premise.trim()}".`
    : `Generate an enigmatic, original noir detective mystery set in a captivating atmospheric location (e.g., private estate, luxury train, high-society gallery, midnight train, jazz club, or vintage observatory).`;

  return `${premiseText}

DIFFICULTY REQUIREMENTS FOR "${difficulty.toUpperCase()}":
- EXACTLY ${constraints.suspects} suspects (IDs: ${Array.from({ length: constraints.suspects }, (_, i) => `"suspect_${i + 1}"`).join(', ')})
- EXACTLY ${constraints.clues} clues (IDs: ${Array.from({ length: constraints.clues }, (_, i) => `"clue_${i + 1}"`).join(', ')})
- EXACTLY ${constraints.hints} hints (IDs: ${Array.from({ length: constraints.hints }, (_, i) => `"hint_${i + 1}"`).join(', ')})

JSON OUTPUT FORMAT:
{
  "title": "Evocative Noir Title",
  "story": "Atmospheric, vivid case introduction describing the discovery of the crime, the scene, and initial detective observations (150-250 words).",
  "difficulty": "${difficulty}",
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Full Name",
      "occupation": "Specific Occupation",
      "relationship": "How they relate to the victim or incident",
      "biography": "Dossier background details including temperament and financial/personal stakes",
      "alibi": "Their claimed whereabouts during the time of the incident",
      "portraitDescription": "Visual description suitable for detective dossier avatar",
      "gender": "male" | "female" | "neutral"
    }
  ],
  "clues": [
    {
      "id": "clue_1",
      "title": "Short Descriptive Title",
      "description": "Initial surface observation teaser visible before full investigation",
      "details": "In-depth forensic, testimonial, or documentary findings revealed upon discovery",
      "category": "physical" | "testimony" | "document" | "forensic",
      "relevance": "Why this clue matters to establishing guilt or innocence"
    }
  ],
  "hints": [
    {
      "id": "hint_1",
      "text": "Subtle deductive guidance helping the detective connect existing evidence without naming the culprit directly"
    }
  ],
  "solution": {
    "culpritId": "suspect_X",
    "explanation": "Clear, comprehensive post-mortem detailing how the crime was executed, how innocent alibis hold up, and how the supporting clues definitively prove the culprit's guilt.",
    "supportingClueIds": ["clue_A", "clue_B"]
  }
}`;
}

/**
 * Calls Gemini to synthesize and validate a complete mystery.
 * Performs bounded retries if Gemini returns malformed output.
 */
export async function generateMysteryFromGemini({ premise, difficulty = 'medium' }) {
  const normDifficulty = (difficulty || 'medium').toLowerCase();
  if (!DIFFICULTY_CONSTRAINTS[normDifficulty]) {
    throw new Error(`Invalid difficulty: ${difficulty}. Must be easy, medium, or hard.`);
  }

  const ai = getGeminiClient();
  const candidateModels = [
    DEFAULT_GEMINI_MODEL,
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
  ];
  const modelsToTry = [...new Set(candidateModels.filter(Boolean))];
  const userPrompt = buildUserPrompt(premise, normDifficulty);

  let lastError = null;

  for (let mIdx = 0; mIdx < modelsToTry.length; mIdx++) {
    const currentModel = modelsToTry[mIdx];
    const MAX_RETRIES = 1; // 2 attempts per model

    for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
      try {
        console.log(`[GeminiService] Generating mystery with model "${currentModel}" (attempt ${attempt}/${MAX_RETRIES + 1}, difficulty: ${normDifficulty})...`);

        const response = await ai.models.generateContent({
          model: currentModel,
          contents: [
            { role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }] }
          ],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          }
        });

        const responseText = response.text;
        if (!responseText) {
          throw new Error('Gemini returned an empty response.');
        }

        // Strip any markdown code fence wrappers if present
        const cleanJson = responseText
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/```\s*$/i, '')
          .trim();

        const parsed = JSON.parse(cleanJson);
        
        // Validate structure, item counts, unique IDs, and logical consistency
        const validatedMystery = validateMystery(parsed, normDifficulty);
        console.log(`[GeminiService] Mystery successfully generated and validated using "${currentModel}": "${validatedMystery.title}"`);
        return validatedMystery;

      } catch (err) {
        console.warn(`[GeminiService] Generation with "${currentModel}" (attempt ${attempt}) failed: ${err.message}`);
        lastError = err;

        // If high demand (503) or model unavailable (404), break immediately to the next fallback model
        if (err.message?.includes('503') || err.message?.includes('UNAVAILABLE') || err.message?.includes('404')) {
          console.warn(`[GeminiService] Model "${currentModel}" unavailable or overloaded. Trying fallback model...`);
          break;
        }

        if (attempt <= MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 1000 * attempt));
        }
      }
    }
  }

  throw new Error(`Mystery generation failed across models: ${lastError?.message}`);
}

