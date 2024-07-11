import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Status = "pen" | "eraser" | "capture";

type DrawingCanvasProps = {
  setResult: (blob: Blob | null) => void;
};

type Pen = {
  color: string;
  size: number;
};

export function useDraw({ setResult }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const [status, setStatus] = useState<Status>("pen");
  const [pen, setPen] = useState<Pen>({ color: "#000", size: 5 });
  const [isDrawing, setIsDrawing] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const getCtx = useCallback((): CanvasRenderingContext2D => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Canvas is not initialized");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context is not initialized");

    return ctx;
  }, []);

  const onClearHandler = useCallback(() => {
    const ctx = getCtx();

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    setResult(null);
  }, [getCtx, setResult]);

  const onCaptureHandler = useCallback(async () => {
    setStatus("capture");

    const video = videoRef.current;
    if (!video || !canvasRef.current) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("カメラ撮影に対応していません");

      setStatus("pen");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: canvasRef.current.width,
          height: canvasRef.current.height,
        },
      });

      video.srcObject = stream;
      video.play();
    } catch (error) {
      toast.error("カメラの起動に失敗しました。");
      setStatus("pen");
    }
  }, []);

  const onCaptureStopHandler = useCallback(() => {
    setStatus("pen");

    const video = videoRef.current;

    if (!video) return;

    video.pause();
    video.srcObject = null;
  }, []);

  const onDrawStartHandler = useCallback(
    (e: React.MouseEvent) => {
      const ctx = getCtx();
      setIsDrawing(true);

      ctx.strokeStyle = pen.color;
      ctx.lineWidth = pen.size;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    },
    [getCtx, pen.color, pen.size]
  );

  const onDrawingHandler = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing) return;
      const ctx = getCtx();
      const { offsetX, offsetY } = e.nativeEvent;

      if (status === "pen") {
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      }

      if (status === "eraser") {
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(offsetX, offsetY, pen.size * 2, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
      }
    },
    [getCtx, isDrawing, pen.size, status]
  );

  const onTouchDrawingHandler = useCallback(
    (e: React.TouchEvent) => {
      if (!isDrawing) return;

      const ctx = getCtx();

      const { clientX, clientY } = e.touches[0];

      if (status === "pen") {
        ctx.lineTo(clientX, clientY);
        ctx.stroke();
      }

      if (status === "eraser") {
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(clientX, clientY, pen.size * 2, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
      }
    },
    [getCtx, isDrawing, pen.size, status]
  );

  const onTouchStartHandler = useCallback(
    (e: React.TouchEvent) => {
      const ctx = getCtx();
      setIsDrawing(true);

      const { clientX, clientY } = e.touches[0];

      ctx.strokeStyle = pen.color;
      ctx.lineWidth = pen.size;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(clientX, clientY);
    },
    [getCtx, pen.color, pen.size]
  );

  const onSaveHandler = useCallback(() => {
    setStatus("pen");

    if (status === "capture") {
      const video = videoRef.current;
      if (!video) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      video.pause();
      video.srcObject = null;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = 300;
    const newCanvas = document.createElement("canvas");
    newCanvas.width = size;
    newCanvas.height = size;
    const newCtx = newCanvas.getContext("2d");
    if (!newCtx) return;

    // ボールの描画
    newCtx.beginPath();
    newCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, false);
    newCtx.clip();
    newCtx.drawImage(
      canvas,
      (size - canvas.width) / 2,
      (size - canvas.height) / 2,
      canvas.width,
      canvas.height
    );

    // 発光効果の追加
    // newCtx.filter = "blur(10px)";

    // newCtx.globalCompositeOperation = "lighter";

    // newCtx.strokeStyle = "#FFD700";
    // newCtx.lineWidth = 15; // 発光の幅
    newCtx.beginPath();
    // newCtx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2, false); // 発光の位置
    // newCtx.stroke();

    // 描画モードとフィルターを元に戻す
    newCtx.filter = "none";
    newCtx.globalCompositeOperation = "source-over";

    // 枠線の描画
    // newCtx.strokeStyle = "#FFD700";
    // newCtx.lineWidth = 2;
    // newCtx.beginPath();
    // newCtx.arc(size / 2, size / 2, size / 2 - 5, 0, Math.PI * 2, false);
    // newCtx.stroke();

    newCanvas.toBlob((blob) => {
      setResult(blob);
    });
  }, [setResult, status]);

  const onStopDrawingHandler = useCallback(() => {
    setIsDrawing(false);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !parentRef.current) return () => {};

    const canvas = canvasRef.current;
    const parent = parentRef.current;

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const onResize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return {
    canvasRef,
    parentRef,
    videoRef,
    status,
    pen,
    setStatus,
    setPen,
    onClearHandler,
    onCaptureHandler,
    onCaptureStopHandler,
    onDrawStartHandler,
    onDrawingHandler,
    onTouchDrawingHandler,
    onSaveHandler,
    onStopDrawingHandler,
    onTouchStartHandler,
  };
}
