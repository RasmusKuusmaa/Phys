"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SimPoint = { x: number; y: number; inside: boolean };
type SimResult = {
  n: number;
  insideCount: number;
  piEstimate: number;
  points: SimPoint[];
};

const POINT_OPTIONS = [500, 2000, 5000, 20000];
const CANVAS_SIZE = 320;

export default function MonteCarloPiPage() {
  const [n, setN] = useState(POINT_OPTIONS[1]);
  const [result, setResult] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function runSimulation() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/monte-carlo-pi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }
      setResult(data as SimResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    ctx.strokeStyle = "#a1a1aa";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, size - 1, size - 1);

    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const theta = (Math.PI / 2) * (i / 100);
      const px = Math.cos(theta) * size;
      const py = size - Math.sin(theta) * size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();

    for (const point of result.points) {
      ctx.fillStyle = point.inside ? "#22c55e" : "#f43f5e";
      ctx.beginPath();
      ctx.arc(point.x * size, size - point.y * size, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [result]);

  const piError = result ? Math.abs(result.piEstimate - Math.PI) : null;

  return (
    <div className="flex flex-1 flex-col items-center gap-6 bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Monte Carlo Pi
      </h1>
      <p className="max-w-md text-center text-zinc-600 dark:text-zinc-400">
        Estimating π by randomly scattering points in a unit square and
        checking what fraction land inside the inscribed quarter circle.
      </p>

      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          Points
          <select
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="rounded-md border border-black/[.08] bg-white px-2 py-1 text-black dark:border-white/[.145] dark:bg-[#111] dark:text-zinc-50"
          >
            {POINT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.toLocaleString()}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={runSimulation}
          disabled={loading}
          className="flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {loading ? "Running…" : "Run simulation"}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {result && (
        <div className="flex flex-col items-center gap-3">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="rounded-lg border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-[#0a0a0a]"
          />
          <div className="flex flex-col items-center text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              π ≈{" "}
              <span className="font-mono font-medium text-black dark:text-zinc-50">
                {result.piEstimate.toFixed(5)}
              </span>{" "}
              ({result.insideCount.toLocaleString()} /{" "}
              {result.n.toLocaleString()} inside)
            </p>
            <p>error: {piError?.toFixed(5)}</p>
          </div>
        </div>
      )}

      <Link
        href="/projects"
        className="mt-2 text-sm font-medium text-black underline underline-offset-4 dark:text-zinc-50"
      >
        Back
      </Link>
    </div>
  );
}
