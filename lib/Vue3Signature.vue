<template>
  <div :style="{ width: w, height: h }" @touchmove.prevent>
    <canvas
        :id="state.uid"
        class="canvas"
        :data-uid="state.uid"
        :disabled="state.disabled"
    ></canvas>
  </div>
</template>

<script setup>
import SignaturePad from "signature_pad";
import {onMounted, reactive, watch } from "vue";

const props = defineProps({
  sigOption: {
    type: Object,
    default: () => {
      return {
        backgroundColor: "rgb(255,255,255)",
        penColor: "rgb(0, 0, 0)",
      };
    },
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
    type: Object,
    default: () => {
      return {};
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  defaultUrl: {
    type: String,
    default: "",
  }
})

let state = reactive({
  sig: () => {
  },
  option: {
    backgroundColor: "rgb(255,255,255)",
    penColor: "rgb(0, 0, 0)",
  },
  uid: "",
});

state.uid = "canvas" + Math.random();

let sigOptions = Object.keys(props.sigOption);
for (let item of sigOptions) {
  state.option[item] = props.sigOption[item];
}

watch(
    () => props.disabled,
    (val) => {
      if (val) {
        state.sig.off();
      } else {
        state.sig.on();
      }
    }
);

const draw = () => {
  let canvas = document.getElementById(state.uid);
  state.sig = new SignaturePad(canvas, state.option);

  function resizeCanvas(c) {
    let url;
    if (!isEmpty()) {
      url = save();
    }
    let ratio = Math.max(window.devicePixelRatio || 1, 1);
    const reg = RegExp(/px/)
    c.width = reg.test(props.w) ? props.w.replace(/px/g, "") * ratio : c.offsetWidth * ratio;
    c.height = reg.test(props.h) ? props.h.replace(/px/g, "") * ratio : c.offsetHeight * ratio;
    c.getContext("2d").scale(ratio, ratio);
    clear();
    !props.clearOnResize && url !== undefined && fromDataURL(url);
    Object.keys(props.waterMark).length && addWaterMark(props.waterMark);
  }

  window.addEventListener("resize", resizeCanvas(canvas));
  resizeCanvas(canvas);
  if (props.defaultUrl !== "") {
    fromDataURL(props.defaultUrl);
  }
  if (props.disabled) {
    state.sig.off();
  } else {
    state.sig.on();
  }
};

const clear = () => {
  state.sig.clear();
};
const save = (format) => {
  return format ? state.sig.toDataURL(format) : state.sig.toDataURL();
  // signaturePad.toDataURL(); // save image as PNG
  // signaturePad.toDataURL("image/jpeg"); // save image as JPEG
  // signaturePad.toDataURL("image/svg+xml"); // save image as SVG
};
const fromDataURL = (url) => {
  state.sig.fromDataURL(url);
};
const isEmpty = () => {
  return state.sig.isEmpty();
};
const undo = () => {
  let data = state.sig.toData();
  if (data) {
    data.pop();
    state.sig.fromData(data);
  }
};
const addWaterMark = (data) => {
  if (!(Object.prototype.toString.call(data) == "[object Object]")) {
    throw new Error("Expected Object, got " + typeof data + ".");
  } else {
    let vCanvas = document.getElementById(state.uid);
    let textData = {
      text: data.text || "",
      x: data.x || 20,
      y: data.y || 20,
      sx: data.sx || 40,
      sy: data.sy || 40,
    };

    let ctx = vCanvas.getContext("2d");
    ctx.font = data.font || "20px sans-serif";
    ctx.fillStyle = data.fillStyle || "#333";
    ctx.strokeStyle = data.strokeStyle || "#333";
    if (data.style == "all") {
      ctx.fillText(textData.text, textData.x, textData.y);
      ctx.strokeText(textData.text, textData.sx, textData.sy);
    } else if (data.style == "stroke") {
      ctx.strokeText(textData.text, textData.sx, textData.sy);
    } else {
      ctx.fillText(textData.text, textData.x, textData.y);
    }
    state.sig._isEmpty = false;
  }
};

onMounted(() => {
  draw();
})

defineExpose({
  save,
  clear,
  isEmpty,
  undo,
  addWaterMark,
  fromDataURL
})
</script>

<style>
canvas {
  width: 100%;
  height: 100%;
}
</style>