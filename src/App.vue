<template>
  <div class="demo-app">
    <header class="header">
      <h1>✍️ Vue3 Signature Demo</h1>
      <p class="subtitle">
        A smooth and elegant electronic signature component for Vue 3
      </p>
      <div class="badges">
        <a
          href="https://github.com/WangShayne/vue3-signature"
          target="_blank"
          class="badge"
        >
          ⭐ Star on GitHub
        </a>
        <a
          href="https://www.npmjs.com/package/vue3-signature"
          target="_blank"
          class="badge"
        >
          📦 View on NPM
        </a>
      </div>
    </header>

    <main class="main-content">
      <div class="controls-section">
        <div class="control-group">
          <label>Pen Color:</label>
          <input type="color" v-model="options.penColor" class="color-input" />
          <span class="color-value">{{ options.penColor }}</span>
        </div>

        <div class="control-group">
          <label>Background:</label>
          <input
            type="color"
            v-model="options.backgroundColor"
            class="color-input"
          />
          <span class="color-value">{{ options.backgroundColor }}</span>
        </div>

        <div class="control-group">
          <label>
            <input type="checkbox" v-model="isDisabled" />
            Read-only Mode
          </label>
        </div>
      </div>

      <div class="signature-container">
        <Vue3Signature
          ref="signature"
          :sigOption="options"
          :disabled="isDisabled"
          :w="'100%'"
          :h="'100%'"
          class="signature-pad"
        />
      </div>

      <div class="button-group">
        <button @click="save('image/png')" class="btn btn-primary">
          💾 Save PNG
        </button>
        <button @click="save('image/jpeg')" class="btn btn-primary">
          💾 Save JPEG
        </button>
        <button @click="save('image/svg+xml')" class="btn btn-primary">
          💾 Save SVG
        </button>
        <button @click="clear" class="btn btn-danger">🗑️ Clear</button>
        <button @click="undo" class="btn btn-secondary">↩️ Undo</button>
        <button @click="addWatermark" class="btn btn-secondary">
          🔖 Watermark
        </button>
      </div>

      <div v-if="preview" class="preview-section">
        <h3>Preview</h3>
        <img :src="preview" alt="Signature preview" class="preview-image" />
      </div>

      <div class="info-section">
        <h3>Features</h3>
        <ul>
          <li>📱 Touch and mouse support</li>
          <li>🎨 Customizable pen color and background</li>
          <li>💾 Export as PNG, JPEG, or SVG</li>
          <li>🔄 Undo support</li>
          <li>🖼️ Watermark support</li>
          <li>🚫 Read-only mode</li>
        </ul>
      </div>
    </main>

    <footer class="footer">
      <p>
        Made with ❤️ by
        <a href="https://github.com/WangShayne" target="_blank">Shayne Wang</a>
      </p>
      <p class="powered-by">
        Powered by
        <a href="https://github.com/szimek/signature_pad" target="_blank"
          >signature_pad</a
        >
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Vue3Signature from "./components/Vue3Signature.vue";

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
  const extension =
    format === "image/jpeg" ? "jpg" : format === "image/svg+xml" ? "svg" : "png";
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
  const date = new Date().toLocaleDateString();
  signature.value.addWaterMark({
    text: date,
    font: "16px Arial",
    fillStyle: "rgba(0, 0, 0, 0.3)",
    x: 10,
    y: 30,
  });
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
}

#app {
  min-height: 100vh;
}

.demo-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  text-align: center;
  padding: 3rem 2rem 2rem;
  color: white;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.badges {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.badge:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -5px 30px rgba(0, 0, 0, 0.1);
}

.controls-section {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.control-group label {
  font-weight: 500;
  color: #333;
}

.color-input {
  width: 50px;
  height: 40px;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-input:hover {
  border-color: #667eea;
}

.color-value {
  font-family: monospace;
  color: #666;
  font-size: 0.9rem;
}

.signature-container {
  width: 100%;
  height: 400px;
  margin-bottom: 2rem;
  border: 3px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.signature-container:hover {
  border-color: #667eea;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
}

.signature-pad {
  width: 100%;
  height: 100%;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-danger {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-secondary {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.preview-section {
  margin-bottom: 2rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.preview-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.preview-image {
  max-width: 100%;
  border: 2px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-section {
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.info-section h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.info-section ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.75rem;
}

.info-section li {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  backdrop-filter: blur(10px);
}

.footer {
  text-align: center;
  padding: 2rem;
  color: white;
  background: rgba(0, 0, 0, 0.2);
}

.footer p {
  margin: 0.5rem 0;
}

.footer a {
  color: white;
  text-decoration: underline;
}

.powered-by {
  font-size: 0.9rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }

  .signature-container {
    height: 300px;
  }

  .controls-section {
    flex-direction: column;
    gap: 1rem;
  }

  .info-section ul {
    grid-template-columns: 1fr;
  }
}
</style>