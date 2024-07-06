import { useMutation } from "@tanstack/react-query";
import { DragHandlers, useAnimationControls } from "framer-motion";
import { useRef } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

type UseResultProps = {
  result: Blob;
};

const postBlob = async (blob: Blob) => {
  const formData = new FormData();
  formData.append("image", blob);

  const response = await fetch(`${API_URL}/river-ball/images/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("アップロードに失敗しました");
  }
};

export function useResult({ result }: UseResultProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);

  const animationControls = useAnimationControls();

  const onReset = () => {
    if (!ref.current || !imageWrapperRef.current) return;

    animationControls.start({
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

  const dragStartY = useRef(0);

  const onDragEnd = () => {
    if (!ref.current || !imageWrapperRef.current) return;

    const imageRect = imageWrapperRef.current.getBoundingClientRect();

    if (Math.abs(dragStartY.current - imageRect.top) > 500) {
      if (isPending || isSuccess) return;

      mutateAsync(result);
    } else {
      onReset();
    }
  };

  const onDragStart: DragHandlers["onDragStart"] = (_, info) => {
    if (!info.point) return;
    dragStartY.current = info.point.y;
  };

  return {
    ref,
    imageWrapperRef,
    animationControls,
    isPending,
    isSuccess,
    onReset,
    onDragEnd,
    onDragStart,
  };
}
