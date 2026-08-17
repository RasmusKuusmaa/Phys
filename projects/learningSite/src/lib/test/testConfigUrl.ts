import { TestConfigSchema, type TestConfig } from "@/schema";

export function encodeTestConfig(config: TestConfig): URLSearchParams {
  const params = new URLSearchParams();
  params.set("subject", config.subject);
  params.set("levels", config.levels.join(","));
  params.set("concepts", config.conceptIds.join(","));
  params.set("count", String(config.itemCount));
  params.set("mode", config.mode);
  params.set("format", config.answerFormat);
  params.set("seed", config.seed);
  return params;
}

/** Returns `null` on anything malformed or incomplete, rather than throwing — the caller decides how to present that (e.g. "missing test configuration"). */
export function decodeTestConfig(params: Record<string, string | undefined>): TestConfig | null {
  const candidate = {
    subject: params.subject,
    levels: (params.levels ?? "").split(",").filter(Boolean),
    conceptIds: (params.concepts ?? "").split(",").filter(Boolean),
    itemCount: Number(params.count),
    mode: params.mode,
    answerFormat: params.format,
    seed: params.seed,
  };
  const result = TestConfigSchema.safeParse(candidate);
  return result.success ? result.data : null;
}
