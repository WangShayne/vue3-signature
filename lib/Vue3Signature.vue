<template>
  <div class="vue3-signature" :style="{ width: w, height: h }" @touchmove.prevent>
    <canvas
      ref="canvasRef"
      class="vue3-signature__canvas"
      :class="{ 'vue3-signature__canvas--disabled': disabled }"
      :data-uid="canvasUid"
      :aria-disabled="disabled ? 'true' : undefined"
      :style="canvasStyle"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import SignaturePad, {
  type FromDataOptions,
  type FromDataUrlOptions,
  type Options as SigOptions,
  type PointGroup,
  type SignatureEvent,
  type ToSVGOptions,
} from "signature_pad";
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  shallowRef,
  watch,
} from "vue";
import type { PropType, StyleValue } from "vue";
import type { Watermark } from "./utils";
import type { TrimBounds, TrimOptions, TrimResult } from "./types";

const canvasStyle: StyleValue = {
  width: "100%",
  height: "100%",
};

const emit = defineEmits<{
  (e: "ready", pad: SignaturePad): void;
  (e: "begin"): void;
  (e: "end"): void;
  (e: "beginStroke", event: SignatureEvent): void;
  (e: "endStroke", event: SignatureEvent): void;
  (e: "beforeUpdateStroke", event: SignatureEvent): void;
  (e: "afterUpdateStroke", event: SignatureEvent): void;
}>();

