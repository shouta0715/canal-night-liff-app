import { ArrowUpRight, Eraser, Pen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    handleTakePhoto,
    changeFacingMode,
    changeCameraMode,
    isCameraMode,
    tool,
    saveCanvas,
    changeTool,
    clearCanvas,
    bollColor,
    changeColor,
    rgbs,
    onOpenChange,
    weight,
    onWeightChange,
    weightList,
  } = useDrawing({ setResult });

  return (
    <div className="flex flex-col px-2 py-4">
      <div className="grid items-center justify-center gap-4">
        <div className="flex items-center justify-between space-x-2">
          <Select
            defaultValue={weight.toString()}
            onOpenChange={onOpenChange}
            onValueChange={onWeightChange}
          >
            <SelectTrigger
              className="size-10 items-center justify-center border-border p-0"
              showArrow={false}
            >
              <SelectValue
                placeholder={
                  <div
                    className="rounded-full bg-primary"
                    style={{
                      width: `${weight}px`,
                      height: `${weight}px`,
                    }}
                  />
                }
              />
            </SelectTrigger>
            <SelectContent>
              {weightList.map((w) => (
                <SelectItem
                  key={w}
                  className="h-10 items-center justify-center pl-2"
                  value={w.toString()}
                >
                  <div
                    className="rounded-full bg-primary "
                    style={{
                      width: `${w}px`,
                      height: `${w}px`,
                    }}
                  />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="flex items-center gap-2"
            disabled={isCameraMode}
            onClick={() => changeTool("pen")}
            type="button"
            variant={tool === "pen" ? "default" : "outline"}
          >
            <Pen size={16} />
            ペン
          </Button>
          <Button
            className="flex items-center gap-2"
            disabled={isCameraMode}
            onClick={() => changeTool("eraser")}
            type="button"
            variant={tool === "eraser" ? "default" : "outline"}
          >
            <Eraser size={16} />
            けしゴム
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
              しゃしんをとる
            </Button>
            <Button onClick={changeFacingMode} type="button">
              カメラのむきをかえる
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={changeCameraMode}
            type="button"
            variant="outline"
          >
            {isCameraMode ? "てがきモードへ" : "カメラモードへ"}
          </Button>
          <Button
            className="flex items-center gap-2"
            disabled={isCameraMode}
            onClick={clearCanvas}
            size="icon"
            variant="destructive"
          >
            <Trash size={16} />
          </Button>
        </div>

        {!isCameraMode && (
          <div className="flex items-center gap-2">
            <Button
              className="flex-1 gap-1"
              disabled={isCameraMode}
              onClick={saveCanvas}
              type="button"
            >
              とうこうページへ
              <ArrowUpRight size={16} />
            </Button>
            <div>
              <Select
                defaultValue={bollColor}
                onOpenChange={onOpenChange}
                onValueChange={changeColor}
              >
                <SelectTrigger className="w-36 items-center border-border">
                  <div className="flex items-center gap-1">
                    <span className="text-xs">ボールのいろ</span>
                    <div
                      className="size-4 rounded-full"
                      style={{ backgroundColor: `rgba(${bollColor},1)` }}
                    />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-52">
                  {rgbs.map((rgb) => (
                    <SelectItem
                      key={rgb}
                      className="items-center justify-center pl-2"
                      value={rgb}
                    >
                      <div
                        className="size-6 rounded-full"
                        style={{ backgroundColor: `rgba(${rgb},1)` }}
                      />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="relative mx-auto mt-10 aspect-square size-[300px] max-w-full flex-1 overflow-hidden rounded-full border-2">
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
            "size-full [&>canvas]:object-cover inset-0 absolute [&>canvas]:size-full [&>canvas]:border-[var(--color)] [&>canvas]:border-[6px] [&>canvas]:rounded-full",
            isCameraMode ? "-z-20" : "z-10"
          )}
          style={
            {
              "--color": `rgba(${bollColor},1)`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}
