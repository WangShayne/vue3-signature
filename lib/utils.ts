
import type { App, Plugin, Component } from "vue";
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
export type SFCWithInstall<T> = T & Plugin

export function withInstall<T>(c: T) {
    (c as SFCWithInstall<T>).install = (app: App) => {
        app.component((c as Component).name, c);
    }
    return c as SFCWithInstall<T>
}
