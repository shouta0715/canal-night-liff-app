import { useState } from "react";
import { Draw } from "@/features/drawing/components/draw";
import { DrawResult } from "@/features/drawing/components/result";

export function DrawingApp() {
  const [result, setResult] = useState<Blob | null>(null);

  return (
    <div>
      {result ? (
        <DrawResult onClear={() => setResult(null)} result={result} />
      ) : (
        <Draw setResult={setResult} />
      )}
    </div>
  );
}
