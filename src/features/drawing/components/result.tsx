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
    imageWrapperRef,
    animationControls,
    onReset,
    onDragEnd,
    onDragStart,
    isPending,
    isSuccess,
  } = useResult({ result });

  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <div
        ref={ref}
        className="w-5/6 overflow-hidden rounded-md border-2 py-40"
      >
        <motion.div
          ref={imageWrapperRef}
          animate={animationControls}
          className="relative mx-auto size-72 overflow-hidden rounded-full border-2 md:size-96"
          drag="y"
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
        >
          <img
            alt="Drawing result"
            className="pointer-events-none absolute inset-0 size-full"
            sizes="(min-width: 640px) 640px, 100vw"
            src={URL.createObjectURL(result)}
          />
        </motion.div>
      </div>

      <div className="mt-10 flex items-center gap-6">
        <Button disabled={isPending || isSuccess} onClick={onReset}>
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

      {isSuccess && (
        <Button className="mt-6" onClick={onClear}>
          もう一度書く
        </Button>
      )}
    </div>
  );
};
