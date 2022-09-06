export interface Watermark {
  text?: string;
  font?: string;
  x?: number;
  y?: number;
  sx?: number;
  sy?: number;
  fillStyle?: string
  strokeStyle?: string
  style?: "all" | "stroke" | "fill"
}
