import { useMutation } from "@tanstack/react-query";
import { DragHandlers, useAnimate, useMotionValue } from "framer-motion";
import { useRef } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

type UseResultProps = {
  result: Blob;
};

const postBlob = async (blob: Blob) => {
  const formData = new FormData();
  formData.append("image", blob);

  const response = await fetch(`${API_URL}/canal-night/images/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("アップロードに失敗しました");
  }
};

export function useResult({ result }: UseResultProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [scope, animate] = useAnimate<HTMLDivElement>();

  const y = useMotionValue(0);

  const onReset = () => {
    if (!ref.current || !scope.current) return;

    animate(scope.current, {
      y: 0,
    });
  };

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: postBlob,
    onError: () => {
      toast.error("アップロードに失敗しました");
      onReset();
    },
    onSuccess: () => {
      toast.success("アップロードしました");
    },
  });

  const onDragEnd: DragHandlers["onDragEnd"] = async (_, i) => {
    y.set(0);
    const offset = i.offset.y;
    const wrapperHeight = ref.current?.clientHeight ?? 0;

    if (offset < wrapperHeight / 3) {
      animate(scope.current, { y: 0 });
    } else {
      await animate(scope.current, {
        y: -offset * 2,
      });

      if (isPending || isSuccess) return;

      await mutateAsync(result);
    }
  };

  const onDrag: DragHandlers["onDrag"] = (_, info) => {
    if (info.offset.y < 0) return;
    y.set(info.offset.y);
  };

  return {
    ref,
    scope,
    isPending,
    isSuccess,
    onReset,
    onDragEnd,
    onDrag,
  };
}
