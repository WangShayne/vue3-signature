var C = Object.defineProperty;
var T = (a, n, t) => n in a ? C(a, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[n] = t;
var f = (a, n, t) => T(a, typeof n != "symbol" ? n + "" : n, t);
import { defineComponent as U, reactive as D, watch as W, onMounted as O, createElementBlock as L, openBlock as A, withModifiers as B, normalizeStyle as F, createElementVNode as I, unref as b } from "vue";
/*!
 * Signature Pad v5.1.1 | https://github.com/szimek/signature_pad
 * (c) 2025 Szymon Nowak | Released under the MIT license
 */
var E = class {
  constructor(a, n, t, e) {
    f(this, "x");
    f(this, "y");
    f(this, "pressure");
    f(this, "time");
    if (isNaN(a) || isNaN(n))
      throw new Error(`Point is invalid: (${a}, ${n})`);
    this.x = +a, this.y = +n, this.pressure = t || 0, this.time = e || Date.now();
  }
  distanceTo(a) {
    return Math.sqrt(
      Math.pow(this.x - a.x, 2) + Math.pow(this.y - a.y, 2)
    );
  }
  equals(a) {
    return this.x === a.x && this.y === a.y && this.pressure === a.pressure && this.time === a.time;
  }
  velocityFrom(a) {
    return this.time !== a.time ? this.distanceTo(a) / (this.time - a.time) : 0;
  }
}, R = class k {
  constructor(n, t, e, s, i, o) {
    this.startPoint = n, this.control2 = t, this.control1 = e, this.endPoint = s, this.startWidth = i, this.endWidth = o;
  }
  static fromPoints(n, t) {
    const e = this.calculateControlPoints(n[0], n[1], n[2]).c2, s = this.calculateControlPoints(n[1], n[2], n[3]).c1;
    return new k(n[1], e, s, n[2], t.start, t.end);
  }
  static calculateControlPoints(n, t, e) {
    const s = n.x - t.x, i = n.y - t.y, o = t.x - e.x, u = t.y - e.y, l = { x: (n.x + t.x) / 2, y: (n.y + t.y) / 2 }, d = { x: (t.x + e.x) / 2, y: (t.y + e.y) / 2 }, c = Math.sqrt(s * s + i * i), p = Math.sqrt(o * o + u * u), x = l.x - d.x, h = l.y - d.y, g = c + p == 0 ? 0 : p / (c + p), _ = { x: d.x + x * g, y: d.y + h * g }, r = t.x - _.x, m = t.y - _.y;
    return {
      c1: new E(l.x + r, l.y + m),
      c2: new E(d.x + r, d.y + m)
    };
  }
  // Returns approximated length. Code taken from https://www.lemoda.net/maths/bezier-length/index.html.
  length() {
    let t = 0, e, s;
    for (let i = 0; i <= 10; i += 1) {
      const o = i / 10, u = this.point(
        o,
        this.startPoint.x,
        this.control1.x,
        this.control2.x,
        this.endPoint.x
      ), l = this.point(
        o,
        this.startPoint.y,
        this.control1.y,
        this.control2.y,
        this.endPoint.y
      );
      if (i > 0) {
        const d = u - e, c = l - s;
        t += Math.sqrt(d * d + c * c);
      }
      e = u, s = l;
    }
    return t;
  }
  // Calculate parametric value of x or y given t and the four point coordinates of a cubic bezier curve.
  point(n, t, e, s, i) {
    return t * (1 - n) * (1 - n) * (1 - n) + 3 * e * (1 - n) * (1 - n) * n + 3 * s * (1 - n) * n * n + i * n * n * n;
  }
}, z = class {
  /* tslint:enable: variable-name */
  constructor() {
    /* tslint:disable: variable-name */
    f(this, "_et");
    try {
      this._et = new EventTarget();
    } catch {
      this._et = document;
    }
  }
  addEventListener(a, n, t) {
    this._et.addEventListener(a, n, t);
  }
  dispatchEvent(a) {
    return this._et.dispatchEvent(a);
  }
  removeEventListener(a, n, t) {
    this._et.removeEventListener(a, n, t);
  }
};
function N(a, n = 250) {
  let t = 0, e = null, s, i, o;
  const u = () => {
    t = Date.now(), e = null, s = a.apply(i, o), e || (i = null, o = []);
  };
  return function(...d) {
    const c = Date.now(), p = n - (c - t);
    return i = this, o = d, p <= 0 || p > n ? (e && (clearTimeout(e), e = null), t = c, s = a.apply(i, o), e || (i = null, o = [])) : e || (e = window.setTimeout(u, p)), s;
  };
}
var $ = class S extends z {
  /* tslint:enable: variable-name */
  constructor(t, e = {}) {
    super();
    // Public stuff
    f(this, "dotSize");
    f(this, "minWidth");
    f(this, "maxWidth");
    f(this, "penColor");
    f(this, "minDistance");
    f(this, "velocityFilterWeight");
    f(this, "compositeOperation");
    f(this, "backgroundColor");
    f(this, "throttle");
    f(this, "canvasContextOptions");
    // Private stuff
    /* tslint:disable: variable-name */
    f(this, "_ctx");
    f(this, "_drawingStroke", !1);
    f(this, "_isEmpty", !0);
    f(this, "_dataUrl");
    f(this, "_dataUrlOptions");
    f(this, "_lastPoints", []);
    // Stores up to 4 most recent points; used to generate a new curve
    f(this, "_data", []);
    // Stores all points in groups (one group per line or dot)
    f(this, "_lastVelocity", 0);
    f(this, "_lastWidth", 0);
    f(this, "_strokeMoveUpdate");
    f(this, "_strokePointerId");
    this.canvas = t, this.velocityFilterWeight = e.velocityFilterWeight || 0.7, this.minWidth = e.minWidth || 0.5, this.maxWidth = e.maxWidth || 2.5, this.throttle = e.throttle ?? 16, this.minDistance = e.minDistance ?? 5, this.dotSize = e.dotSize || 0, this.penColor = e.penColor || "black", this.backgroundColor = e.backgroundColor || "rgba(0,0,0,0)", this.compositeOperation = e.compositeOperation || "source-over", this.canvasContextOptions = e.canvasContextOptions ?? {}, this._strokeMoveUpdate = this.throttle ? N(S.prototype._strokeUpdate, this.throttle) : S.prototype._strokeUpdate, this._handleMouseDown = this._handleMouseDown.bind(this), this._handleMouseMove = this._handleMouseMove.bind(this), this._handleMouseUp = this._handleMouseUp.bind(this), this._handleTouchStart = this._handleTouchStart.bind(this), this._handleTouchMove = this._handleTouchMove.bind(this), this._handleTouchEnd = this._handleTouchEnd.bind(this), this._handlePointerDown = this._handlePointerDown.bind(this), this._handlePointerMove = this._handlePointerMove.bind(this), this._handlePointerUp = this._handlePointerUp.bind(this), this._ctx = t.getContext(
      "2d",
      this.canvasContextOptions
    ), this.clear(), this.on();
  }
  clear() {
    const { _ctx: t, canvas: e } = this;
    t.fillStyle = this.backgroundColor, t.clearRect(0, 0, e.width, e.height), t.fillRect(0, 0, e.width, e.height), this._data = [], this._reset(this._getPointGroupOptions()), this._isEmpty = !0, this._dataUrl = void 0, this._dataUrlOptions = void 0, this._strokePointerId = void 0;
  }
  redraw() {
    const t = this._data, e = this._dataUrl, s = this._dataUrlOptions;
    this.clear(), e && this.fromDataURL(e, s), this.fromData(t, { clear: !1 });
  }
  fromDataURL(t, e = {}) {
    return new Promise((s, i) => {
      const o = new Image(), u = e.ratio || window.devicePixelRatio || 1, l = e.width || this.canvas.width / u, d = e.height || this.canvas.height / u, c = e.xOffset || 0, p = e.yOffset || 0;
      this._reset(this._getPointGroupOptions()), o.onload = () => {
        this._ctx.drawImage(o, c, p, l, d), s();
      }, o.onerror = (x) => {
        i(x);
      }, o.crossOrigin = "anonymous", o.src = t, this._isEmpty = !1, this._dataUrl = t, this._dataUrlOptions = { ...e };
    });
  }
  toDataURL(t = "image/png", e) {
    switch (t) {
      case "image/svg+xml":
        return typeof e != "object" && (e = void 0), `data:image/svg+xml;base64,${btoa(
          this.toSVG(e)
        )}`;
      default:
        return typeof e != "number" && (e = void 0), this.canvas.toDataURL(t, e);
    }
  }
  on() {
    this.canvas.style.touchAction = "none", this.canvas.style.msTouchAction = "none", this.canvas.style.userSelect = "none";
    const t = /Macintosh/.test(navigator.userAgent) && "ontouchstart" in document;
    window.PointerEvent && !t ? this._handlePointerEvents() : (this._handleMouseEvents(), "ontouchstart" in window && this._handleTouchEvents());
  }
  off() {
    this.canvas.style.touchAction = "auto", this.canvas.style.msTouchAction = "auto", this.canvas.style.userSelect = "auto", this.canvas.removeEventListener("pointerdown", this._handlePointerDown), this.canvas.removeEventListener("mousedown", this._handleMouseDown), this.canvas.removeEventListener("touchstart", this._handleTouchStart), this._removeMoveUpEventListeners();
  }
  _getListenerFunctions() {
    const t = window.document === this.canvas.ownerDocument ? window : this.canvas.ownerDocument.defaultView ?? this.canvas.ownerDocument;
    return {
      addEventListener: t.addEventListener.bind(
        t
      ),
      removeEventListener: t.removeEventListener.bind(
        t
      )
    };
  }
  _removeMoveUpEventListeners() {
    const { removeEventListener: t } = this._getListenerFunctions();
    t("pointermove", this._handlePointerMove), t("pointerup", this._handlePointerUp), t("mousemove", this._handleMouseMove), t("mouseup", this._handleMouseUp), t("touchmove", this._handleTouchMove), t("touchend", this._handleTouchEnd);
  }
  isEmpty() {
    return this._isEmpty;
  }
  fromData(t, { clear: e = !0 } = {}) {
    e && this.clear(), this._fromData(
      t,
      this._drawCurve.bind(this),
      this._drawDot.bind(this)
    ), this._data = this._data.concat(t);
  }
  toData() {
    return this._data;
  }
  _isLeftButtonPressed(t, e) {
    return e ? t.buttons === 1 : (t.buttons & 1) === 1;
  }
  _pointerEventToSignatureEvent(t) {
    return {
      event: t,
      type: t.type,
      x: t.clientX,
      y: t.clientY,
      pressure: "pressure" in t ? t.pressure : 0
    };
  }
  _touchEventToSignatureEvent(t) {
    const e = t.changedTouches[0];
    return {
      event: t,
      type: t.type,
      x: e.clientX,
      y: e.clientY,
      pressure: e.force
    };
  }
  // Event handlers
  _handleMouseDown(t) {
    !this._isLeftButtonPressed(t, !0) || this._drawingStroke || this._strokeBegin(this._pointerEventToSignatureEvent(t));
  }
  _handleMouseMove(t) {
    if (!this._isLeftButtonPressed(t, !0) || !this._drawingStroke) {
      this._strokeEnd(this._pointerEventToSignatureEvent(t), !1);
      return;
    }
    this._strokeMoveUpdate(this._pointerEventToSignatureEvent(t));
  }
  _handleMouseUp(t) {
    this._isLeftButtonPressed(t) || this._strokeEnd(this._pointerEventToSignatureEvent(t));
  }
  _handleTouchStart(t) {
    t.targetTouches.length !== 1 || this._drawingStroke || (t.cancelable && t.preventDefault(), this._strokeBegin(this._touchEventToSignatureEvent(t)));
  }
  _handleTouchMove(t) {
    if (t.targetTouches.length === 1) {
      if (t.cancelable && t.preventDefault(), !this._drawingStroke) {
        this._strokeEnd(this._touchEventToSignatureEvent(t), !1);
        return;
      }
      this._strokeMoveUpdate(this._touchEventToSignatureEvent(t));
    }
  }
  _handleTouchEnd(t) {
    t.targetTouches.length === 0 && (t.cancelable && t.preventDefault(), this._strokeEnd(this._touchEventToSignatureEvent(t)));
  }
  _getPointerId(t) {
    return t.persistentDeviceId || t.pointerId;
  }
  _allowPointerId(t, e = !1) {
    return typeof this._strokePointerId > "u" ? e : this._getPointerId(t) === this._strokePointerId;
  }
  _handlePointerDown(t) {
    this._drawingStroke || !this._isLeftButtonPressed(t) || !this._allowPointerId(t, !0) || (this._strokePointerId = this._getPointerId(t), t.preventDefault(), this._strokeBegin(this._pointerEventToSignatureEvent(t)));
  }
  _handlePointerMove(t) {
    if (this._allowPointerId(t)) {
      if (!this._isLeftButtonPressed(t, !0) || !this._drawingStroke) {
        this._strokeEnd(this._pointerEventToSignatureEvent(t), !1);
        return;
      }
      t.preventDefault(), this._strokeMoveUpdate(this._pointerEventToSignatureEvent(t));
    }
  }
  _handlePointerUp(t) {
    this._isLeftButtonPressed(t) || !this._allowPointerId(t) || (t.preventDefault(), this._strokeEnd(this._pointerEventToSignatureEvent(t)));
  }
  _getPointGroupOptions(t) {
    return {
      penColor: t && "penColor" in t ? t.penColor : this.penColor,
      dotSize: t && "dotSize" in t ? t.dotSize : this.dotSize,
      minWidth: t && "minWidth" in t ? t.minWidth : this.minWidth,
      maxWidth: t && "maxWidth" in t ? t.maxWidth : this.maxWidth,
      velocityFilterWeight: t && "velocityFilterWeight" in t ? t.velocityFilterWeight : this.velocityFilterWeight,
      compositeOperation: t && "compositeOperation" in t ? t.compositeOperation : this.compositeOperation
    };
  }
  // Private methods
  _strokeBegin(t) {
    if (!this.dispatchEvent(
      new CustomEvent("beginStroke", { detail: t, cancelable: !0 })
    ))
      return;
    const { addEventListener: s } = this._getListenerFunctions();
    switch (t.event.type) {
      case "mousedown":
        s("mousemove", this._handleMouseMove, {
          passive: !1
        }), s("mouseup", this._handleMouseUp, { passive: !1 });
        break;
      case "touchstart":
        s("touchmove", this._handleTouchMove, {
          passive: !1
        }), s("touchend", this._handleTouchEnd, { passive: !1 });
        break;
      case "pointerdown":
        s("pointermove", this._handlePointerMove, {
          passive: !1
        }), s("pointerup", this._handlePointerUp, {
          passive: !1
        });
        break;
    }
    this._drawingStroke = !0;
    const i = this._getPointGroupOptions(), o = {
      ...i,
      points: []
    };
    this._data.push(o), this._reset(i), this._strokeUpdate(t);
  }
  _strokeUpdate(t) {
    if (!this._drawingStroke)
      return;
    if (this._data.length === 0) {
      this._strokeBegin(t);
      return;
    }
    this.dispatchEvent(
      new CustomEvent("beforeUpdateStroke", { detail: t })
    );
    const e = this._createPoint(t.x, t.y, t.pressure), s = this._data[this._data.length - 1], i = s.points, o = i.length > 0 && i[i.length - 1], u = o ? e.distanceTo(o) <= this.minDistance : !1, l = this._getPointGroupOptions(s);
    if (!o || !(o && u)) {
      const d = this._addPoint(e, l);
      o ? d && this._drawCurve(d, l) : this._drawDot(e, l), i.push({
        time: e.time,
        x: e.x,
        y: e.y,
        pressure: e.pressure
      });
    }
    this.dispatchEvent(new CustomEvent("afterUpdateStroke", { detail: t }));
  }
  _strokeEnd(t, e = !0) {
    this._removeMoveUpEventListeners(), this._drawingStroke && (e && this._strokeUpdate(t), this._drawingStroke = !1, this._strokePointerId = void 0, this.dispatchEvent(new CustomEvent("endStroke", { detail: t })));
  }
  _handlePointerEvents() {
    this._drawingStroke = !1, this.canvas.addEventListener("pointerdown", this._handlePointerDown, {
      passive: !1
    });
  }
  _handleMouseEvents() {
    this._drawingStroke = !1, this.canvas.addEventListener("mousedown", this._handleMouseDown, {
      passive: !1
    });
  }
  _handleTouchEvents() {
    this.canvas.addEventListener("touchstart", this._handleTouchStart, {
      passive: !1
    });
  }
  // Called when a new line is started
  _reset(t) {
    this._lastPoints = [], this._lastVelocity = 0, this._lastWidth = (t.minWidth + t.maxWidth) / 2, this._ctx.fillStyle = t.penColor, this._ctx.globalCompositeOperation = t.compositeOperation;
  }
  _createPoint(t, e, s) {
    const i = this.canvas.getBoundingClientRect();
    return new E(
      t - i.left,
      e - i.top,
      s,
      (/* @__PURE__ */ new Date()).getTime()
    );
  }
  // Add point to _lastPoints array and generate a new curve if there are enough points (i.e. 3)
  _addPoint(t, e) {
    const { _lastPoints: s } = this;
    if (s.push(t), s.length > 2) {
      s.length === 3 && s.unshift(s[0]);
      const i = this._calculateCurveWidths(
        s[1],
        s[2],
        e
      ), o = R.fromPoints(s, i);
      return s.shift(), o;
    }
    return null;
  }
  _calculateCurveWidths(t, e, s) {
    const i = s.velocityFilterWeight * e.velocityFrom(t) + (1 - s.velocityFilterWeight) * this._lastVelocity, o = this._strokeWidth(i, s), u = {
      end: o,
      start: this._lastWidth
    };
    return this._lastVelocity = i, this._lastWidth = o, u;
  }
  _strokeWidth(t, e) {
    return Math.max(e.maxWidth / (t + 1), e.minWidth);
  }
  _drawCurveSegment(t, e, s) {
    const i = this._ctx;
    i.moveTo(t, e), i.arc(t, e, s, 0, 2 * Math.PI, !1), this._isEmpty = !1;
  }
  _drawCurve(t, e) {
    const s = this._ctx, i = t.endWidth - t.startWidth, o = Math.ceil(t.length()) * 2;
    s.beginPath(), s.fillStyle = e.penColor;
    for (let u = 0; u < o; u += 1) {
      const l = u / o, d = l * l, c = d * l, p = 1 - l, x = p * p, h = x * p;
      let g = h * t.startPoint.x;
      g += 3 * x * l * t.control1.x, g += 3 * p * d * t.control2.x, g += c * t.endPoint.x;
      let _ = h * t.startPoint.y;
      _ += 3 * x * l * t.control1.y, _ += 3 * p * d * t.control2.y, _ += c * t.endPoint.y;
      const r = Math.min(
        t.startWidth + c * i,
        e.maxWidth
      );
      this._drawCurveSegment(g, _, r);
    }
    s.closePath(), s.fill();
  }
  _drawDot(t, e) {
    const s = this._ctx, i = e.dotSize > 0 ? e.dotSize : (e.minWidth + e.maxWidth) / 2;
    s.beginPath(), this._drawCurveSegment(t.x, t.y, i), s.closePath(), s.fillStyle = e.penColor, s.fill();
  }
  _fromData(t, e, s) {
    for (const i of t) {
      const { points: o } = i, u = this._getPointGroupOptions(i);
      if (o.length > 1)
        for (let l = 0; l < o.length; l += 1) {
          const d = o[l], c = new E(
            d.x,
            d.y,
            d.pressure,
            d.time
          );
          l === 0 && this._reset(u);
          const p = this._addPoint(c, u);
          p && e(p, u);
        }
      else
        this._reset(u), s(o[0], u);
    }
  }
  toSVG({ includeBackgroundColor: t = !1, includeDataUrl: e = !1 } = {}) {
    var p, x, h, g, _;
    const s = this._data, i = Math.max(window.devicePixelRatio || 1, 1), o = 0, u = 0, l = this.canvas.width / i, d = this.canvas.height / i, c = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if (c.setAttribute("xmlns", "http://www.w3.org/2000/svg"), c.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), c.setAttribute("viewBox", `${o} ${u} ${l} ${d}`), c.setAttribute("width", l.toString()), c.setAttribute("height", d.toString()), t && this.backgroundColor) {
      const r = document.createElement("rect");
      r.setAttribute("width", "100%"), r.setAttribute("height", "100%"), r.setAttribute("fill", this.backgroundColor), c.appendChild(r);
    }
    if (e && this._dataUrl) {
      const r = ((p = this._dataUrlOptions) == null ? void 0 : p.ratio) || window.devicePixelRatio || 1, m = ((x = this._dataUrlOptions) == null ? void 0 : x.width) || this.canvas.width / r, v = ((h = this._dataUrlOptions) == null ? void 0 : h.height) || this.canvas.height / r, y = ((g = this._dataUrlOptions) == null ? void 0 : g.xOffset) || 0, P = ((_ = this._dataUrlOptions) == null ? void 0 : _.yOffset) || 0, w = document.createElement("image");
      w.setAttribute("x", y.toString()), w.setAttribute("y", P.toString()), w.setAttribute("width", m.toString()), w.setAttribute("height", v.toString()), w.setAttribute("preserveAspectRatio", "none"), w.setAttribute("href", this._dataUrl), c.appendChild(w);
    }
    return this._fromData(
      s,
      (r, { penColor: m }) => {
        const v = document.createElement("path");
        if (!isNaN(r.control1.x) && !isNaN(r.control1.y) && !isNaN(r.control2.x) && !isNaN(r.control2.y)) {
          const y = `M ${r.startPoint.x.toFixed(3)},${r.startPoint.y.toFixed(
            3
          )} C ${r.control1.x.toFixed(3)},${r.control1.y.toFixed(3)} ${r.control2.x.toFixed(3)},${r.control2.y.toFixed(3)} ${r.endPoint.x.toFixed(3)},${r.endPoint.y.toFixed(3)}`;
          v.setAttribute("d", y), v.setAttribute("stroke-width", (r.endWidth * 2.25).toFixed(3)), v.setAttribute("stroke", m), v.setAttribute("fill", "none"), v.setAttribute("stroke-linecap", "round"), c.appendChild(v);
        }
      },
      (r, { penColor: m, dotSize: v, minWidth: y, maxWidth: P }) => {
        const w = document.createElement("circle"), M = v > 0 ? v : (y + P) / 2;
        w.setAttribute("r", M.toString()), w.setAttribute("cx", r.x.toString()), w.setAttribute("cy", r.y.toString()), w.setAttribute("fill", m), c.appendChild(w);
      }
    ), c.outerHTML;
  }
};
const G = ["id", "data-uid", "disabled"], j = {
  name: "Vue3Signature"
}, V = /* @__PURE__ */ U({
  ...j,
  props: {
    sigOption: {
      type: Object,
      default: () => ({
        backgroundColor: "rgb(255,255,255)",
        penColor: "rgb(0, 0, 0)"
      })
    },
    w: {
      type: String,
      default: "100%"
    },
    h: {
      type: String,
      default: "100%"
    },
    clearOnResize: {
      type: Boolean,
      default: !1
    },
    waterMark: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    defaultUrl: {
      type: String,
      default: ""
    }
  },
  emits: ["begin", "end"],
  setup(a, { expose: n, emit: t }) {
    const e = a, s = {
      width: "100%",
      height: "100%"
    };
    let i = D({
      sig: void 0,
      option: {
        backgroundColor: "rgb(255,255,255)",
        penColor: "rgb(0, 0, 0)",
        ...e.sigOption
      },
      uid: "canvas" + Math.random()
    });
    W(
      () => e.disabled,
      (h) => {
        h ? i.sig.off() : i.sig.on();
      }
    );
    const o = () => {
      let h = document.getElementById(i.uid);
      i.sig = new $(h, i.option), i.sig.onBegin = () => t("begin"), i.sig.onEnd = () => t("end");
      function g(_) {
        let r;
        c() || (r = l());
        let m = Math.max(window.devicePixelRatio || 1, 1);
        const v = RegExp(/px/);
        _.width = v.test(e.w) ? Number(e.w.replace(/px/g, "")) * m : _.offsetWidth * m, _.height = v.test(e.h) ? Number(e.h.replace(/px/g, "")) * m : _.offsetHeight * m;
        const y = _.getContext("2d");
        y && y.scale(m, m), u(), !e.clearOnResize && r !== void 0 && d(r), Object.keys(e.waterMark).length && x(e.waterMark);
      }
      window.addEventListener("resize", () => g(h)), g(h), e.defaultUrl !== "" && d(e.defaultUrl), e.disabled ? i.sig.off() : i.sig.on();
    }, u = () => {
      i.sig.clear();
    }, l = (h) => h ? i.sig.toDataURL(h) : i.sig.toDataURL(), d = (h) => {
      i.sig.fromDataURL(h);
    }, c = () => i.sig.isEmpty(), p = () => {
      let h = i.sig.toData();
      h && (h.pop(), i.sig.fromData(h));
    }, x = (h) => {
      if (Object.prototype.toString.call(h) != "[object Object]")
        throw new Error("Expected Object, got " + typeof h + ".");
      {
        let g = document.getElementById(i.uid), _ = {
          text: h.text || "",
          x: h.x || 20,
          y: h.y || 20,
          sx: h.sx || 40,
          sy: h.sy || 40
        }, r = g.getContext("2d");
        if (!r) return;
        r.font = h.font || "20px sans-serif", r.fillStyle = h.fillStyle || "#333", r.strokeStyle = h.strokeStyle || "#333", h.style == "all" ? (r.fillText(_.text, _.x, _.y), r.strokeText(_.text, _.sx, _.sy)) : h.style == "stroke" ? r.strokeText(_.text, _.sx, _.sy) : r.fillText(_.text, _.x, _.y), i.sig._isEmpty = !1;
      }
    };
    return O(() => {
      o();
    }), n({
      save: l,
      clear: u,
      isEmpty: c,
      undo: p,
      addWaterMark: x,
      fromDataURL: d
    }), (h, g) => (A(), L("div", {
      style: F({ width: a.w, height: a.h }),
      onTouchmove: g[0] || (g[0] = B(() => {
      }, ["prevent"]))
    }, [
      I("canvas", {
        id: b(i).uid,
        "data-uid": b(i).uid,
        disabled: b(i).disabled,
        style: s
      }, null, 8, G)
    ], 36));
  }
});
function q(a) {
  return a.install = (n) => {
    n.component(a.name, a);
  }, a;
}
const H = q(V);
export {
  H as default
};
