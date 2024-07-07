import { Camera, Eraser, Pen, Save, StopCircle, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useDraw } from "@/features/drawing/hooks/use-draw";
import { cn } from "@/lib/utils";

type DrawingCanvasProps = {
  setResult: (blob: Blob | null) => void;
};

export function Draw({ setResult }: DrawingCanvasProps) {
  const {
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
    onTouchStartHandler,
    onSaveHandler,
    onStopDrawingHandler,
  } = useDraw({ setResult });

  return (
    <div className="p-5">
      <div
        ref={parentRef}
        className="relative mx-auto size-[300px] overflow-hidden rounded-full border-2"
      >
        <video
          ref={videoRef}
          autoPlay
          className={cn(
            status === "capture" ? "absolute inset-0 size-full" : "hidden"
          )}
        >
          <track kind="captions" />
        </video>

        <canvas
          ref={canvasRef}
          onMouseDown={onDrawStartHandler}
          onMouseLeave={onStopDrawingHandler}
          onMouseMove={onDrawingHandler}
          onMouseUp={onStopDrawingHandler}
          onTouchEnd={onStopDrawingHandler}
          onTouchMove={onTouchDrawingHandler}
          onTouchStart={onTouchStartHandler}
        />
      </div>

      <div className="mt-10 flex items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center ">
          <Label htmlFor="pen-color">ペンの色</Label>
          <Input
            className="mt-4 size-20"
            disabled={status === "capture"}
            id="pen-color"
            onChange={(e) => setPen({ ...pen, color: e.target.value })}
            type="color"
            value={pen.color}
          />
        </div>
        <div className="flex w-60 flex-col items-center justify-center gap-2">
          <Label
            className="flex items-center justify-between"
            htmlFor="pen-size"
          >
            {
              {
                pen: "ペンの太さ",
                eraser: "消しゴムの太さ",
                capture: "キャプチャ中",
              }[status]
            }
          </Label>
          <Slider
            className="max-w-xs"
            color={pen.color}
            defaultValue={[4]}
            disabled={status === "capture"}
            max={10}
            onValueChange={(value) => setPen({ ...pen, size: value[0] })}
            step={2}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-center gap-6">
        <Button
          className={cn(status === "pen" && "border-primary border-2")}
          onClick={() => {
            if (status === "capture") onCaptureStopHandler();
            setStatus("pen");
          }}
          size="icon"
          type="button"
          variant="outline"
        >
          <span className="sr-only">ペン</span>
          <Pen size={24} />
        </Button>
        <Button
          className={cn(status === "eraser" && "border-primary border-2")}
          onClick={() => {
            if (status === "capture") onCaptureStopHandler();
            setStatus("eraser");
          }}
          size="icon"
          type="button"
          variant="outline"
        >
          <span className="sr-only">消しゴム</span>
          <Eraser size={24} />
        </Button>

        <Button
          onClick={() => {
            if (status === "capture") {
              onCaptureStopHandler();
            } else {
              onCaptureHandler();
            }
          }}
          size="icon"
          type="button"
          variant={status === "capture" ? "destructive" : "outline"}
        >
          <span className="sr-only">キャプチャ</span>
          {status === "capture" ? (
            <StopCircle size={24} />
          ) : (
            <Camera size={24} />
          )}
        </Button>

        <Button
          onClick={onClearHandler}
          size="icon"
          type="button"
          variant="destructive"
        >
          <span className="sr-only">初期化する</span>
          <Trash size={24} />
        </Button>
      </div>

      <div className="mt-10 flex w-full flex-col items-center justify-center">
        <Button className="gap-4" onClick={onSaveHandler} type="button">
          <span className="font-bold">保存する</span>
          <Save size={24} />
        </Button>
      </div>
    </div>
  );
}
