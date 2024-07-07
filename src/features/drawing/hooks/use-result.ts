import { useMutation } from "@tanstack/react-query";
import {
  DragHandlers,
  useAnimate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

  const [scope, animate] = useAnimate<HTMLDivElement>();

  const [width, setWidth] = useState(window.innerWidth);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const d = useTransform(y, (v) => {
    const controlPoint1X = width / 2;
    const controlPoint2X = width / 2;
    const controlPointY = 25 + v;

    return `M0,25 C${controlPoint1X},${controlPointY} ${controlPoint2X},${controlPointY} ${width},25`;
  });

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
    d,
    width,
  };
}
