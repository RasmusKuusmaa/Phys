import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { platform } from "node:os";
import { listSubjects } from "@/content/loader";
import { loadResources } from "@/content/resources";

const execFileAsync = promisify(execFile);
// Windows' native curl.exe (System32) doesn't understand the Unix null
// device and exits CURLE_WRITE_ERROR (23) trying to write to it — this
// script's actual target (CI on ubuntu-latest) never hits this, but NUL
// keeps `npm run check:links` working for anyone running it locally on
// Windows too.
const NULL_DEVICE = platform() === "win32" ? "NUL" : "/dev/null";

const TIMEOUT_SECONDS = 15;
const CONCURRENCY = 6;
// Some perfectly live sites (bot-detection heuristics, unusual TLS configs)
// 403 or hard-fail Node's own fetch()/undici while a plain curl request
// succeeds fine — matches what this project already found by hand while
// curating resources. Shelling out to curl avoids that class of false
// positive rather than trying to fight it in Node. A self-identifying UA
// string (anything with "bot"/"checker"/"compatible;" in it) trips some of
// the same sites' WAF rules even over curl — confirmed by hand against
// phys.libretexts.org, which 403s a "LinkChecker" UA but 200s a plain one —
// so this deliberately looks like an ordinary browser rather than announcing
// itself.
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

type CheckResult = { url: string; ok: boolean; detail: string };

async function curlStatus(url: string): Promise<CheckResult> {
  try {
    const { stdout } = await execFileAsync("curl", [
      "-s",
      "-o",
      NULL_DEVICE,
      "-w",
      "%{http_code}",
      "-L",
      "--max-time",
      String(TIMEOUT_SECONDS),
      "-A",
      USER_AGENT,
      url,
    ]);
    const status = Number.parseInt(stdout.trim(), 10);
    if (status >= 200 && status < 400) return { url, ok: true, detail: `${status}` };
    return { url, ok: false, detail: status ? `HTTP ${status}` : "no response" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { url, ok: false, detail: message };
  }
}

async function checkOne(rawUrl: string): Promise<CheckResult> {
  // Content stores some resource URLs with raw Unicode in the path (e.g.
  // Estonian Wikipedia titles) — browsers percent-encode those transparently
  // on navigation, but curl sends the raw bytes as-is, which Wikipedia's
  // routing 404s on. `new URL().href` normalises exactly the way a browser
  // would, without double-encoding URLs that are already percent-encoded.
  const url = new URL(rawUrl).href;
  const first = await curlStatus(url);
  // A process-level curl failure (timeout, DNS blip) is retried once before
  // being reported — an HTTP-level error status is not, since retrying that
  // never changes the answer.
  if (first.ok || /^HTTP \d+$/.test(first.detail)) return first;
  return curlStatus(url);
}

async function runWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function main() {
  const subjects = listSubjects();
  const urls = new Set<string>();
  for (const subject of subjects) {
    for (const resource of loadResources(subject)) urls.add(resource.url);
  }

  const uniqueUrls = [...urls];
  console.log(`Checking ${uniqueUrls.length} unique resource URL(s)...`);

  const results = await runWithConcurrency(uniqueUrls, CONCURRENCY, checkOne);
  const broken = results.filter((r) => !r.ok);

  if (broken.length === 0) {
    console.log(`All ${uniqueUrls.length} resource URL(s) resolved OK.`);
    return;
  }

  console.error(`\n${broken.length} broken resource URL(s):\n`);
  for (const result of broken) console.error(`  ${result.detail.padEnd(24)} ${result.url}`);
  process.exitCode = 1;
}

main();
