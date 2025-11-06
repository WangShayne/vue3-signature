<div align="center">
  <h1>✍️ Vue3 Signature</h1>
  <p>A smooth and elegant electronic signature component for Vue 3</p>
  <p><strong>Powered by <a href="https://github.com/szimek/signature_pad">signature_pad</a></strong> - The most popular HTML5 canvas based signature library</p>
  
  [![npm version](https://img.shields.io/npm/v/vue3-signature.svg?style=flat-square)](https://www.npmjs.com/package/vue3-signature)
  [![npm downloads](https://img.shields.io/npm/dm/vue3-signature.svg?style=flat-square)](https://www.npmjs.com/package/vue3-signature)
  [![license](https://img.shields.io/npm/l/vue3-signature.svg?style=flat-square)](https://github.com/WangShayne/vue3-signature/blob/master/LICENSE)
  [![vue3](https://img.shields.io/badge/vue-3.x-brightgreen.svg?style=flat-square)](https://vuejs.org/)
  [![signature_pad](https://img.shields.io/badge/signature__pad-5.1.1-orange.svg?style=flat-square)](https://github.com/szimek/signature_pad)
  
  [🎮 Try Online](#-try-online) • 
  [✨ Features](#-features) • 
  [🚀 Quick Start](#-quick-start) • 
  [📖 Documentation](#-documentation) • 
  [💡 Examples](#-examples)
  
  <p>
    <a href="./README.md">English</a> | 
    <a href="./README.zh-CN.md">简体中文</a>
  </p>
</div>

---

## 🎮 Try Online

Experience Vue3 Signature without any installation:

**👉 [Live Demo on GitHub Pages](https://wangshayne.github.io/vue3-signature/)** - Try all features in your browser!

> The demo showcases all component features including drawing, saving, undo, watermarks, and more.

### 🚀 Deploy Your Own Demo

Want to deploy your own demo? Check out our [Deployment Guide](./DEPLOY.md) for detailed instructions on deploying to GitHub Pages.

## ✨ Features

### 🎯 Core Technology

Built on top of **[signature_pad](https://github.com/szimek/signature_pad)** by Szymon Nowak - the industry-standard HTML5 canvas based smooth signature drawing library with **13k+ GitHub stars** and proven reliability.

### ⚡ Key Features

- 📱 **Touch & Mouse Support** - Works seamlessly on both mobile and desktop devices
- 🎨 **Customizable** - Fully customizable pen color, background, and signature styles
- 💾 **Multiple Export Formats** - Export signatures as PNG, JPEG, or SVG
- 🔄 **Undo Support** - Easy undo functionality for better user experience
- 🖼️ **Watermark Support** - Add custom watermarks to signatures
- 🚫 **Disable Mode** - Toggle between editable and read-only states
- 📐 **Responsive** - Automatically adapts to container size
- 🎯 **TypeScript Support** - Full TypeScript type definitions included
- ⚡ **Lightweight** - Small bundle size with no unnecessary dependencies
- 🌍 **Cross-Platform** - Works on all modern browsers and mobile devices

![Demo](./1.gif)

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install vue3-signature

# Using yarn
yarn add vue3-signature

# Using pnpm
pnpm add vue3-signature
```

### Basic Usage

**Step 1:** Register the component globally

```javascript
// main.js
import { createApp } from "vue";
import Vue3Signature from "vue3-signature";
import App from "./App.vue";

createApp(App).use(Vue3Signature).mount("#app");
```

**Step 2:** Use it in your component

```vue
<template>
  <div>
    <Vue3Signature
      ref="signature"
      :sigOption="options"
      :w="'800px'"
      :h="'400px'"
    />

    <div class="buttons">
      <button @click="save">Save as PNG</button>
      <button @click="clear">Clear</button>
      <button @click="undo">Undo</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const signature = ref(null);
const options = reactive({
  penColor: "rgb(0, 0, 0)",
  backgroundColor: "rgb(255, 255, 255)",
});

const save = () => {
  const png = signature.value.save();
  console.log(png); // base64 data URL
};

const clear = () => {
  signature.value.clear();
};

const undo = () => {
  signature.value.undo();
};
</script>
```

## 📖 Documentation

### Props

| Property        | Type      | Default                                                           | Description                                                           |
| --------------- | --------- | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| `sigOption`     | `Object`  | `{penColor: "rgb(0, 0, 0)", backgroundColor: "rgb(255,255,255)"}` | Signature pad options including pen color and background color        |
| `w`             | `String`  | `"100%"`                                                          | Width of the signature pad (e.g., `"100%"`, `"500px"`)                |
| `h`             | `String`  | `"100%"`                                                          | Height of the signature pad (e.g., `"100%"`, `"300px"`)               |
| `clearOnResize` | `Boolean` | `false`                                                           | Whether to clear the canvas when window is resized                    |
| `waterMark`     | `Object`  | `{}`                                                              | Watermark configuration (see [Watermark Options](#watermark-options)) |
| `disabled`      | `Boolean` | `false`                                                           | Disable/enable signature input                                        |
| `defaultUrl`    | `String`  | `""`                                                              | Default image URL to display on canvas                                |

### Methods

Access these methods via component ref:

| Method           | Parameters        | Return    | Description                                                                                     |
| ---------------- | ----------------- | --------- | ----------------------------------------------------------------------------------------------- |
| `save()`         | `format?: string` | `string`  | Save signature as data URL. Formats: `"image/png"` (default), `"image/jpeg"`, `"image/svg+xml"` |
| `clear()`        | -                 | `void`    | Clear the entire canvas                                                                         |
| `isEmpty()`      | -                 | `boolean` | Check if canvas is empty                                                                        |
| `undo()`         | -                 | `void`    | Remove the last stroke                                                                          |
| `fromDataURL()`  | `url: string`     | `void`    | Load signature from data URL                                                                    |
| `addWaterMark()` | `options: Object` | `void`    | Add watermark to canvas (see [Watermark Options](#watermark-options))                           |

### Signature Options

```typescript
interface SigOption {
  penColor?: string; // Pen stroke color (default: "rgb(0, 0, 0)")
  backgroundColor?: string; // Canvas background color (default: "rgb(255, 255, 255)")
  minWidth?: number; // Minimum width of a stroke (default: 0.5)
  maxWidth?: number; // Maximum width of a stroke (default: 2.5)
  velocityFilterWeight?: number; // Weight for smoothing (default: 0.7)
}
```

### Watermark Options

```typescript
interface WaterMarkOption {
  text?: string; // Watermark text (default: "")
  font?: string; // Font style (default: "20px sans-serif")
  style?: string; // Style type: "all" | "stroke" | "fill" (default: "fill")
  fillStyle?: string; // Fill color (default: "#333")
  strokeStyle?: string; // Stroke color (default: "#333")
  x?: number; // Fill text X position (default: 20)
  y?: number; // Fill text Y position (default: 20)
  sx?: number; // Stroke text X position (default: 40)
  sy?: number; // Stroke text Y position (default: 40)
}
```

## 💡 Examples

### Save as Different Formats

```vue
<template>
  <Vue3Signature ref="signature" :w="'800px'" :h="'400px'" />

  <button @click="saveAsPNG">Save as PNG</button>
  <button @click="saveAsJPEG">Save as JPEG</button>
  <button @click="saveAsSVG">Save as SVG</button>
</template>

<script setup>
import { ref } from "vue";

const signature = ref(null);

const saveAsPNG = () => {
  const dataUrl = signature.value.save(); // or save('image/png')
  downloadImage(dataUrl, "signature.png");
};

const saveAsJPEG = () => {
  const dataUrl = signature.value.save("image/jpeg");
  downloadImage(dataUrl, "signature.jpg");
};

const saveAsSVG = () => {
  const dataUrl = signature.value.save("image/svg+xml");
  downloadImage(dataUrl, "signature.svg");
};

const downloadImage = (dataUrl, filename) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
};
</script>
```

### Custom Pen Colors and Styles

```vue
<template>
  <div>
    <div class="color-picker">
      <button @click="setPenColor('#000000')">Black</button>
      <button @click="setPenColor('#0000ff')">Blue</button>
      <button @click="setPenColor('#ff0000')">Red</button>
      <button @click="setPenColor('#00ff00')">Green</button>
    </div>

    <Vue3Signature
      ref="signature"
      :sigOption="options"
      :w="'100%'"
      :h="'400px'"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const signature = ref(null);
const options = reactive({
  penColor: "rgb(0, 0, 0)",
  backgroundColor: "rgb(255, 255, 255)",
  minWidth: 1,
  maxWidth: 3,
});

const setPenColor = (color) => {
  options.penColor = color;
};
</script>

<style scoped>
.color-picker {
  margin-bottom: 10px;
}

.color-picker button {
  margin-right: 10px;
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
}
</style>
```

### Add Watermark

```vue
<template>
  <Vue3Signature ref="signature" :w="'800px'" :h="'400px'" />
  <button @click="addWatermark">Add Watermark</button>
</template>

<script setup>
import { ref } from "vue";

const signature = ref(null);

const addWatermark = () => {
  signature.value.addWaterMark({
    text: "Confidential",
    font: "30px Arial",
    style: "all",
    fillStyle: "rgba(255, 0, 0, 0.3)",
    strokeStyle: "rgba(255, 0, 0, 0.5)",
    x: 100,
    y: 200,
    sx: 102,
    sy: 202,
  });
};
</script>
```

### Disabled Mode (Read-only)

```vue
<template>
  <div>
    <Vue3Signature
      ref="signature"
      :disabled="isDisabled"
      :w="'800px'"
      :h="'400px'"
    />

    <button @click="toggleDisabled">
      {{ isDisabled ? "Enable" : "Disable" }} Editing
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const signature = ref(null);
const isDisabled = ref(false);

const toggleDisabled = () => {
  isDisabled.value = !isDisabled.value;
};
</script>
```

### Load from Data URL

```vue
<template>
  <div>
    <Vue3Signature ref="signature" :w="'800px'" :h="'400px'" />

    <button @click="loadSignature">Load Saved Signature</button>
    <button @click="saveSignature">Save Current Signature</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const signature = ref(null);
const savedSignature = ref("");

const saveSignature = () => {
  savedSignature.value = signature.value.save();
  alert("Signature saved!");
};

const loadSignature = () => {
  if (savedSignature.value) {
    signature.value.fromDataURL(savedSignature.value);
  } else {
    alert("No saved signature found!");
  }
};
</script>
```

### Responsive Design

```vue
<template>
  <div class="signature-container">
    <Vue3Signature
      ref="signature"
      :w="'100%'"
      :h="'100%'"
      :clearOnResize="false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const signature = ref(null);
</script>

<style scoped>
.signature-container {
  width: 100%;
  height: 400px;
  max-width: 800px;
  margin: 0 auto;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .signature-container {
    height: 300px;
  }
}
</style>
```

## 🔧 Advanced Usage

### Complete Example with All Features

```vue
<template>
  <div class="signature-app">
    <h2>Electronic Signature Pad</h2>

    <div class="controls">
      <div class="control-group">
        <label>Pen Color:</label>
        <input type="color" v-model="options.penColor" />
      </div>

      <div class="control-group">
        <label>Background:</label>
        <input type="color" v-model="options.backgroundColor" />
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="isDisabled" />
          Read-only Mode
        </label>
      </div>
    </div>

    <Vue3Signature
      ref="signature"
      :sigOption="options"
      :disabled="isDisabled"
      :w="'100%'"
      :h="'400px'"
      class="signature-pad"
    />

    <div class="button-group">
      <button @click="save('image/png')" class="btn btn-primary">
        💾 Save PNG
      </button>
      <button @click="save('image/jpeg')" class="btn btn-primary">
        💾 Save JPEG
      </button>
      <button @click="clear" class="btn btn-danger">🗑️ Clear</button>
      <button @click="undo" class="btn btn-secondary">↩️ Undo</button>
      <button @click="addWatermark" class="btn btn-secondary">
        🔖 Add Watermark
      </button>
    </div>

    <div v-if="preview" class="preview">
      <h3>Preview:</h3>
      <img :src="preview" alt="Signature preview" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const signature = ref(null);
const preview = ref("");
const isDisabled = ref(false);

const options = reactive({
  penColor: "rgb(0, 0, 0)",
  backgroundColor: "rgb(255, 255, 255)",
});

const save = (format) => {
  if (signature.value.isEmpty()) {
    alert("Please provide a signature first.");
    return;
  }

  const dataUrl = signature.value.save(format);
  preview.value = dataUrl;

  // Download the image
  const link = document.createElement("a");
  const extension = format === "image/jpeg" ? "jpg" : "png";
  link.download = `signature.${extension}`;
  link.href = dataUrl;
  link.click();
};

const clear = () => {
  signature.value.clear();
  preview.value = "";
};

const undo = () => {
  signature.value.undo();
};

const addWatermark = () => {
  signature.value.addWaterMark({
    text: new Date().toLocaleDateString(),
    font: "16px Arial",
    fillStyle: "rgba(0, 0, 0, 0.3)",
    x: 10,
    y: 30,
  });
};
</script>

<style scoped>
.signature-app {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.signature-pad {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-danger:hover {
  background-color: #da190b;
}

.btn-secondary {
  background-color: #2196f3;
  color: white;
}

.btn-secondary:hover {
  background-color: #0b7dda;
}

.preview {
  margin-top: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.preview img {
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
```

## 🌐 Browser Support

Vue3 Signature works on all modern browsers:

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Opera (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Changelog

See [Releases](https://github.com/WangShayne/vue3-signature/releases) for detailed changelog.

## 🙏 Credits & Dependencies

### Core Dependency

This Vue 3 component is a wrapper around **[signature_pad](https://github.com/szimek/signature_pad)** - the most popular and reliable HTML5 canvas based signature library.

**Why signature_pad?**

- ⭐ **13,000+ GitHub Stars** - Trusted by thousands of developers worldwide
- 🏆 **Industry Standard** - Used in countless production applications
- 🎨 **Smooth Drawing** - Advanced Bézier curve interpolation for natural signatures
- 📱 **Touch Optimized** - Perfect support for touchscreens and stylus input
- 🔧 **Well Maintained** - Active development and regular updates
- 📦 **Lightweight** - Minimal footprint with maximum functionality

**Library Information:**

- Author: [Szymon Nowak](https://github.com/szimek)
- Repository: [github.com/szimek/signature_pad](https://github.com/szimek/signature_pad)
- License: MIT
- Current Version: 5.1.1

By using Vue3 Signature, you get all the power of signature_pad with the simplicity of Vue 3's Composition API.

## 📄 License

[MIT License](https://opensource.org/licenses/MIT)

Copyright (c) 2024 Shayne Wang

---

## 🔗 Related Projects

- **[vue-signature](https://github.com/WangShayne/vue-signature)** - Vue 2.x version
- **[signature_pad](https://github.com/szimek/signature_pad)** - The underlying signature library

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/WangShayne">Shayne Wang</a>
  <br>
  If this project helped you, please consider giving it a ⭐️
</div>
