import { createCanvas, type Canvas } from "@napi-rs/canvas";
import { vi } from "vitest";

const canvases = new WeakMap<HTMLCanvasElement, Canvas>();

function backingCanvas(element: HTMLCanvasElement) {
  let canvas = canvases.get(element);
  if (!canvas) {
    canvas = createCanvas(element.width, element.height);
    canvases.set(element, canvas);
  }
  return canvas;
}

// jsdom provides DOM events; a native canvas provides actual pixel rendering.
for (const dimension of ["width", "height"] as const) {
  const descriptor = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, dimension)!;
  Object.defineProperty(HTMLCanvasElement.prototype, dimension, {
    ...descriptor,
    set(value: number) {
      descriptor.set!.call(this, value);
      const canvas = canvases.get(this);
      if (canvas) canvas[dimension] = value;
    },
  });
}

vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(function (type: string) {
  if (type !== "2d") return null;
  return backingCanvas(this).getContext("2d") as unknown as CanvasRenderingContext2D;
} as HTMLCanvasElement["getContext"]);

vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockImplementation(function () {
  return backingCanvas(this).toDataURL("image/png");
});

// Unwrap DOM canvases when copying between the visible and off-screen buffers.
const contextPrototype = Object.getPrototypeOf(createCanvas(1, 1).getContext("2d"));
const drawImage = contextPrototype.drawImage;
contextPrototype.drawImage = function (image: unknown, ...args: number[]) {
  return drawImage.call(this, image instanceof HTMLCanvasElement ? backingCanvas(image) : image, ...args);
};
