import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useResult } from "@/features/drawing/hooks/use-result";

type ResultCanvasProps = {
  result: Blob;
  onClear: () => void;
};

export const DrawResult = ({ result, onClear }: ResultCanvasProps) => {
  const {
    ref,
    d,
    scope,
    onReset,
    onDragEnd,
    onDrag,
    isPending,
    isSuccess,
    width,
  } = useResult({ result });

  return (
    <div
      ref={ref}
      className="relative flex h-[70vh] flex-col items-center justify-center overflow-hidden"
    >
      <motion.div
        ref={scope}
        className="relative mx-auto size-72 cursor-grab overflow-hidden rounded-full border-2 active:cursor-grabbing md:size-96"
        drag="y"
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      >
        <img
          alt="Drawing result"
          className="pointer-events-none absolute inset-0 size-full"
          sizes="(min-width: 640px) 640px, 100vw"
          src={URL.createObjectURL(result)}
        />
      </motion.div>

      <div className="absolute right-10 top-0 mt-10 flex items-center gap-6">
        <Button disabled={isPending} onClick={onReset}>
          {isPending ? "アップロード中" : "元の位置に戻す"}
        </Button>
        <Button
          disabled={isPending || isSuccess}
          onClick={onClear}
          variant="destructive"
        >
          {isPending ? "アップロード中" : "書き直す"}
        </Button>
      </div>
      <motion.svg
        className="absolute inset-0 top-[calc(50%+18rem)] -z-10"
        viewBox={`0 0 ${width} 1000`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          className="w-full"
          d={d}
          fill="transparent"
          stroke="black"
        />
      </motion.svg>

      {isSuccess && (
        <Button className="mt-6" onClick={onClear}>
          もう一度書く
        </Button>
      )}
    </div>
  );
};
