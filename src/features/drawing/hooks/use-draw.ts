/* eslint-disable no-param-reassign */
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useP5 } from "@/features/drawing/hooks/use-p5";

type UseDrawing = {
  setResult: (blob: Blob | null) => void;
};

const rgbs = [
  // Red
  "255, 0, 0",
  // Green
  "0, 255, 0",
  // Blue
  "0, 0, 255",
  // Yellow
  "255, 255, 0",
  // Purple
  "128, 0, 128",
  // Cyan
  "0, 255, 255",
  // Orange
  "255, 165, 0",
  // Pink
  "255, 192, 203",

  // Light Green
  "144, 238, 144",

  // Light Blue
  "173, 216, 230",

  // Light Yellow
  "255, 255, 224",

  // Light Purple
  "221, 160, 221",

  // Light Cyan
  "224, 255, 255",

  // Light Orange
  "255, 218, 185",
];

export const useDrawing = ({ setResult }: UseDrawing) => {
  const {
    p,
    sketchRef,
    tool,
    color,
    setColor,
    setTool,
    getCanvas,
    changeTool,
    clearCanvas,
    onOpenChange,
    weight,
    onWeightChange,
    weightList,
  } = useP5();

  const facingMode = useRef<"user" | "environment">("user");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const [bollColor, setBollColor] = useState(
    () => rgbs[Math.floor(Math.random() * rgbs.length)]
  );

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;

    setIsCameraMode(false);
  };

  const handleTakePhoto = () => {
    const video = videoRef.current;

    if (!video) return;
    if (!p) return;

    const { videoWidth, videoHeight } = video;

    const canvas = document.createElement("canvas");
    canvas.width = p.width;
    canvas.height = p.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // アスペクト比を計算
    const videoAspect = videoWidth / videoHeight;
    const canvasAspect = canvas.width / canvas.height;

    let sx;
    let sy;
    let sw;
    let sh;

    if (videoAspect > canvasAspect) {
      // ビデオが横長の場合、横幅を合わせて垂直方向を切り取る
      sw = videoHeight * canvasAspect;
      sh = videoHeight;
      sx = (videoWidth - sw) / 2;
      sy = 0;
    } else {
      // ビデオが縦長の場合、高さを合わせて水平方向を切り取る
      sw = videoWidth;
      sh = videoWidth / canvasAspect;
      sx = 0;
      sy = (videoHeight - sh) / 2;
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");

    p.loadImage(dataUrl, (img) => {
      p.image(img, 0, 0, canvas.width, canvas.height);
    });

    stopCamera();
    setIsCameraMode(false);
  };

  const startVideo = async () => {
    if (!isCameraMode) setIsCameraMode(true);
    try {
      if (!videoRef.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode.current,
        },
      });
      streamRef.current = stream; // Streamの参照を保存

      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      toast.error("Error accessing camera");
    }
  };

  const changeFacingMode = () => {
    facingMode.current = facingMode.current === "user" ? "environment" : "user";
    startVideo();
  };

  const changeCameraMode = () => {
    setIsCameraMode((prev) => {
      if (prev) {
        stopCamera();

        return false;
      }

      startVideo();

      return true;
    });
  };

  const applyGlowEffect = (diameter: number) => {
    if (!p) return;
    const radius = diameter / 2;
    const rgb = bollColor || rgbs[Math.floor(Math.random() * rgbs.length)];
    const gradient = p.drawingContext.createRadialGradient(
      p.width / 2,
      p.height / 2,
      0,
      p.width / 2,
      p.height / 2,
      radius
    );
    gradient.addColorStop(0, `rgba(${rgb}, 0.7)`);
    gradient.addColorStop(0.4, `rgba(${rgb}, 0.5)`);
    gradient.addColorStop(0.7, `rgba(${rgb}, 0.3)`);
    // 黒に近づく
    gradient.addColorStop(1, `rgba(0, 0, 0, 1)`);

    p.drawingContext.fillStyle = gradient;
    // p.noStroke();
    p.drawingContext.shadowColor = "black";
    p.ellipse(p.width / 2, p.height / 2, diameter, diameter);
  };

  const saveCanvas = () => {
    if (!p) return;
    const size = 310;

    applyGlowEffect(size);

    const canvas = getCanvas();
    if (!canvas) return;

    const newCanvas = document.createElement("canvas");
    newCanvas.width = size;
    newCanvas.height = size;
    const newCtx = newCanvas.getContext("2d");
    if (!newCtx) return;
    newCtx.clearRect(0, 0, size, size);
    newCtx.fillStyle = "white";

    // 黒で塗りつぶし
    newCtx.fillStyle = "black";
    newCtx.beginPath();
    newCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, false);
    newCtx.clip();
    newCtx.scale(-1, 1);

    newCtx.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      -size,
      0,
      size,
      size
    );

    newCanvas.toBlob((blob) => {
      setResult(blob);
    });
  };

  const changeColor = (c: string) => {
    setBollColor(c);
  };

  return {
    sketchRef,
    videoRef,
    tool,
    color,
    isCameraMode,
    changeCameraMode,
    setColor,
    setTool,
    handleTakePhoto,
    startVideo,
    changeFacingMode,
    stopCamera,
    saveCanvas,
    changeTool,
    clearCanvas,
    changeColor,
    bollColor,
    rgbs,
    onOpenChange,
    onWeightChange,
    weight,
    weightList,
  };
};
