export interface TrimBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TrimResult {
  canvas: HTMLCanvasElement;
  dataUrl: string;
  bounds: TrimBounds;
}

export interface TrimOptions {
  format?: Parameters<HTMLCanvasElement["toDataURL"]>[0];
  encoderOptions?: number;
  backgroundColor?: string;
}
