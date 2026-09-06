import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises, type VueWrapper } from "@vue/test-utils";
import SignaturePad from "signature_pad";
import Vue3Signature from "../lib/Vue3Signature.vue";

const wrappers: VueWrapper[] = [];

async function setup(props: Record<string, unknown> = {}) {
  const wrapper = mount(Vue3Signature, { props: { w: "100px", h: "80px", ...props } });
  wrappers.push(wrapper);
  await flushPromises();
  return wrapper;
}

function draw(wrapper: Awaited<ReturnType<typeof setup>>) {
  wrapper.vm.fromData([{
    penColor: "black", dotSize: 2, minWidth: 1, maxWidth: 2,
    velocityFilterWeight: 0.7, compositeOperation: "source-over",
    points: [{ x: 20, y: 20, time: 1, pressure: 0.5 }],
  }]);
}

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.clearAllMocks();
});

describe("trim (#33)", () => {
  it("reads pixels only on canvases created for frequent readback", async () => {
    const wrapper = await setup();
    draw(wrapper);
    const canvas = wrapper.get("canvas").element;
    const read = vi.spyOn(canvas.getContext("2d")!, "getImageData");
    const before = canvas.toDataURL();
    const result = wrapper.vm.trim();
    expect(result).not.toBeNull();
    expect(result!.bounds).toEqual({ x: 18, y: 18, width: 4, height: 4 });
    expect(canvas.toDataURL()).toBe(before);
    expect(read).not.toHaveBeenCalled();
    const calls = vi.mocked(HTMLCanvasElement.prototype.getContext);
    const firstCalls = new Map<HTMLCanvasElement, unknown>();
    calls.mock.contexts.forEach((context, index) => {
      if (!firstCalls.has(context)) firstCalls.set(context, calls.mock.calls[index][1]);
    });
    expect([...firstCalls.values()].filter((options: any) => options?.willReadFrequently)).toHaveLength(2);
    read.mockRestore();
  });

  it("returns null for an empty canvas and supports transparent backgrounds", async () => {
    const wrapper = await setup({ sigOption: { backgroundColor: "transparent" } });
    expect(wrapper.vm.trim()).toBeNull();
    draw(wrapper);
    expect(wrapper.vm.trim()!.bounds.width).toBe(4);
    wrapper.vm.clear();
    expect(wrapper.vm.toTrimmedDataURL()).toBe("");
  });

  it("preserves cropped pixels and allows repeated trims with custom context options", async () => {
    const wrapper = await setup({ sigOption: {
      backgroundColor: "rgb(50, 100, 150)",
      canvasContextOptions: { willReadFrequently: false },
    } });
    draw(wrapper);
    const canvas = wrapper.get("canvas").element;
    const original = canvas.getContext("2d")!.getImageData(18, 18, 4, 4).data;
    for (let index = 0; index < 3; index += 1) {
      const result = wrapper.vm.trim()!;
      expect(result.bounds).toEqual({ x: 18, y: 18, width: 4, height: 4 });
      expect(result.canvas.getContext("2d")!.getImageData(0, 0, 4, 4).data).toEqual(original);
    }
    expect(wrapper.vm.getInstance()!.canvasContextOptions.willReadFrequently).toBe(false);
  });

  it("uses backing-pixel bounds on high-DPI canvases", async () => {
    vi.stubGlobal("devicePixelRatio", 2);
    try {
      const wrapper = await setup();
      draw(wrapper);
      expect(wrapper.vm.trim()!.bounds).toEqual({ x: 36, y: 36, width: 8, height: 8 });
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe("drawing and disabled state (#32)", () => {
  it("draws by default, blocks when disabled and resumes after enabling", async () => {
    const wrapper = await setup();
    const canvas = wrapper.get("canvas");
    const stroke = async () => {
      await canvas.trigger("mousedown", { buttons: 1, button: 0, clientX: 20, clientY: 20 });
      window.dispatchEvent(new MouseEvent("mouseup", { button: 0, clientX: 20, clientY: 20 }));
    };
    expect(canvas.attributes("disabled")).toBeUndefined();
    expect(canvas.classes()).not.toContain("vue3-signature__canvas--disabled");
    await stroke();
    expect(wrapper.vm.isEmpty()).toBe(false);
    wrapper.vm.clear();
    await wrapper.setProps({ disabled: true });
    expect(canvas.attributes("aria-disabled")).toBe("true");
    expect(canvas.classes()).toContain("vue3-signature__canvas--disabled");
    await stroke();
    expect(wrapper.vm.isEmpty()).toBe(true);
    await wrapper.setProps({ disabled: false });
    expect(canvas.attributes("aria-disabled")).toBeUndefined();
    await stroke();
    expect(wrapper.vm.isEmpty()).toBe(false);
    expect(wrapper.emitted("begin")).toHaveLength(2);
    expect(wrapper.emitted("end")).toHaveLength(2);
  });

  it("starts disabled and can cancel strokes through the public listener API", async () => {
    const wrapper = await setup({ disabled: true });
    const canvas = wrapper.get("canvas");
    await canvas.trigger("mousedown", { buttons: 1, button: 0, clientX: 20, clientY: 20 });
    expect(wrapper.vm.isEmpty()).toBe(true);
    await wrapper.setProps({ disabled: false });
    wrapper.vm.addEventListener("beginStroke", (event) => event.preventDefault());
    await canvas.trigger("mousedown", { buttons: 1, button: 0, clientX: 20, clientY: 20 });
    expect(wrapper.vm.isEmpty()).toBe(true);
  });

  it("draws and ends strokes through the PointerEvent path", async () => {
    class TestPointerEvent extends MouseEvent {
      pointerId = 1;
      pointerType = "pen";
      isPrimary = true;
      pressure = 0.5;
    }
    vi.stubGlobal("PointerEvent", TestPointerEvent);
    try {
      const wrapper = await setup();
      wrapper.get("canvas").element.dispatchEvent(new TestPointerEvent("pointerdown", {
        buttons: 1, button: 0, clientX: 20, clientY: 20,
      }));
      window.dispatchEvent(new TestPointerEvent("pointerup", { clientX: 20, clientY: 20 }));
      expect(wrapper.vm.isEmpty()).toBe(false);
      expect(wrapper.emitted("begin")).toHaveLength(1);
      expect(wrapper.emitted("end")).toHaveLength(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe("events and lifecycle", () => {
  it("bridges begin/end aliases from the current signature_pad stroke events", async () => {
    const wrapper = await setup();
    const pad = wrapper.vm.getInstance()!;
    const detail = { event: new MouseEvent("mousedown"), x: 1, y: 1, pressure: 0.5, type: "mouse" };
    pad.dispatchEvent(new CustomEvent("beginStroke", { detail, cancelable: true }));
    pad.dispatchEvent(new CustomEvent("endStroke", { detail }));
    expect(wrapper.emitted("begin")).toHaveLength(1);
    expect(wrapper.emitted("end")).toHaveLength(1);
    expect(wrapper.emitted("beginStroke")![0][0]).toBe(detail);
  });

  it("does not emit ready with a destroyed instance after unmount", async () => {
    const wrapper = mount(Vue3Signature);
    wrapper.unmount();
    await flushPromises();
    expect(wrapper.emitted("ready")).toBeUndefined();
  });

  it("preserves vector strokes on resize without encoding an unused PNG", async () => {
    const wrapper = await setup();
    draw(wrapper);
    const data = wrapper.vm.toData();
    const encode = vi.spyOn(wrapper.vm.getInstance()!, "toDataURL");
    await wrapper.setProps({ w: "120px" });
    expect(wrapper.vm.toData()).toEqual(data);
    expect(wrapper.vm.isEmpty()).toBe(false);
    expect(encode).not.toHaveBeenCalled();
    encode.mockRestore();
  });

  it("keeps disabled state and strokes when options change", async () => {
    const wrapper = await setup({ disabled: true });
    draw(wrapper);
    const oldPad = wrapper.vm.getInstance()!;
    const off = vi.spyOn(oldPad, "off");
    await wrapper.setProps({ sigOption: { penColor: "red" } });
    await flushPromises();
    expect(off).toHaveBeenCalled();
    expect(wrapper.vm.getInstance()).not.toBe(oldPad);
    expect(wrapper.vm.getInstance()).toBeInstanceOf(SignaturePad);
    expect(wrapper.vm.getInstance()!.penColor).toBe("red");
    expect(wrapper.vm.toData()).toHaveLength(1);
    off.mockRestore();
  });

  it("clears on resize when requested and supports undo", async () => {
    const wrapper = await setup({ clearOnResize: true });
    draw(wrapper);
    wrapper.vm.undo();
    expect(wrapper.vm.isEmpty()).toBe(true);
    draw(wrapper);
    await wrapper.setProps({ w: "120px" });
    expect(wrapper.vm.isEmpty()).toBe(true);
  });
});