const props = defineProps({
  sigOption: {
    type: Object as PropType<SigOptions>,
    default: () => ({}),
  },
  w: {
    type: String,
    default: "100%",
  },
  h: {
    type: String,
    default: "100%",
  },
  clearOnResize: {
    type: Boolean,
    default: false,
  },
  waterMark: {
    type: Object as PropType<Watermark>,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  defaultUrl: {
    type: String,
    default: "",
  },
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasUid = `canvas-${Math.random().toString(36).slice(2, 9)}`;
const signaturePad = shallowRef<SignaturePad | null>(null);
const optionState = reactive<SigOptions>({
  backgroundColor: "rgb(255,255,255)",
  penColor: "rgb(0, 0, 0)",
  minWidth: 0.5,
  maxWidth: 2.5,
  ...props.sigOption,
});

interface PreservedSignatureState {
  hasSignature: boolean;
  strokes: PointGroup[];
  dataUrl?: string;
}

let colorParserCtx: CanvasRenderingContext2D | null = null;
const colorCache = new Map<string, [number, number, number, number]>();

const ensureColorParser = () => {
  if (typeof document === "undefined") {
    return null;
  }
  if (colorParserCtx) {
    return colorParserCtx;
  }
  const parserCanvas = document.createElement("canvas");
  parserCanvas.width = 1;
  parserCanvas.height = 1;
  colorParserCtx = parserCanvas.getContext("2d");
  return colorParserCtx;
};

const colorToRgba = (color?: string | null): [number, number, number, number] | null => {
  if (!color) {
    return null;
  }
  if (colorCache.has(color)) {
    return colorCache.get(color) as [number, number, number, number];
  }
  const ctx = ensureColorParser();
  if (!ctx) {
    return null;
  }
  ctx.clearRect(0, 0, 1, 1);
  try {
    ctx.fillStyle = color;
  } catch (error) {
    console.warn(`[vue3-signature] Unable to parse color "${color}"`, error);
    return null;
  }
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  const rgba: [number, number, number, number] = [data[0], data[1], data[2], data[3]];
  colorCache.set(color, rgba);
  return rgba;
};

const findTrimBounds = (
  canvas: HTMLCanvasElement,
  backgroundColor?: string,
): TrimBounds | null => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }
  const { width, height } = canvas;
  if (width === 0 || height === 0) {
    return null;
  }
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const bg = colorToRgba(backgroundColor);

  let top = height;
  let left = width;
  let right = -1;
  let bottom = -1;

  const matchesBackground = (index: number) => {
    if (!bg) {
      return data[index + 3] === 0;
    }
    return (
      data[index] === bg[0] &&
      data[index + 1] === bg[1] &&
      data[index + 2] === bg[2] &&
      data[index + 3] === bg[3]
    );
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      if (!matchesBackground(index)) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }

  if (right === -1 || bottom === -1) {
    return null;
  }

  const boundingWidth = right - left + 1;
  const boundingHeight = bottom - top + 1;

  if (boundingWidth <= 0 || boundingHeight <= 0) {
    return null;
  }

  return {
    x: left,
    y: top,
    width: boundingWidth,
    height: boundingHeight,
  };
};

const padEventHandlers: Array<{ type: string; listener: EventListener }> = [];

const mergeSigOptions = (incoming?: SigOptions) => {
  if (!incoming) return;
  Object.entries(incoming).forEach(([key, value]) => {
    if (value === undefined) return;
    (optionState as Record<string, unknown>)[key] = value;
  });
};

const destroySignaturePad = () => {
  teardownPadEvents();
  signaturePad.value?.off();
  signaturePad.value = null;
};

const captureSignatureState = (pad: SignaturePad): PreservedSignatureState => {
  let dataUrl: string | undefined;
  let strokes: PointGroup[] = [];
  const hasSignature = !pad.isEmpty();

  try {
    strokes = pad.toData();
  } catch (error) {
    console.warn("[vue3-signature] Failed to read signature data", error);
  }

  if (hasSignature) {
    try {
      dataUrl = pad.toDataURL();
    } catch (error) {
      console.warn("[vue3-signature] Failed to capture dataURL", error);
    }
  }

  return {
    hasSignature,
    strokes,
    dataUrl,
  };
};

const restoreSignatureState = (state?: PreservedSignatureState) => {
  if (!state || !signaturePad.value || !state.hasSignature) {
    return;
  }

  if (state.strokes?.length) {
    signaturePad.value.fromData(state.strokes);
    return;
  }

  if (state.dataUrl) {
    signaturePad.value.fromDataURL(state.dataUrl).catch((): void => undefined);
  }
};

const setupPadEvents = () => {
  if (!signaturePad.value) return;

  teardownPadEvents();

  const map: Record<string, (event: SignatureEvent) => void> = {
    beginStroke: (event) => emit("beginStroke", event),
    endStroke: (event) => emit("endStroke", event),
    beforeUpdateStroke: (event) => emit("beforeUpdateStroke", event),
    afterUpdateStroke: (event) => emit("afterUpdateStroke", event),
  };

  Object.entries(map).forEach(([type, handler]) => {
    const listener: EventListener = (evt) => {
      const detail = (evt as CustomEvent<SignatureEvent>).detail;
      handler(detail);
    };
    signaturePad.value?.addEventListener(type, listener);
    padEventHandlers.push({ type, listener });
  });

  (signaturePad.value as any).onBegin = () => emit("begin");
  (signaturePad.value as any).onEnd = () => emit("end");
};

function teardownPadEvents() {
  if (!signaturePad.value || !padEventHandlers.length) return;

  padEventHandlers.forEach(({ type, listener }) => {
    signaturePad.value?.removeEventListener(type, listener);
  });
  padEventHandlers.length = 0;
}

const applyDisabledState = (disabled: boolean) => {
  if (!signaturePad.value) return;
  if (disabled) {
    signaturePad.value.off();
  } else {
    signaturePad.value.on();
  }
};

const resolveSize = (value: string, fallback: number) => {
  if (/px$/i.test(value)) {
    const parsed = Number(value.replace(/px/gi, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

const resizeCanvas = () => {
  const canvas = canvasRef.value;
  const pad = signaturePad.value;
  if (!canvas || !pad) return;

  let preserved: PreservedSignatureState | undefined;
  if (!props.clearOnResize && !pad.isEmpty()) {
    preserved = captureSignatureState(pad);
  }

  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  const parent = canvas.parentElement as HTMLElement | null;
  const fallbackWidth = parent?.clientWidth ?? canvas.offsetWidth;
  const fallbackHeight = parent?.clientHeight ?? canvas.offsetHeight;

  const width = resolveSize(props.w, fallbackWidth);
  const height = resolveSize(props.h, fallbackHeight);

  canvas.width = width * ratio;
  canvas.height = height * ratio;

  const ctx = canvas.getContext("2d");
  ctx?.scale(ratio, ratio);

  pad.clear();

  if (preserved) {
    restoreSignatureState(preserved);
  } else if (Object.keys(props.waterMark).length) {
    addWaterMark(props.waterMark);
  }
};

const loadDefaultSignature = (url?: string) => {
  if (!url || !signaturePad.value) return;
  signaturePad.value.fromDataURL(url).catch((): void => undefined);
};

const getEffectiveBackgroundColor = (override?: string) =>
  override ?? signaturePad.value?.backgroundColor ?? optionState.backgroundColor ?? "rgba(0,0,0,0)";

const trim = (options?: TrimOptions): TrimResult | null => {
  const canvas = canvasRef.value;
  const pad = signaturePad.value;
  if (!canvas || !pad || pad.isEmpty()) {
    return null;
  }

  const bounds = findTrimBounds(canvas, getEffectiveBackgroundColor(options?.backgroundColor));
  if (!bounds) {
    return null;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }

  const trimmedCanvas = document.createElement("canvas");
  trimmedCanvas.width = bounds.width;
  trimmedCanvas.height = bounds.height;
  const trimmedCtx = trimmedCanvas.getContext("2d");
  if (!trimmedCtx) {
    return null;
  }

  const imageData = ctx.getImageData(bounds.x, bounds.y, bounds.width, bounds.height);
  trimmedCtx.putImageData(imageData, 0, 0);

  let dataUrl: string;
  if (options?.format) {
    dataUrl = trimmedCanvas.toDataURL(options.format, options.encoderOptions);
  } else {
    dataUrl = trimmedCanvas.toDataURL();
  }

  return {
    canvas: trimmedCanvas,
    dataUrl,
    bounds,
  };
};

const toTrimmedDataURL = (format?: TrimOptions["format"], encoderOptions?: number) =>
  trim({ format, encoderOptions })?.dataUrl ?? "";

const addWaterMark = (data: Watermark) => {
  if (!(Object.prototype.toString.call(data) === "[object Object]")) {
    throw new Error("Expected Object, got " + typeof data + ".");
  }

  const canvas = canvasRef.value;
  const pad = signaturePad.value;
  if (!canvas || !pad) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const {
    text = "",
    x = 20,
    y = 20,
    sx = 40,
    sy = 40,
    font = "20px sans-serif",
    fillStyle = "#333",
    strokeStyle = "#333",
    style = "fill",
  } = data;

  ctx.save();
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;

  if (style === "all") {
    ctx.fillText(text, x, y);
    ctx.strokeText(text, sx, sy);
  } else if (style === "stroke") {
    ctx.strokeText(text, sx, sy);
  } else {
    ctx.fillText(text, x, y);
  }
  ctx.restore();
  (pad as any)._isEmpty = false;
};

const initSignaturePad = async (preserve = false) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const previousState = preserve && signaturePad.value
    ? captureSignatureState(signaturePad.value)
    : undefined;

  destroySignaturePad();

  signaturePad.value = new SignaturePad(canvas, { ...optionState });
  setupPadEvents();
  applyDisabledState(props.disabled);

  await nextTick();
  resizeCanvas();

  if (previousState) {
    restoreSignatureState(previousState);
  } else if (props.defaultUrl) {
    loadDefaultSignature(props.defaultUrl);
  } else if (Object.keys(props.waterMark).length) {
    addWaterMark(props.waterMark);
  }

  emit("ready", signaturePad.value);
};

const clear = () => signaturePad.value?.clear();
const redraw = () => signaturePad.value?.redraw();
const toDataURL = (
  format?: Parameters<SignaturePad["toDataURL"]>[0],
  encoderOptions?: number | ToSVGOptions,
) => (signaturePad.value ? signaturePad.value.toDataURL(format as any, encoderOptions as any) : "");
const toSVG = (options?: ToSVGOptions) => signaturePad.value?.toSVG(options) ?? "";
const save = toDataURL;
const fromDataURL = (url: string, options?: FromDataUrlOptions) =>
  signaturePad.value?.fromDataURL(url, options);
const fromData = (pointGroups: PointGroup[], options?: FromDataOptions) =>
  signaturePad.value?.fromData(pointGroups, options);
const toData = () => signaturePad.value?.toData() ?? [];
const isEmpty = () => signaturePad.value?.isEmpty() ?? true;
const enable = () => signaturePad.value?.on();
const disable = () => signaturePad.value?.off();
const addPadEventListener = (
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
) => signaturePad.value?.addEventListener(type, listener, options);
const removePadEventListener = (
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | EventListenerOptions,
) => signaturePad.value?.removeEventListener(type, listener, options);
const undo = (steps = 1) => {
  const pad = signaturePad.value;
  if (!pad || steps <= 0) return;
  const data = pad.toData();
  if (!data.length) return;
  data.splice(Math.max(data.length - steps, 0), steps);
  pad.fromData(data);
};
const getInstance = () => signaturePad.value;

watch(
  () => props.sigOption,
  (value) => {
    mergeSigOptions(value);
    initSignaturePad(true);
  },
  { deep: true },
);

watch(
  () => props.disabled,
  (val) => applyDisabledState(val),
  { immediate: true },
);

watch(
  () => props.defaultUrl,
  (url) => loadDefaultSignature(url),
);

watch(
  () => [props.w, props.h],
  () => resizeCanvas(),
);

watch(
  () => props.waterMark,
  (mark) => {
    if (mark && Object.keys(mark).length) {
      addWaterMark(mark);
    }
  },
  { deep: true },
);

onMounted(() => {
  initSignaturePad();
  window.addEventListener("resize", resizeCanvas);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeCanvas);
  destroySignaturePad();
});

defineExpose({
  clear,
  save,
  toDataURL,
  toTrimmedDataURL,
  toSVG,
  fromDataURL,
  fromData,
  toData,
  redraw,
  isEmpty,
  undo,
  addWaterMark,
  trim,
  enable,
  disable,
  addEventListener: addPadEventListener,
  removeEventListener: removePadEventListener,
  getInstance,
});
</script>

<script lang="ts">
export default {
  name: "Vue3Signature",
};
</script>

<style scoped>
.vue3-signature__canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
