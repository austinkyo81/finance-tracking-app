"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: "#0b0f1a" }}
    >
      <div
        className="max-w-lg w-full rounded-xl p-8 space-y-4"
        style={{ backgroundColor: "#111827", border: "1px solid #1e2d45" }}
      >
        <h2 className="text-lg font-semibold text-white">Something went wrong</h2>
        <p className="text-sm" style={{ color: "#8ba4c0" }}>
          {error.message || "An unexpected server error occurred."}
        </p>
        {error.digest && (
          <p className="text-xs font-mono" style={{ color: "#4a6080" }}>
            Digest: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#1e3a5f" }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
