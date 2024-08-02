/* eslint-disable no-param-reassign */
import p5 from "p5";
import { useEffect, useRef, useState } from "react";

type Tool = "pen" | "eraser" | "camera";

const weightList = [6, 10, 14, 18, 22];

const defaultPenColors = [
  // カラーコード
  "#FF0000", // 赤
  "#00FF00", // 緑
  "#0000FF", // 青
  "#FFFF00", // 黄
  "#800080", // 紫
  "#00FFFF", // 水
  "#FFA500", // オレンジ
  "#FFC0CB", // ピンク
  "#90EE90", // ライトグリーン
  "#ADD8E6", // ライトブルー
  "#FFFFE0", // ライトイエロー
  "#DDA0DD", // ライトパープル
  "#E0FFFF", // ライトシアン
  "#FFDAB9", // ライトオレンジ
  "#000000", // 黒
  "#FFFFFF", // 白
  "#808080", // グレー
  "#C0C0C0", // シルバー
  "#800000", // マルーン
  "#008000", // オリーブ
  "#000080", // ネイビー
  "#808000", // オリーブ
  "#800080", // パープル
  "#008080", // ティール
  "#FF6347", // トマト
  "#FF7F50", // コーラル
  "#FFA07A", // ライトサーモン
  "#FF4500", // オレンジレッド
  "#FF8C00", // ダークオレンジ
  "#FFA500", // オレンジ
  "#FFD700", // ゴールド
  "#FF69B4", // ホットピンク
  "#FF1493", // ディープピンク
  "#FFB6C1", // ライトピンク
  "#FFC0CB", // ピンク
  "#FFA07A", // ライトサーモン
  "#FFA500", // オレンジ
  "#FF6347", // トマト
  "#FF4500", // オレンジレッド
  "#FF8C00", // ダークオレンジ
  "#FFD700", // ゴールド
  "#FF69B4", // ホットピンク
  "#FF1493", // ディープピンク
  "#FFB6C1", // ライトピンク
  "#FFC0CB", // ピンク
  "#FFA07A", // ライトサーモン
  "#FFA500", // オレンジ
  "#FF6347", // トマト
];

export function useP5() {
  const sketchRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const toolRef = useRef<Tool>("pen");
  const colorRef = useRef(
    defaultPenColors[Math.floor(Math.random() * defaultPenColors.length)]
  );
  const pI = useRef<p5 | null>(null);
  const isOpenRef = useRef(false);
  const [weight, setWeight] = useState(14);
  const weightRef = useRef(14);

  const [, setHasP5Instance] = useState(false);

  useEffect(() => {
    const sketch = (p: p5) => {
      const drawLine = (
        to: Tool,
        x1: number,
        y1: number,
        x2: number,
        y2: number
      ) => {
        const color = colorRef.current;
        const w = weightRef.current;

        if (to === "eraser") {
          p.stroke(255);
          p.strokeWeight(w);
        } else {
          p.stroke(color);
          p.strokeWeight(w);
        }
        p.line(x1, y1, x2, y2);
      };

      p.setup = () => {
        if (!sketchRef.current) return;

        p.createCanvas(
          sketchRef.current.offsetWidth,
          sketchRef.current.offsetHeight
        ).parent(sketchRef.current);
        p.background(255);
      };

      p.draw = () => {
        if (!p.mouseIsPressed) return;
        if (isOpenRef.current) return;
        const to = toolRef.current;
        const w = weightRef.current;

        if (to === "eraser") {
          p.stroke(255);
          p.strokeWeight(w);
        } else {
          p.stroke(colorRef.current);
          p.strokeWeight(w);
        }
        p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
      };

      p.touchMoved = () => {
        if (isOpenRef.current) return true;
        for (const touch of p.touches) {
          const t = touch as unknown as { x: number; y: number };
          drawLine(toolRef.current, t.x, t.y, t.x, t.y);
        }

        return false;
      };
    };

    // eslint-disable-next-line new-cap
    pI.current = new p5(sketch);

    return () => {
      pI.current?.remove();
      pI.current = null;
    };
  }, []);

  useEffect(() => {
    if (pI) {
      setHasP5Instance(true);
    }
  }, [pI]);

  const setColor = (color: string) => {
    colorRef.current = color;
  };

  const color = colorRef.current;

  const getCanvas = () => {
    const c = sketchRef.current?.querySelector("canvas");

    return c;
  };

  const changeTool = (t: Tool) => {
    toolRef.current = t;
    setTool(t);
  };

  const clearCanvas = () => {
    pI.current?.background(255);
  };

  const onOpenChange = (isOpen: boolean) => {
    isOpenRef.current = isOpen;
  };

  const onWeightChange = (w: string) => {
    const num = parseInt(w, 10);
    if (Number.isNaN(num)) return;
    weightRef.current = num;
    setWeight(num);
  };

  return {
    sketchRef,
    setColor,
    setTool,
    tool,
    color,
    p: pI.current,
    changeTool,
    getCanvas,
    clearCanvas,
    onOpenChange,
    onWeightChange,
    weight,
    weightList,
  };
}
