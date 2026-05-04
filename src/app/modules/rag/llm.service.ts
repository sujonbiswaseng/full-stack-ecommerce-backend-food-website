
import { envVars } from "../../config/env";

type GenerateOptions = {
  asJson?: boolean;
  maxTokens?: number;
  temperature?: number;
};

export class LLMService {
  private apiKey: string;
  private apiUrl = "https://openrouter.ai/api/v1";
  private model: string;

  constructor() {
    this.apiKey = envVars.RAG.OPENROUTER_API_KEY;
    this.model = envVars.RAG.OPENROUTER_LLM_MODEL;

    if (!this.apiKey) {
      throw new Error(" OpenRouter API key is missing");
    }
  }

  async generateResponse(
    prompt: string,
    context: string[] = [],
    options: GenerateOptions = {}
  ): Promise<string> {
    const {
      asJson = false,
      maxTokens = 1200,
      temperature = 0.2,
    } = options;

    try {
      const fullPrompt = this.buildPrompt(prompt, context, asJson);

      const response = await this.callLLM({
        prompt: fullPrompt,
        asJson,
        maxTokens,
        temperature,
      });

      return response;
    } catch (error) {
      console.error(" LLM generateResponse failed:", error);
      throw error;
    }
  }
  private buildPrompt(
    prompt: string,
    context: string[],
    asJson: boolean
  ): string {
    if (context.length === 0) return prompt;

    let basePrompt = `
You are an intelligent AI assistant for a food / meal / marketplace platform.

Use ONLY the provided context to answer.

If the answer is not in the context, say:
"I don't have enough information."

---------------------
CONTEXT:
${context.join("\n\n")}
---------------------

QUESTION:
${prompt}
`;

    if (asJson) {
      basePrompt += `

Return ONLY valid JSON in this format:
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "rating": number,
      "price": number
    }
  ]
}

 Do NOT use markdown
Do NOT explain
✔ ONLY JSON
`;
    }

    return basePrompt;
  }
  private async callLLM({
    prompt,
    asJson,
    maxTokens,
    temperature,
  }: {
    prompt: string;
    asJson: boolean;
    maxTokens: number;
    temperature: number;
  }): Promise<string> {
    const body: any = {
      model: this.model,
      messages: [
        {
          role: "system",
          content: this.getSystemMessage(asJson),
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature,
      max_tokens: maxTokens,
    };

    if (asJson && this.model.includes("gpt")) {
      body.response_format = { type: "json_object" };
    }

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(`${this.apiUrl}/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://your-app.com",
            "X-Title": "AI Meal Platform",
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message || "Unknown API error");
        }

        const data = await res.json();

        const output = data.choices?.[0]?.message?.content;

        if (!output) throw new Error("Empty LLM response");

        return output;
      } catch (error) {
        console.warn(`Retry ${attempt} failed`);

        if (attempt === 3) throw error;
      }
    }

    throw new Error("LLM failed after retries");
  }

  private getSystemMessage(asJson: boolean): string {
    if (asJson) {
      return `
You are a strict JSON API generator.

Rules:
- Always return valid JSON
- No markdown
- No explanation
- No extra text
`;
    }

    return `
You are an AI assistant for a food and meal platform.

Rules:
- Be clear and helpful
- Use provided context only
- Do not hallucinate
`;
  }
}