(function(){"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.appendChild(document.createTextNode(".vue3-signature__canvas[data-v-c691789c]{width:100%;height:100%;display:block}.vue3-signature__canvas--disabled[data-v-c691789c]{cursor:not-allowed}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
var ut = Object.defineProperty;
var ft = (l, a, t) => a in l ? ut(l, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[a] = t;
var m = (l, a, t) => ft(l, typeof a != "symbol" ? a + "" : a, t);
import { defineComponent as vt, ref as _t, shallowRef as gt, reactive as mt, watch as A, onMounted as pt, onBeforeUnmount as wt, openBlock as yt, createElementBlock as xt, withModifiers as Et, normalizeStyle as bt, createElementVNode as St, normalizeClass as kt, nextTick as Pt } from "vue";
/*!
 * Signature Pad v5.1.1 | https://github.com/szimek/signature_pad
 * (c) 2025 Szymon Nowak | Released under the MIT license
 */
var $ = class {
  constructor(l, a, t, e) {
    m(this, "x");
    m(this, "y");
    m(this, "pressure");
    m(this, "time");
    if (isNaN(l) || isNaN(a))
      throw new Error(`Point is invalid: (${l}, ${a})`);
    this.x = +l, this.y = +a, this.pressure = t || 0, this.time = e || Date.now();
  }
  distanceTo(l) {
    return Math.sqrt(
      Math.pow(this.x - l.x, 2) + Math.pow(this.y - l.y, 2)
    );
  }
  equals(l) {
    return this.x === l.x && this.y === l.y && this.pressure === l.pressure && this.time === l.time;
  }
  velocityFrom(l) {
    return this.time !== l.time ? this.distanceTo(l) / (this.time - l.time) : 0;
  }
}, Ut = class X {
  constructor(a, t, e, s, r, c) {
    this.startPoint = a, this.control2 = t, this.control1 = e, this.endPoint = s, this.startWidth = r, this.endWidth = c;
  }
  static fromPoints(a, t) {
    const e = this.calculateControlPoints(a[0], a[1], a[2]).c2, s = this.calculateControlPoints(a[1], a[2], a[3]).c1;
    return new X(a[1], e, s, a[2], t.start, t.end);
  }
  static calculateControlPoints(a, t, e) {
    const s = a.x - t.x, r = a.y - t.y, c = t.x - e.x, o = t.y - e.y, u = { x: (a.x + t.x) / 2, y: (a.y + t.y) / 2 }, f = { x: (t.x + e.x) / 2, y: (t.y + e.y) / 2 }, _ = Math.sqrt(s * s + r * r), p = Math.sqrt(c * c + o * o), U = u.x - f.x, T = u.y - f.y, E = _ + p == 0 ? 0 : p / (_ + p), C = { x: f.x + U * E, y: f.y + T * E }, v = t.x - C.x, D = t.y - C.y;
    return {
      c1: new $(u.x + v, u.y + D),
      c2: new $(f.x + v, f.y + D)
    };
  }
  // Returns approximated length. Code taken from https://www.lemoda.net/maths/bezier-length/index.html.
  length() {
    let t = 0, e, s;
    for (let r = 0; r <= 10; r += 1) {
      const c = r / 10, o = this.point(
        c,
        this.startPoint.x,
        this.control1.x,
        this.control2.x,
        this.endPoint.x
      ), u = this.point(
        c,
        this.startPoint.y,
        this.control1.y,
        this.control2.y,
        this.endPoint.y
      );
      if (r > 0) {
        const f = o - e, _ = u - s;
        t += Math.sqrt(f * f + _ * _);
      }
      e = o, s = u;
    }
    return t;
  }
  // Calculate parametric value of x or y given t and the four point coordinates of a cubic bezier curve.
  point(a, t, e, s, r) {
    return t * (1 - a) * (1 - a) * (1 - a) + 3 * e * (1 - a) * (1 - a) * a + 3 * s * (1 - a) * a * a + r * a * a * a;
  }
}, Ct = class {
  /* tslint:enable: variable-name */
  constructor() {
    /* tslint:disable: variable-name */
    m(this, "_et");
    try {
      this._et = new EventTarget();
    } catch {
      this._et = document;
    }
  }
  addEventListener(l, a, t) {
    this._et.addEventListener(l, a, t);
  }
  dispatchEvent(l) {
    return this._et.dispatchEvent(l);
  }
  removeEventListener(l, a, t) {
    this._et.removeEventListener(l, a, t);
  }
};
function Mt(l, a = 250) {
  let t = 0, e = null, s, r, c;
  const o = () => {
    t = Date.now(), e = null, s = l.apply(r, c), e || (r = null, c = []);
  };
  return function(...f) {
    const _ = Date.now(), p = a - (_ - t);
    return r = this, c = f, p <= 0 || p > a ? (e && (clearTimeout(e), e = null), t = _, s = l.apply(r, c), e || (r = null, c = [])) : e || (e = window.setTimeout(o, p)), s;
  };
}
var Dt = class G extends Ct {
  /* tslint:enable: variable-name */
  constructor(t, e = {}) {
    super();
    // Public stuff
    m(this, "dotSize");
    m(this, "minWidth");
    m(this, "maxWidth");
    m(this, "penColor");
    m(this, "minDistance");
    m(this, "velocityFilterWeight");
    m(this, "compositeOperation");
    m(this, "backgroundColor");
    m(this, "throttle");
    m(this, "canvasContextOptions");
    // Private stuff
    /* tslint:disable: variable-name */
    m(this, "_ctx");
    m(this, "_drawingStroke", !1);
    m(this, "_isEmpty", !0);
    m(this, "_dataUrl");
    m(this, "_dataUrlOptions");
    m(this, "_lastPoints", []);
    // Stores up to 4 most recent points; used to generate a new curve
    m(this, "_data", []);
    // Stores all points in groups (one group per line or dot)
    m(this, "_lastVelocity", 0);
    m(this, "_lastWidth", 0);
    m(this, "_strokeMoveUpdate");
    m(this, "_strokePointerId");
    this.canvas = t, this.velocityFilterWeight = e.velocityFilterWeight || 0.7, this.minWidth = e.minWidth || 0.5, this.maxWidth = e.maxWidth || 2.5, this.throttle = e.throttle ?? 16, this.minDistance = e.minDistance ?? 5, this.dotSize = e.dotSize || 0, this.penColor = e.penColor || "black", this.backgroundColor = e.backgroundColor || "rgba(0,0,0,0)", this.compositeOperation = e.compositeOperation || "source-over", this.canvasContextOptions = e.canvasContextOptions ?? {}, this._strokeMoveUpdate = this.throttle ? Mt(G.prototype._strokeUpdate, this.throttle) : G.prototype._strokeUpdate, this._handleMouseDown = this._handleMouseDown.bind(this), this._handleMouseMove = this._handleMouseMove.bind(this), this._handleMouseUp = this._handleMouseUp.bind(this), this._handleTouchStart = this._handleTouchStart.bind(this), this._handleTouchMove = this._handleTouchMove.bind(this), this._handleTouchEnd = this._handleTouchEnd.bind(this), this._handlePointerDown = this._handlePointerDown.bind(this), this._handlePointerMove = this._handlePointerMove.bind(this), this._handlePointerUp = this._handlePointerUp.bind(this), this._ctx = t.getContext(
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
    return new Promise((s, r) => {
      const c = new Image(), o = e.ratio || window.devicePixelRatio || 1, u = e.width || this.canvas.width / o, f = e.height || this.canvas.height / o, _ = e.xOffset || 0, p = e.yOffset || 0;
      this._reset(this._getPointGroupOptions()), c.onload = () => {
        this._ctx.drawImage(c, _, p, u, f), s();
      }, c.onerror = (U) => {
        r(U);
      }, c.crossOrigin = "anonymous", c.src = t, this._isEmpty = !1, this._dataUrl = t, this._dataUrlOptions = { ...e };
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
    const r = this._getPointGroupOptions(), c = {
      ...r,
      points: []
    };
    this._data.push(c), this._reset(r), this._strokeUpdate(t);
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
    const e = this._createPoint(t.x, t.y, t.pressure), s = this._data[this._data.length - 1], r = s.points, c = r.length > 0 && r[r.length - 1], o = c ? e.distanceTo(c) <= this.minDistance : !1, u = this._getPointGroupOptions(s);
    if (!c || !(c && o)) {
      const f = this._addPoint(e, u);
      c ? f && this._drawCurve(f, u) : this._drawDot(e, u), r.push({
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
    const r = this.canvas.getBoundingClientRect();
    return new $(
      t - r.left,
      e - r.top,
      s,
      (/* @__PURE__ */ new Date()).getTime()
    );
  }
  // Add point to _lastPoints array and generate a new curve if there are enough points (i.e. 3)
  _addPoint(t, e) {
    const { _lastPoints: s } = this;
    if (s.push(t), s.length > 2) {
      s.length === 3 && s.unshift(s[0]);
      const r = this._calculateCurveWidths(
        s[1],
        s[2],
        e
      ), c = Ut.fromPoints(s, r);
      return s.shift(), c;
    }
    return null;
  }
  _calculateCurveWidths(t, e, s) {
    const r = s.velocityFilterWeight * e.velocityFrom(t) + (1 - s.velocityFilterWeight) * this._lastVelocity, c = this._strokeWidth(r, s), o = {
      end: c,
      start: this._lastWidth
    };
    return this._lastVelocity = r, this._lastWidth = c, o;
  }
  _strokeWidth(t, e) {
    return Math.max(e.maxWidth / (t + 1), e.minWidth);
  }
  _drawCurveSegment(t, e, s) {
    const r = this._ctx;
    r.moveTo(t, e), r.arc(t, e, s, 0, 2 * Math.PI, !1), this._isEmpty = !1;
  }
  _drawCurve(t, e) {
    const s = this._ctx, r = t.endWidth - t.startWidth, c = Math.ceil(t.length()) * 2;
    s.beginPath(), s.fillStyle = e.penColor;
    for (let o = 0; o < c; o += 1) {
      const u = o / c, f = u * u, _ = f * u, p = 1 - u, U = p * p, T = U * p;
      let E = T * t.startPoint.x;
      E += 3 * U * u * t.control1.x, E += 3 * p * f * t.control2.x, E += _ * t.endPoint.x;
      let C = T * t.startPoint.y;
      C += 3 * U * u * t.control1.y, C += 3 * p * f * t.control2.y, C += _ * t.endPoint.y;
      const v = Math.min(
        t.startWidth + _ * r,
        e.maxWidth
      );
      this._drawCurveSegment(E, C, v);
    }
    s.closePath(), s.fill();
  }
  _drawDot(t, e) {
    const s = this._ctx, r = e.dotSize > 0 ? e.dotSize : (e.minWidth + e.maxWidth) / 2;
    s.beginPath(), this._drawCurveSegment(t.x, t.y, r), s.closePath(), s.fillStyle = e.penColor, s.fill();
  }
  _fromData(t, e, s) {
    for (const r of t) {
      const { points: c } = r, o = this._getPointGroupOptions(r);
      if (c.length > 1)
        for (let u = 0; u < c.length; u += 1) {
          const f = c[u], _ = new $(
            f.x,
            f.y,
            f.pressure,
            f.time
          );
          u === 0 && this._reset(o);
          const p = this._addPoint(_, o);
          p && e(p, o);
        }
      else
        this._reset(o), s(c[0], o);
    }
  }
  toSVG({ includeBackgroundColor: t = !1, includeDataUrl: e = !1 } = {}) {
    var p, U, T, E, C;
    const s = this._data, r = Math.max(window.devicePixelRatio || 1, 1), c = 0, o = 0, u = this.canvas.width / r, f = this.canvas.height / r, _ = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if (_.setAttribute("xmlns", "http://www.w3.org/2000/svg"), _.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), _.setAttribute("viewBox", `${c} ${o} ${u} ${f}`), _.setAttribute("width", u.toString()), _.setAttribute("height", f.toString()), t && this.backgroundColor) {
      const v = document.createElement("rect");
      v.setAttribute("width", "100%"), v.setAttribute("height", "100%"), v.setAttribute("fill", this.backgroundColor), _.appendChild(v);
    }
    if (e && this._dataUrl) {
      const v = ((p = this._dataUrlOptions) == null ? void 0 : p.ratio) || window.devicePixelRatio || 1, D = ((U = this._dataUrlOptions) == null ? void 0 : U.width) || this.canvas.width / v, S = ((T = this._dataUrlOptions) == null ? void 0 : T.height) || this.canvas.height / v, L = ((E = this._dataUrlOptions) == null ? void 0 : E.xOffset) || 0, W = ((C = this._dataUrlOptions) == null ? void 0 : C.yOffset) || 0, y = document.createElement("image");
      y.setAttribute("x", L.toString()), y.setAttribute("y", W.toString()), y.setAttribute("width", D.toString()), y.setAttribute("height", S.toString()), y.setAttribute("preserveAspectRatio", "none"), y.setAttribute("href", this._dataUrl), _.appendChild(y);
    }
    return this._fromData(
      s,
      (v, { penColor: D }) => {
        const S = document.createElement("path");
        if (!isNaN(v.control1.x) && !isNaN(v.control1.y) && !isNaN(v.control2.x) && !isNaN(v.control2.y)) {
          const L = `M ${v.startPoint.x.toFixed(3)},${v.startPoint.y.toFixed(
            3
          )} C ${v.control1.x.toFixed(3)},${v.control1.y.toFixed(3)} ${v.control2.x.toFixed(3)},${v.control2.y.toFixed(3)} ${v.endPoint.x.toFixed(3)},${v.endPoint.y.toFixed(3)}`;
          S.setAttribute("d", L), S.setAttribute("stroke-width", (v.endWidth * 2.25).toFixed(3)), S.setAttribute("stroke", D), S.setAttribute("fill", "none"), S.setAttribute("stroke-linecap", "round"), _.appendChild(S);
        }
      },
      (v, { penColor: D, dotSize: S, minWidth: L, maxWidth: W }) => {
        const y = document.createElement("circle"), F = S > 0 ? S : (L + W) / 2;
        y.setAttribute("r", F.toString()), y.setAttribute("cx", v.x.toString()), y.setAttribute("cy", v.y.toString()), y.setAttribute("fill", D), _.appendChild(y);
      }
    ), _.outerHTML;
  }
};
const Tt = ["aria-disabled"], Lt = {
  name: "Vue3Signature"
}, Ot = /* @__PURE__ */ vt({
  ...Lt,
  props: {
    sigOption: {
      type: Object,
      default: () => ({})
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
  emits: ["ready", "begin", "end", "beginStroke", "endStroke", "beforeUpdateStroke", "afterUpdateStroke"],
  setup(l, { expose: a, emit: t }) {
    const e = l, s = {
      width: "100%",
      height: "100%"
    }, r = _t(null), c = `canvas-${Math.random().toString(36).slice(2, 9)}`, o = gt(null), u = mt({
      backgroundColor: "rgb(255,255,255)",
      penColor: "rgb(0, 0, 0)",
      minWidth: 0.5,
      maxWidth: 2.5,
      ...e.sigOption
    });
    let f = null;
    const _ = /* @__PURE__ */ new Map(), p = () => {
      if (typeof document > "u")
        return null;
      if (f)
        return f;
      const i = document.createElement("canvas");
      return i.width = 1, i.height = 1, f = i.getContext("2d", { willReadFrequently: !0 }), f;
    }, U = (i) => {
      if (!i)
        return null;
      if (_.has(i))
        return _.get(i);
      const n = p();
      if (!n)
        return null;
      n.clearRect(0, 0, 1, 1);
      try {
        n.fillStyle = i;
      } catch (g) {
        return console.warn(`[vue3-signature] Unable to parse color "${i}"`, g), null;
      }
      n.fillRect(0, 0, 1, 1);
      const h = n.getImageData(0, 0, 1, 1).data, d = [h[0], h[1], h[2], h[3]];
      return _.set(i, d), d;
    }, T = (i, n) => {
      const { width: h, height: d, data: g } = i, b = U(n);
      let w = d, x = h, M = -1, k = -1;
      const N = (P) => b ? g[P] === b[0] && g[P + 1] === b[1] && g[P + 2] === b[2] && g[P + 3] === b[3] : g[P + 3] === 0;
      for (let P = 0; P < d; P += 1)
        for (let O = 0; O < h; O += 1) {
          const dt = (P * h + O) * 4;
          N(dt) || (O < x && (x = O), O > M && (M = O), P < w && (w = P), P > k && (k = P));
        }
      if (M === -1 || k === -1)
        return null;
      const z = M - x + 1, R = k - w + 1;
      return z <= 0 || R <= 0 ? null : {
        x,
        y: w,
        width: z,
        height: R
      };
    }, E = [], C = (i) => {
      i && Object.entries(i).forEach(([n, h]) => {
        h !== void 0 && (u[n] = h);
      });
    }, v = () => {
      var i;
      W(), (i = o.value) == null || i.off(), o.value = null;
    }, D = (i) => {
      let n, h = [];
      const d = !i.isEmpty();
      try {
        h = i.toData();
      } catch (g) {
        console.warn("[vue3-signature] Failed to read signature data", g);
      }
      if (d && !h.length)
        try {
          n = i.toDataURL();
        } catch (g) {
          console.warn("[vue3-signature] Failed to capture dataURL", g);
        }
      return {
        hasSignature: d,
        strokes: h,
        dataUrl: n
      };
    }, S = (i) => {
      var n;
      if (!(!i || !o.value || !i.hasSignature)) {
        if ((n = i.strokes) != null && n.length) {
          o.value.fromData(i.strokes);
          return;
        }
        i.dataUrl && o.value.fromDataURL(i.dataUrl).catch(() => {
        });
      }
    }, L = () => {
      if (!o.value) return;
      W(), Object.entries({
        beginStroke: (n) => {
          t("beginStroke", n), t("begin");
        },
        endStroke: (n) => {
          t("endStroke", n), t("end");
        },
        beforeUpdateStroke: (n) => t("beforeUpdateStroke", n),
        afterUpdateStroke: (n) => t("afterUpdateStroke", n)
      }).forEach(([n, h]) => {
        var g;
        const d = (b) => {
          const w = b.detail;
          h(w);
        };
        (g = o.value) == null || g.addEventListener(n, d), E.push({ type: n, listener: d });
      });
    };
    function W() {
      !o.value || !E.length || (E.forEach(({ type: i, listener: n }) => {
        var h;
        (h = o.value) == null || h.removeEventListener(i, n);
      }), E.length = 0);
    }
    const y = (i) => {
      o.value && (i ? o.value.off() : o.value.on());
    }, F = (i, n) => {
      if (/px$/i.test(i)) {
        const h = Number(i.replace(/px/gi, ""));
        return Number.isFinite(h) ? h : n;
      }
      return n;
    }, I = () => {
      const i = r.value, n = o.value;
      if (!i || !n) return;
      let h;
      !e.clearOnResize && !n.isEmpty() && (h = D(n));
      const d = Math.max(window.devicePixelRatio || 1, 1), g = i.parentElement, b = (g == null ? void 0 : g.clientWidth) ?? i.offsetWidth, w = (g == null ? void 0 : g.clientHeight) ?? i.offsetHeight, x = F(e.w, b), M = F(e.h, w);
      i.width = x * d, i.height = M * d;
      const k = i.getContext("2d");
      k == null || k.scale(d, d), n.clear(), h ? S(h) : Object.keys(e.waterMark).length && B(e.waterMark);
    }, j = (i) => {
      !i || !o.value || o.value.fromDataURL(i).catch(() => {
      });
    }, Y = (i) => {
      var n;
      return i ?? ((n = o.value) == null ? void 0 : n.backgroundColor) ?? u.backgroundColor ?? "rgba(0,0,0,0)";
    }, V = (i) => {
      const n = r.value, h = o.value;
      if (!n || !h || h.isEmpty() || !n.width || !n.height)
        return null;
      const d = document.createElement("canvas");
      d.width = n.width, d.height = n.height;
      const g = d.getContext("2d", { willReadFrequently: !0 });
      if (!g)
        return null;
      g.drawImage(n, 0, 0);
      const b = g.getImageData(0, 0, n.width, n.height), w = T(b, Y(i == null ? void 0 : i.backgroundColor));
      if (!w)
        return null;
      const x = document.createElement("canvas");
      x.width = w.width, x.height = w.height;
      const M = x.getContext("2d");
      if (!M)
        return null;
      M.putImageData(b, -w.x, -w.y);
      let k;
      return i != null && i.format ? k = x.toDataURL(i.format, i.encoderOptions) : k = x.toDataURL(), {
        canvas: x,
        dataUrl: k,
        bounds: w
      };
    }, J = (i, n) => {
      var h;
      return ((h = V({ format: i, encoderOptions: n })) == null ? void 0 : h.dataUrl) ?? "";
    }, B = (i) => {
      if (Object.prototype.toString.call(i) !== "[object Object]")
        throw new Error("Expected Object, got " + typeof i + ".");
      const n = r.value, h = o.value;
      if (!n || !h) return;
      const d = n.getContext("2d");
      if (!d) return;
      const {
        text: g = "",
        x: b = 20,
        y: w = 20,
        sx: x = 40,
        sy: M = 40,
        font: k = "20px sans-serif",
        fillStyle: N = "#333",
        strokeStyle: z = "#333",
        style: R = "fill"
      } = i;
      d.save(), d.font = k, d.fillStyle = N, d.strokeStyle = z, R === "all" ? (d.fillText(g, b, w), d.strokeText(g, x, M)) : R === "stroke" ? d.strokeText(g, x, M) : d.fillText(g, b, w), d.restore(), h._isEmpty = !1;
    }, q = async (i = !1) => {
      const n = r.value;
      if (!n) return;
      const h = i && o.value ? D(o.value) : void 0;
      v(), o.value = new Dt(n, { ...u }), L(), y(e.disabled), await Pt(), I(), h ? S(h) : e.defaultUrl ? j(e.defaultUrl) : Object.keys(e.waterMark).length && B(e.waterMark), t("ready", o.value);
    }, K = () => {
      var i;
      return (i = o.value) == null ? void 0 : i.clear();
    }, Q = () => {
      var i;
      return (i = o.value) == null ? void 0 : i.redraw();
    }, H = (i, n) => o.value ? o.value.toDataURL(i, n) : "", Z = (i) => {
      var n;
      return ((n = o.value) == null ? void 0 : n.toSVG(i)) ?? "";
    }, tt = H, et = (i, n) => {
      var h;
      return (h = o.value) == null ? void 0 : h.fromDataURL(i, n);
    }, it = (i, n) => {
      var h;
      return (h = o.value) == null ? void 0 : h.fromData(i, n);
    }, nt = () => {
      var i;
      return ((i = o.value) == null ? void 0 : i.toData()) ?? [];
    }, st = () => {
      var i;
      return ((i = o.value) == null ? void 0 : i.isEmpty()) ?? !0;
    }, ot = () => {
      var i;
      return (i = o.value) == null ? void 0 : i.on();
    }, at = () => {
      var i;
      return (i = o.value) == null ? void 0 : i.off();
    }, rt = (i, n, h) => {
      var d;
      return (d = o.value) == null ? void 0 : d.addEventListener(i, n, h);
    }, ht = (i, n, h) => {
      var d;
      return (d = o.value) == null ? void 0 : d.removeEventListener(i, n, h);
    }, lt = (i = 1) => {
      const n = o.value;
      if (!n || i <= 0) return;
      const h = n.toData();
      h.length && (h.splice(Math.max(h.length - i, 0), i), n.fromData(h));
    }, ct = () => o.value;
    return A(
      () => e.sigOption,
      (i) => {
        C(i), q(!0);
      },
      { deep: !0 }
    ), A(
      () => e.disabled,
      (i) => y(i),
      { immediate: !0 }
    ), A(
      () => e.defaultUrl,
      (i) => j(i)
    ), A(
      () => [e.w, e.h],
      () => I()
    ), A(
      () => e.waterMark,
      (i) => {
        i && Object.keys(i).length && B(i);
      },
      { deep: !0 }
    ), pt(() => {
      q(), window.addEventListener("resize", I);
    }), wt(() => {
      window.removeEventListener("resize", I), v();
    }), a({
      clear: K,
      save: tt,
      toDataURL: H,
      toTrimmedDataURL: J,
      toSVG: Z,
      fromDataURL: et,
      fromData: it,
      toData: nt,
      redraw: Q,
      isEmpty: st,
      undo: lt,
      addWaterMark: B,
      trim: V,
      enable: ot,
      disable: at,
      addEventListener: rt,
      removeEventListener: ht,
      getInstance: ct
    }), (i, n) => (yt(), xt("div", {
      class: "vue3-signature",
      style: bt({ width: l.w, height: l.h }),
      onTouchmove: n[0] || (n[0] = Et(() => {
      }, ["prevent"]))
    }, [
      St("canvas", {
        ref_key: "canvasRef",
        ref: r,
        class: kt(["vue3-signature__canvas", { "vue3-signature__canvas--disabled": l.disabled }]),
        "data-uid": c,
        "aria-disabled": l.disabled ? "true" : void 0,
        style: s
      }, null, 10, Tt)
    ], 36));
  }
}), Wt = (l, a) => {
  const t = l.__vccOpts || l;
  for (const [e, s] of a)
    t[e] = s;
  return t;
}, Rt = /* @__PURE__ */ Wt(Ot, [["__scopeId", "data-v-c691789c"]]);
function At(l) {
  return l.install = (a) => {
    a.component(l.name, l);
  }, l;
}
const Bt = At(Rt);
export {
  Bt as default
};
