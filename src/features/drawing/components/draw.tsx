import { Eraser, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDrawing } from "@/features/drawing/hooks/use-draw";
import { cn } from "@/lib/utils";

type DrawingCanvasProps = {
  setResult: (blob: Blob | null) => void;
};

export function Draw({ setResult }: DrawingCanvasProps) {
  const {
    sketchRef,
    videoRef,
    setColor,
    setTool,
    handleTakePhoto,
    changeFacingMode,
    changeCameraMode,
    isCameraMode,
    tool,
    saveCanvas,
  } = useDrawing({ setResult });

  return (
    <div className="flex flex-col p-5">
      <div className="grid items-center justify-center gap-4">
        <div className="flex items-center justify-between space-x-2">
          <Button
            className="flex items-center gap-2"
            disabled={isCameraMode}
            onClick={() => setTool("pen")}
            type="button"
            variant={tool === "pen" ? "default" : "outline"}
          >
            <Pen size={16} />
            ペン
          </Button>
          <Button
            className="flex items-center gap-2"
            disabled={isCameraMode}
            onClick={() => setTool("eraser")}
            type="button"
            variant={tool === "eraser" ? "default" : "outline"}
          >
            <Eraser size={16} />
            消しゴム
          </Button>
          <input
            className="size-12"
            disabled={tool === "eraser"}
            onChange={(e) => setColor(e.target.value)}
            type="color"
          />
        </div>
        {isCameraMode && (
          <div className="flex items-center justify-between space-x-2">
            <Button onClick={handleTakePhoto} type="button">
              写真を撮る
            </Button>
            <Button onClick={changeFacingMode} type="button">
              カメラの向きを変える
            </Button>
          </div>
        )}

        <div>
          <Button
            className="w-full"
            onClick={changeCameraMode}
            type="button"
            variant={isCameraMode ? "default" : "outline"}
          >
            {isCameraMode
              ? "手書きモードに切り替える"
              : "カメラモードに切り替える"}
          </Button>
        </div>

        {!isCameraMode && (
          <Button disabled={isCameraMode} onClick={saveCanvas} type="button">
            保存して次へ
          </Button>
        )}
      </div>

      <div className="relative mx-auto mt-10 aspect-square size-[300px] flex-1 overflow-hidden rounded-full border-2">
        <video
          ref={videoRef}
          autoPlay
          className={cn(
            "size-full object-cover absolute inset-0 bg-white",
            isCameraMode ? "z-20" : "-z-10"
          )}
          muted
          playsInline
        />
        <div
          ref={sketchRef}
          className={cn(
            "size-full [&>canvas]:object-cover inset-0 absolute [&>canvas]:size-full",
            isCameraMode ? "-z-20" : "z-10"
          )}
        />
      </div>
    </div>
  );
}
