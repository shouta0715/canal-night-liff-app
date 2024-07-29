/* eslint-disable no-param-reassign */
import p5 from "p5";
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
];

export const useDrawing = ({ setResult }: UseDrawing) => {
  const { p, sketchRef, tool, color, setColor, setTool, getCanvas } = useP5();
  const facingMode = useRef<"user" | "environment">("user");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;

    setIsCameraMode(false);
  };

  const drawImageOnCanvas = (image: p5.Image) => {
    if (!p) return;
    p.image(image, 0, 0, p.width, p.height);
  };

  const handleTakePhoto = () => {
    const video = videoRef.current;

    if (!video) return;
    if (!p) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");

    p.loadImage(dataUrl, (img) => {
      drawImageOnCanvas(img);
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

  const applyGlowEffect = (rgb: string, diameter: number) => {
    if (!p) return;
    const radius = diameter / 2;
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
    const rgb = rgbs[Math.floor(Math.random() * rgbs.length)];
    applyGlowEffect(rgb, size);

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
    newCtx.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      size,
      size
    );

    newCanvas.toBlob((blob) => {
      setResult(blob);
    });
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
  };
};
