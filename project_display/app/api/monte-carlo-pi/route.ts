import { spawn } from "node:child_process";
import path from "node:path";
import { NextResponse } from "next/server";

const SCRIPT_PATH = path.join(
  process.cwd(),
  "..",
  "projects",
  "MonteCarloPi",
  "simulate.py",
);
const MIN_POINTS = 100;
const MAX_POINTS = 20000;
const DEFAULT_POINTS = 2000;
const PYTHON_COMMANDS = ["python", "python3"];

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const requested = Number(body?.n);
  const n = Number.isFinite(requested)
    ? Math.min(MAX_POINTS, Math.max(MIN_POINTS, Math.round(requested)))
    : DEFAULT_POINTS;

  try {
    const stdout = await runSimulation(n);
    return NextResponse.json(JSON.parse(stdout));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Simulation failed" },
      { status: 500 },
    );
  }
}

function runSimulation(n: number): Promise<string> {
  return tryCommand(0);

  function tryCommand(index: number): Promise<string> {
    if (index >= PYTHON_COMMANDS.length) {
      return Promise.reject(new Error("Could not find a Python interpreter."));
    }

    return new Promise((resolve, reject) => {
      const child = spawn(PYTHON_COMMANDS[index], [SCRIPT_PATH, String(n)]);
      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk) => {
        stdout += chunk;
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
      child.on("error", (error) => {
        const err = error as NodeJS.ErrnoException;
        if (err.code === "ENOENT") {
          resolve(tryCommand(index + 1));
        } else {
          reject(err);
        }
      });
      child.on("close", (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(stderr || `python exited with code ${code}`));
        }
      });
    });
  }
}
