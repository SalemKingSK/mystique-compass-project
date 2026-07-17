/**
 * AI advisory service intentionally disabled.
 *
 * Mystique Compass is a deterministic/offline-first numerology engine. The app
 * must not depend on chatbots, hosted LLMs, or non-mechanical interpretation
 * layers. This stub remains only so older imports fail safely instead of making
 * a network request to a non-existent endpoint.
 */
export async function generateTransitionAdvisoryAI(
  _prompt: string,
): Promise<string> {
  throw new Error(
    "AI advisory is disabled: Mystique Compass runs on deterministic code engines only.",
  );
}
