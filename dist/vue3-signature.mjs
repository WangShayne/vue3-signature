var vt = Object.defineProperty;
var _t = (c, a, t) => a in c ? vt(c, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[a] = t;
var m = (c, a, t) => _t(c, typeof a != "symbol" ? a + "" : a, t);
import { defineComponent as gt, ref as mt, shallowRef as pt, reactive as wt, watch as F, onMounted as yt, onBeforeUnmount as xt, createElementBlock as Et, openBlock as bt, withModifiers as St, normalizeStyle as kt, createElementVNode as Pt, normalizeClass as Ut, nextTick as Dt } from "vue";
/*!
 * Signature Pad v5.1.1 | https://github.com/szimek/signature_pad
 * (c) 2025 Szymon Nowak | Released under the MIT license
 */
var N = class {
  constructor(c, a, t, e) {
    m(this, "x");
    m(this, "y");
    m(this, "pressure");
    m(this, "time");
    if (isNaN(c) || isNaN(a))
      throw new Error(`Point is invalid: (${c}, ${a})`);
    this.x = +c, this.y = +a, this.pressure = t || 0, this.time = e || Date.now();
  }
  distanceTo(c) {
    return Math.sqrt(
      Math.pow(this.x - c.x, 2) + Math.pow(this.y - c.y, 2)
    );
  }
  equals(c) {
    return this.x === c.x && this.y === c.y && this.pressure === c.pressure && this.time === c.time;
  }
  velocityFrom(c) {
    return this.time !== c.time ? this.distanceTo(c) / (this.time - c.time) : 0;
  }
}, Mt = class J {
  constructor(a, t, e, o, r, d) {
    this.startPoint = a, this.control2 = t, this.control1 = e, this.endPoint = o, this.startWidth = r, this.endWidth = d;
  }
  static fromPoints(a, t) {
    const e = this.calculateControlPoints(a[0], a[1], a[2]).c2, o = this.calculateControlPoints(a[1], a[2], a[3]).c1;
    return new J(a[1], e, o, a[2], t.start, t.end);
  }
  static calculateControlPoints(a, t, e) {
    const o = a.x - t.x, r = a.y - t.y, d = t.x - e.x, s = t.y - e.y, u = { x: (a.x + t.x) / 2, y: (a.y + t.y) / 2 }, f = { x: (t.x + e.x) / 2, y: (t.y + e.y) / 2 }, _ = Math.sqrt(o * o + r * r), p = Math.sqrt(d * d + s * s), P = u.x - f.x, T = u.y - f.y, y = _ + p == 0 ? 0 : p / (_ + p), U = { x: f.x + P * y, y: f.y + T * y }, v = t.x - U.x, M = t.y - U.y;
    return {
      c1: new N(u.x + v, u.y + M),
      c2: new N(f.x + v, f.y + M)
    };
  }
  // Returns approximated length. Code taken from https://www.lemoda.net/maths/bezier-length/index.html.
  length() {
    let t = 0, e, o;
    for (let r = 0; r <= 10; r += 1) {
      const d = r / 10, s = this.point(
        d,
        this.startPoint.x,
        this.control1.x,
        this.control2.x,
        this.endPoint.x
      ), u = this.point(
        d,
        this.startPoint.y,
        this.control1.y,
        this.control2.y,
        this.endPoint.y
      );
      if (r > 0) {
        const f = s - e, _ = u - o;
        t += Math.sqrt(f * f + _ * _);
      }
      e = s, o = u;
    }
    return t;
  }
  // Calculate parametric value of x or y given t and the four point coordinates of a cubic bezier curve.
  point(a, t, e, o, r) {
    return t * (1 - a) * (1 - a) * (1 - a) + 3 * e * (1 - a) * (1 - a) * a + 3 * o * (1 - a) * a * a + r * a * a * a;
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
  addEventListener(c, a, t) {
    this._et.addEventListener(c, a, t);
  }
  dispatchEvent(c) {
    return this._et.dispatchEvent(c);
  }
  removeEventListener(c, a, t) {
    this._et.removeEventListener(c, a, t);
  }
};
function Tt(c, a = 250) {
  let t = 0, e = null, o, r, d;
  const s = () => {
    t = Date.now(), e = null, o = c.apply(r, d), e || (r = null, d = []);
  };
  return function(...f) {
    const _ = Date.now(), p = a - (_ - t);
    return r = this, d = f, p <= 0 || p > a ? (e && (clearTimeout(e), e = null), t = _, o = c.apply(r, d), e || (r = null, d = [])) : e || (e = window.setTimeout(s, p)), o;
  };
}
var Lt = class G extends Ct {
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
    this.canvas = t, this.velocityFilterWeight = e.velocityFilterWeight || 0.7, this.minWidth = e.minWidth || 0.5, this.maxWidth = e.maxWidth || 2.5, this.throttle = e.throttle ?? 16, this.minDistance = e.minDistance ?? 5, this.dotSize = e.dotSize || 0, this.penColor = e.penColor || "black", this.backgroundColor = e.backgroundColor || "rgba(0,0,0,0)", this.compositeOperation = e.compositeOperation || "source-over", this.canvasContextOptions = e.canvasContextOptions ?? {}, this._strokeMoveUpdate = this.throttle ? Tt(G.prototype._strokeUpdate, this.throttle) : G.prototype._strokeUpdate, this._handleMouseDown = this._handleMouseDown.bind(this), this._handleMouseMove = this._handleMouseMove.bind(this), this._handleMouseUp = this._handleMouseUp.bind(this), this._handleTouchStart = this._handleTouchStart.bind(this), this._handleTouchMove = this._handleTouchMove.bind(this), this._handleTouchEnd = this._handleTouchEnd.bind(this), this._handlePointerDown = this._handlePointerDown.bind(this), this._handlePointerMove = this._handlePointerMove.bind(this), this._handlePointerUp = this._handlePointerUp.bind(this), this._ctx = t.getContext(
      "2d",
      this.canvasContextOptions
    ), this.clear(), this.on();
  }
  clear() {
    const { _ctx: t, canvas: e } = this;
    t.fillStyle = this.backgroundColor, t.clearRect(0, 0, e.width, e.height), t.fillRect(0, 0, e.width, e.height), this._data = [], this._reset(this._getPointGroupOptions()), this._isEmpty = !0, this._dataUrl = void 0, this._dataUrlOptions = void 0, this._strokePointerId = void 0;
  }
  redraw() {
    const t = this._data, e = this._dataUrl, o = this._dataUrlOptions;
    this.clear(), e && this.fromDataURL(e, o), this.fromData(t, { clear: !1 });
  }
  fromDataURL(t, e = {}) {
    return new Promise((o, r) => {
      const d = new Image(), s = e.ratio || window.devicePixelRatio || 1, u = e.width || this.canvas.width / s, f = e.height || this.canvas.height / s, _ = e.xOffset || 0, p = e.yOffset || 0;
      this._reset(this._getPointGroupOptions()), d.onload = () => {
        this._ctx.drawImage(d, _, p, u, f), o();
      }, d.onerror = (P) => {
        r(P);
      }, d.crossOrigin = "anonymous", d.src = t, this._isEmpty = !1, this._dataUrl = t, this._dataUrlOptions = { ...e };
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
    const { addEventListener: o } = this._getListenerFunctions();
    switch (t.event.type) {
      case "mousedown":
        o("mousemove", this._handleMouseMove, {
          passive: !1
        }), o("mouseup", this._handleMouseUp, { passive: !1 });
        break;
      case "touchstart":
        o("touchmove", this._handleTouchMove, {
          passive: !1
        }), o("touchend", this._handleTouchEnd, { passive: !1 });
        break;
      case "pointerdown":
        o("pointermove", this._handlePointerMove, {
          passive: !1
        }), o("pointerup", this._handlePointerUp, {
          passive: !1
        });
        break;
    }
    this._drawingStroke = !0;
    const r = this._getPointGroupOptions(), d = {
      ...r,
      points: []
    };
    this._data.push(d), this._reset(r), this._strokeUpdate(t);
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
    const e = this._createPoint(t.x, t.y, t.pressure), o = this._data[this._data.length - 1], r = o.points, d = r.length > 0 && r[r.length - 1], s = d ? e.distanceTo(d) <= this.minDistance : !1, u = this._getPointGroupOptions(o);
    if (!d || !(d && s)) {
      const f = this._addPoint(e, u);
      d ? f && this._drawCurve(f, u) : this._drawDot(e, u), r.push({
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
  _createPoint(t, e, o) {
    const r = this.canvas.getBoundingClientRect();
    return new N(
      t - r.left,
      e - r.top,
      o,
      (/* @__PURE__ */ new Date()).getTime()
    );
  }
  // Add point to _lastPoints array and generate a new curve if there are enough points (i.e. 3)
  _addPoint(t, e) {
    const { _lastPoints: o } = this;
    if (o.push(t), o.length > 2) {
      o.length === 3 && o.unshift(o[0]);
      const r = this._calculateCurveWidths(
        o[1],
        o[2],
        e
      ), d = Mt.fromPoints(o, r);
      return o.shift(), d;
    }
    return null;
  }
  _calculateCurveWidths(t, e, o) {
    const r = o.velocityFilterWeight * e.velocityFrom(t) + (1 - o.velocityFilterWeight) * this._lastVelocity, d = this._strokeWidth(r, o), s = {
      end: d,
      start: this._lastWidth
    };
    return this._lastVelocity = r, this._lastWidth = d, s;
  }
  _strokeWidth(t, e) {
    return Math.max(e.maxWidth / (t + 1), e.minWidth);
  }
  _drawCurveSegment(t, e, o) {
    const r = this._ctx;
    r.moveTo(t, e), r.arc(t, e, o, 0, 2 * Math.PI, !1), this._isEmpty = !1;
  }
  _drawCurve(t, e) {
    const o = this._ctx, r = t.endWidth - t.startWidth, d = Math.ceil(t.length()) * 2;
    o.beginPath(), o.fillStyle = e.penColor;
    for (let s = 0; s < d; s += 1) {
      const u = s / d, f = u * u, _ = f * u, p = 1 - u, P = p * p, T = P * p;
      let y = T * t.startPoint.x;
      y += 3 * P * u * t.control1.x, y += 3 * p * f * t.control2.x, y += _ * t.endPoint.x;
      let U = T * t.startPoint.y;
      U += 3 * P * u * t.control1.y, U += 3 * p * f * t.control2.y, U += _ * t.endPoint.y;
      const v = Math.min(
        t.startWidth + _ * r,
        e.maxWidth
      );
      this._drawCurveSegment(y, U, v);
    }
    o.closePath(), o.fill();
  }
  _drawDot(t, e) {
    const o = this._ctx, r = e.dotSize > 0 ? e.dotSize : (e.minWidth + e.maxWidth) / 2;
    o.beginPath(), this._drawCurveSegment(t.x, t.y, r), o.closePath(), o.fillStyle = e.penColor, o.fill();
  }
  _fromData(t, e, o) {
    for (const r of t) {
      const { points: d } = r, s = this._getPointGroupOptions(r);
      if (d.length > 1)
        for (let u = 0; u < d.length; u += 1) {
          const f = d[u], _ = new N(
            f.x,
            f.y,
            f.pressure,
            f.time
          );
          u === 0 && this._reset(s);
          const p = this._addPoint(_, s);
          p && e(p, s);
        }
      else
        this._reset(s), o(d[0], s);
    }
  }
  toSVG({ includeBackgroundColor: t = !1, includeDataUrl: e = !1 } = {}) {
    var p, P, T, y, U;
    const o = this._data, r = Math.max(window.devicePixelRatio || 1, 1), d = 0, s = 0, u = this.canvas.width / r, f = this.canvas.height / r, _ = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if (_.setAttribute("xmlns", "http://www.w3.org/2000/svg"), _.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), _.setAttribute("viewBox", `${d} ${s} ${u} ${f}`), _.setAttribute("width", u.toString()), _.setAttribute("height", f.toString()), t && this.backgroundColor) {
      const v = document.createElement("rect");
      v.setAttribute("width", "100%"), v.setAttribute("height", "100%"), v.setAttribute("fill", this.backgroundColor), _.appendChild(v);
    }
    if (e && this._dataUrl) {
      const v = ((p = this._dataUrlOptions) == null ? void 0 : p.ratio) || window.devicePixelRatio || 1, M = ((P = this._dataUrlOptions) == null ? void 0 : P.width) || this.canvas.width / v, E = ((T = this._dataUrlOptions) == null ? void 0 : T.height) || this.canvas.height / v, L = ((y = this._dataUrlOptions) == null ? void 0 : y.xOffset) || 0, W = ((U = this._dataUrlOptions) == null ? void 0 : U.yOffset) || 0, w = document.createElement("image");
      w.setAttribute("x", L.toString()), w.setAttribute("y", W.toString()), w.setAttribute("width", M.toString()), w.setAttribute("height", E.toString()), w.setAttribute("preserveAspectRatio", "none"), w.setAttribute("href", this._dataUrl), _.appendChild(w);
    }
    return this._fromData(
      o,
      (v, { penColor: M }) => {
        const E = document.createElement("path");
        if (!isNaN(v.control1.x) && !isNaN(v.control1.y) && !isNaN(v.control2.x) && !isNaN(v.control2.y)) {
          const L = `M ${v.startPoint.x.toFixed(3)},${v.startPoint.y.toFixed(
            3
          )} C ${v.control1.x.toFixed(3)},${v.control1.y.toFixed(3)} ${v.control2.x.toFixed(3)},${v.control2.y.toFixed(3)} ${v.endPoint.x.toFixed(3)},${v.endPoint.y.toFixed(3)}`;
          E.setAttribute("d", L), E.setAttribute("stroke-width", (v.endWidth * 2.25).toFixed(3)), E.setAttribute("stroke", M), E.setAttribute("fill", "none"), E.setAttribute("stroke-linecap", "round"), _.appendChild(E);
        }
      },
      (v, { penColor: M, dotSize: E, minWidth: L, maxWidth: W }) => {
        const w = document.createElement("circle"), I = E > 0 ? E : (L + W) / 2;
        w.setAttribute("r", I.toString()), w.setAttribute("cx", v.x.toString()), w.setAttribute("cy", v.y.toString()), w.setAttribute("fill", M), _.appendChild(w);
      }
    ), _.outerHTML;
  }
};
const Ot = ["aria-disabled"], Wt = {
  name: "Vue3Signature"
}, Rt = /* @__PURE__ */ gt({
  ...Wt,
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
  setup(c, { expose: a, emit: t }) {
    const e = c, o = {
      width: "100%",
      height: "100%"
    }, r = mt(null), d = `canvas-${Math.random().toString(36).slice(2, 9)}`, s = pt(null), u = wt({
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
      return i.width = 1, i.height = 1, f = i.getContext("2d"), f;
    }, P = (i) => {
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
      const h = n.getImageData(0, 0, 1, 1).data, l = [h[0], h[1], h[2], h[3]];
      return _.set(i, l), l;
    }, T = (i, n) => {
      const h = i.getContext("2d");
      if (!h)
        return null;
      const { width: l, height: g } = i;
      if (l === 0 || g === 0)
        return null;
      const x = h.getImageData(0, 0, l, g).data, D = P(n);
      let S = g, C = l, R = -1, A = -1;
      const $ = (k) => D ? x[k] === D[0] && x[k + 1] === D[1] && x[k + 2] === D[2] && x[k + 3] === D[3] : x[k + 3] === 0;
      for (let k = 0; k < g; k += 1)
        for (let O = 0; O < l; O += 1) {
          const ft = (k * l + O) * 4;
          $(ft) || (O < C && (C = O), O > R && (R = O), k < S && (S = k), k > A && (A = k));
        }
      if (R === -1 || A === -1)
        return null;
      const X = R - C + 1, Y = A - S + 1;
      return X <= 0 || Y <= 0 ? null : {
        x: C,
        y: S,
        width: X,
        height: Y
      };
    }, y = [], U = (i) => {
      i && Object.entries(i).forEach(([n, h]) => {
        h !== void 0 && (u[n] = h);
      });
    }, v = () => {
      var i;
      W(), (i = s.value) == null || i.off(), s.value = null;
    }, M = (i) => {
      let n, h = [];
      const l = !i.isEmpty();
      try {
        h = i.toData();
      } catch (g) {
        console.warn("[vue3-signature] Failed to read signature data", g);
      }
      if (l)
        try {
          n = i.toDataURL();
        } catch (g) {
          console.warn("[vue3-signature] Failed to capture dataURL", g);
        }
      return {
        hasSignature: l,
        strokes: h,
        dataUrl: n
      };
    }, E = (i) => {
      var n;
      if (!(!i || !s.value || !i.hasSignature)) {
        if ((n = i.strokes) != null && n.length) {
          s.value.fromData(i.strokes);
          return;
        }
        i.dataUrl && s.value.fromDataURL(i.dataUrl).catch(() => {
        });
      }
    }, L = () => {
      if (!s.value) return;
      W(), Object.entries({
        beginStroke: (n) => t("beginStroke", n),
        endStroke: (n) => t("endStroke", n),
        beforeUpdateStroke: (n) => t("beforeUpdateStroke", n),
        afterUpdateStroke: (n) => t("afterUpdateStroke", n)
      }).forEach(([n, h]) => {
        var g;
        const l = (b) => {
          const x = b.detail;
          h(x);
        };
        (g = s.value) == null || g.addEventListener(n, l), y.push({ type: n, listener: l });
      }), s.value.onBegin = () => t("begin"), s.value.onEnd = () => t("end");
    };
    function W() {
      !s.value || !y.length || (y.forEach(({ type: i, listener: n }) => {
        var h;
        (h = s.value) == null || h.removeEventListener(i, n);
      }), y.length = 0);
    }
    const w = (i) => {
      s.value && (i ? s.value.off() : s.value.on());
    }, I = (i, n) => {
      if (/px$/i.test(i)) {
        const h = Number(i.replace(/px/gi, ""));
        return Number.isFinite(h) ? h : n;
      }
      return n;
    }, B = () => {
      const i = r.value, n = s.value;
      if (!i || !n) return;
      let h;
      !e.clearOnResize && !n.isEmpty() && (h = M(n));
      const l = Math.max(window.devicePixelRatio || 1, 1), g = i.parentElement, b = (g == null ? void 0 : g.clientWidth) ?? i.offsetWidth, x = (g == null ? void 0 : g.clientHeight) ?? i.offsetHeight, D = I(e.w, b), S = I(e.h, x);
      i.width = D * l, i.height = S * l;
      const C = i.getContext("2d");
      C == null || C.scale(l, l), n.clear(), h ? E(h) : Object.keys(e.waterMark).length && z(e.waterMark);
    }, j = (i) => {
      !i || !s.value || s.value.fromDataURL(i).catch(() => {
      });
    }, K = (i) => {
      var n;
      return i ?? ((n = s.value) == null ? void 0 : n.backgroundColor) ?? u.backgroundColor ?? "rgba(0,0,0,0)";
    }, V = (i) => {
      const n = r.value, h = s.value;
      if (!n || !h || h.isEmpty())
        return null;
      const l = T(n, K(i == null ? void 0 : i.backgroundColor));
      if (!l)
        return null;
      const g = n.getContext("2d");
      if (!g)
        return null;
      const b = document.createElement("canvas");
      b.width = l.width, b.height = l.height;
      const x = b.getContext("2d");
      if (!x)
        return null;
      const D = g.getImageData(l.x, l.y, l.width, l.height);
      x.putImageData(D, 0, 0);
      let S;
      return i != null && i.format ? S = b.toDataURL(i.format, i.encoderOptions) : S = b.toDataURL(), {
        canvas: b,
        dataUrl: S,
        bounds: l
      };
    }, Q = (i, n) => {
      var h;
      return ((h = V({ format: i, encoderOptions: n })) == null ? void 0 : h.dataUrl) ?? "";
    }, z = (i) => {
      if (Object.prototype.toString.call(i) !== "[object Object]")
        throw new Error("Expected Object, got " + typeof i + ".");
      const n = r.value, h = s.value;
      if (!n || !h) return;
      const l = n.getContext("2d");
      if (!l) return;
      const {
        text: g = "",
        x: b = 20,
        y: x = 20,
        sx: D = 40,
        sy: S = 40,
        font: C = "20px sans-serif",
        fillStyle: R = "#333",
        strokeStyle: A = "#333",
        style: $ = "fill"
      } = i;
      l.save(), l.font = C, l.fillStyle = R, l.strokeStyle = A, $ === "all" ? (l.fillText(g, b, x), l.strokeText(g, D, S)) : $ === "stroke" ? l.strokeText(g, D, S) : l.fillText(g, b, x), l.restore(), h._isEmpty = !1;
    }, H = async (i = !1) => {
      const n = r.value;
      if (!n) return;
      const h = i && s.value ? M(s.value) : void 0;
      v(), s.value = new Lt(n, { ...u }), L(), w(e.disabled), await Dt(), B(), h ? E(h) : e.defaultUrl ? j(e.defaultUrl) : Object.keys(e.waterMark).length && z(e.waterMark), t("ready", s.value);
    }, Z = () => {
      var i;
      return (i = s.value) == null ? void 0 : i.clear();
    }, tt = () => {
      var i;
      return (i = s.value) == null ? void 0 : i.redraw();
    }, q = (i, n) => s.value ? s.value.toDataURL(i, n) : "", et = (i) => {
      var n;
      return ((n = s.value) == null ? void 0 : n.toSVG(i)) ?? "";
    }, it = q, nt = (i, n) => {
      var h;
      return (h = s.value) == null ? void 0 : h.fromDataURL(i, n);
    }, st = (i, n) => {
      var h;
      return (h = s.value) == null ? void 0 : h.fromData(i, n);
    }, ot = () => {
      var i;
      return ((i = s.value) == null ? void 0 : i.toData()) ?? [];
    }, at = () => {
      var i;
      return ((i = s.value) == null ? void 0 : i.isEmpty()) ?? !0;
    }, rt = () => {
      var i;
      return (i = s.value) == null ? void 0 : i.on();
    }, ht = () => {
      var i;
      return (i = s.value) == null ? void 0 : i.off();
    }, lt = (i, n, h) => {
      var l;
      return (l = s.value) == null ? void 0 : l.addEventListener(i, n, h);
    }, ct = (i, n, h) => {
      var l;
      return (l = s.value) == null ? void 0 : l.removeEventListener(i, n, h);
    }, dt = (i = 1) => {
      const n = s.value;
      if (!n || i <= 0) return;
      const h = n.toData();
      h.length && (h.splice(Math.max(h.length - i, 0), i), n.fromData(h));
    }, ut = () => s.value;
    return F(
      () => e.sigOption,
      (i) => {
        U(i), H(!0);
      },
      { deep: !0 }
    ), F(
      () => e.disabled,
      (i) => w(i),
      { immediate: !0 }
    ), F(
      () => e.defaultUrl,
      (i) => j(i)
    ), F(
      () => [e.w, e.h],
      () => B()
    ), F(
      () => e.waterMark,
      (i) => {
        i && Object.keys(i).length && z(i);
      },
      { deep: !0 }
    ), yt(() => {
      H(), window.addEventListener("resize", B);
    }), xt(() => {
      window.removeEventListener("resize", B), v();
    }), a({
      clear: Z,
      save: it,
      toDataURL: q,
      toTrimmedDataURL: Q,
      toSVG: et,
      fromDataURL: nt,
      fromData: st,
      toData: ot,
      redraw: tt,
      isEmpty: at,
      undo: dt,
      addWaterMark: z,
      trim: V,
      enable: rt,
      disable: ht,
      addEventListener: lt,
      removeEventListener: ct,
      getInstance: ut
    }), (i, n) => (bt(), Et("div", {
      class: "vue3-signature",
      style: kt({ width: c.w, height: c.h }),
      onTouchmove: n[0] || (n[0] = St(() => {
      }, ["prevent"]))
    }, [
      Pt("canvas", {
        ref_key: "canvasRef",
        ref: r,
        class: Ut(["vue3-signature__canvas", { "vue3-signature__canvas--disabled": c.disabled }]),
        "data-uid": d,
        "aria-disabled": c.disabled ? "true" : void 0,
        style: o
      }, null, 10, Ot)
    ], 36));
  }
}), At = (c, a) => {
  const t = c.__vccOpts || c;
  for (const [e, o] of a)
    t[e] = o;
  return t;
}, Ft = /* @__PURE__ */ At(Rt, [["__scopeId", "data-v-c64bdf13"]]);
function It(c) {
  return c.install = (a) => {
    a.component(c.name, c);
  }, c;
}
const $t = It(Ft);
export {
  $t as default
};
