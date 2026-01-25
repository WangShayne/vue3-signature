var _t = Object.defineProperty;
var gt = (d, r, t) => r in d ? _t(d, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : d[r] = t;
var m = (d, r, t) => gt(d, typeof r != "symbol" ? r + "" : r, t);
import { defineComponent as mt, ref as pt, shallowRef as wt, reactive as yt, watch as I, onMounted as xt, onBeforeUnmount as Et, openBlock as bt, createElementBlock as St, withModifiers as kt, normalizeStyle as Pt, createElementVNode as Ct, normalizeClass as Ut, nextTick as Dt } from "vue";
/*!
 * Signature Pad v5.1.3 | https://github.com/szimek/signature_pad
 * (c) 2025 Szymon Nowak | Released under the MIT license
 */
var N = class {
  constructor(d, r, t, i) {
    m(this, "x");
    m(this, "y");
    m(this, "pressure");
    m(this, "time");
    if (isNaN(d) || isNaN(r))
      throw new Error(`Point is invalid: (${d}, ${r})`);
    this.x = +d, this.y = +r, this.pressure = t || 0, this.time = i || Date.now();
  }
  distanceTo(d) {
    return Math.sqrt(
      Math.pow(this.x - d.x, 2) + Math.pow(this.y - d.y, 2)
    );
  }
  equals(d) {
    return this.x === d.x && this.y === d.y && this.pressure === d.pressure && this.time === d.time;
  }
  velocityFrom(d) {
    return this.time !== d.time ? this.distanceTo(d) / (this.time - d.time) : 0;
  }
}, Mt = class K {
  constructor(r, t, i, n, a, l) {
    this.startPoint = r, this.control2 = t, this.control1 = i, this.endPoint = n, this.startWidth = a, this.endWidth = l;
  }
  static fromPoints(r, t) {
    const i = this.calculateControlPoints(r[0], r[1], r[2]).c2, n = this.calculateControlPoints(r[1], r[2], r[3]).c1;
    return new K(r[1], i, n, r[2], t.start, t.end);
  }
  static calculateControlPoints(r, t, i) {
    const n = r.x - t.x, a = r.y - t.y, l = t.x - i.x, _ = t.y - i.y, o = { x: (r.x + t.x) / 2, y: (r.y + t.y) / 2 }, u = { x: (t.x + i.x) / 2, y: (t.y + i.y) / 2 }, f = Math.sqrt(n * n + a * a), p = Math.sqrt(l * l + _ * _), P = o.x - u.x, T = o.y - u.y, C = f + p == 0 ? 0 : p / (f + p), y = { x: u.x + P * C, y: u.y + T * C }, v = t.x - y.x, D = t.y - y.y;
    return {
      c1: new N(o.x + v, o.y + D),
      c2: new N(u.x + v, u.y + D)
    };
  }
  // Returns approximated length. Code taken from https://www.lemoda.net/maths/bezier-length/index.html.
  length() {
    let t = 0, i, n;
    for (let a = 0; a <= 10; a += 1) {
      const l = a / 10, _ = this.point(
        l,
        this.startPoint.x,
        this.control1.x,
        this.control2.x,
        this.endPoint.x
      ), o = this.point(
        l,
        this.startPoint.y,
        this.control1.y,
        this.control2.y,
        this.endPoint.y
      );
      if (a > 0) {
        const u = _ - i, f = o - n;
        t += Math.sqrt(u * u + f * f);
      }
      i = _, n = o;
    }
    return t;
  }
  // Calculate parametric value of x or y given t and the four point coordinates of a cubic bezier curve.
  point(r, t, i, n, a) {
    return t * (1 - r) * (1 - r) * (1 - r) + 3 * i * (1 - r) * (1 - r) * r + 3 * n * (1 - r) * r * r + a * r * r * r;
  }
}, Tt = class {
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
  addEventListener(d, r, t) {
    this._et.addEventListener(d, r, t);
  }
  dispatchEvent(d) {
    return this._et.dispatchEvent(d);
  }
  removeEventListener(d, r, t) {
    this._et.removeEventListener(d, r, t);
  }
};
function Lt(d, r = 250) {
  let t = 0, i = null, n, a, l;
  const _ = () => {
    t = Date.now(), i = null, n = d.apply(a, l), i || (a = null, l = []);
  };
  return function(...u) {
    const f = Date.now(), p = r - (f - t);
    return a = this, l = u, p <= 0 || p > r ? (i && (clearTimeout(i), i = null), t = f, n = d.apply(a, l), i || (a = null, l = [])) : i || (i = window.setTimeout(_, p)), n;
  };
}
var Ot = class G extends Tt {
  /* tslint:enable: variable-name */
  constructor(t, i = {}) {
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
    this.canvas = t, this.velocityFilterWeight = i.velocityFilterWeight || 0.7, this.minWidth = i.minWidth || 0.5, this.maxWidth = i.maxWidth || 2.5, this.throttle = i.throttle ?? 16, this.minDistance = i.minDistance ?? 5, this.dotSize = i.dotSize || 0, this.penColor = i.penColor || "black", this.backgroundColor = i.backgroundColor || "rgba(0,0,0,0)", this.compositeOperation = i.compositeOperation || "source-over", this.canvasContextOptions = i.canvasContextOptions ?? {}, this._strokeMoveUpdate = this.throttle ? Lt(G.prototype._strokeUpdate, this.throttle) : G.prototype._strokeUpdate, this._handleMouseDown = this._handleMouseDown.bind(this), this._handleMouseMove = this._handleMouseMove.bind(this), this._handleMouseUp = this._handleMouseUp.bind(this), this._handleTouchStart = this._handleTouchStart.bind(this), this._handleTouchMove = this._handleTouchMove.bind(this), this._handleTouchEnd = this._handleTouchEnd.bind(this), this._handlePointerDown = this._handlePointerDown.bind(this), this._handlePointerMove = this._handlePointerMove.bind(this), this._handlePointerUp = this._handlePointerUp.bind(this), this._handlePointerCancel = this._handlePointerCancel.bind(this), this._handleTouchCancel = this._handleTouchCancel.bind(this), this._ctx = t.getContext(
      "2d",
      this.canvasContextOptions
    ), this.clear(), this.on();
  }
  clear() {
    const { _ctx: t, canvas: i } = this;
    t.fillStyle = this.backgroundColor, t.clearRect(0, 0, i.width, i.height), t.fillRect(0, 0, i.width, i.height), this._data = [], this._reset(this._getPointGroupOptions()), this._isEmpty = !0, this._dataUrl = void 0, this._dataUrlOptions = void 0, this._strokePointerId = void 0;
  }
  redraw() {
    const t = this._data, i = this._dataUrl, n = this._dataUrlOptions;
    this.clear(), i && this.fromDataURL(i, n), this.fromData(t, { clear: !1 });
  }
  fromDataURL(t, i = {}) {
    return new Promise((n, a) => {
      const l = new Image(), _ = i.ratio || window.devicePixelRatio || 1, o = i.width || this.canvas.width / _, u = i.height || this.canvas.height / _, f = i.xOffset || 0, p = i.yOffset || 0;
      this._reset(this._getPointGroupOptions()), l.onload = () => {
        this._ctx.drawImage(l, f, p, o, u), n();
      }, l.onerror = (P) => {
        a(P);
      }, l.crossOrigin = "anonymous", l.src = t, this._isEmpty = !1, this._dataUrl = t, this._dataUrlOptions = { ...i };
    });
  }
  toDataURL(t = "image/png", i) {
    switch (t) {
      case "image/svg+xml":
        return typeof i != "object" && (i = void 0), `data:image/svg+xml;base64,${btoa(
          this.toSVG(i)
        )}`;
      default:
        return typeof i != "number" && (i = void 0), this.canvas.toDataURL(t, i);
    }
  }
  on() {
    this.canvas.style.touchAction = "none", this.canvas.style.msTouchAction = "none", this.canvas.style.userSelect = "none", this.canvas.style.webkitUserSelect = "none";
    const t = /Macintosh/.test(navigator.userAgent) && "ontouchstart" in document;
    window.PointerEvent && !t ? this._handlePointerEvents() : (this._handleMouseEvents(), "ontouchstart" in window && this._handleTouchEvents());
  }
  off() {
    this.canvas.style.touchAction = "auto", this.canvas.style.msTouchAction = "auto", this.canvas.style.userSelect = "auto", this.canvas.style.webkitUserSelect = "auto", this.canvas.removeEventListener("pointerdown", this._handlePointerDown), this.canvas.removeEventListener("mousedown", this._handleMouseDown), this.canvas.removeEventListener("touchstart", this._handleTouchStart), this._removeMoveUpEventListeners();
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
    t("pointermove", this._handlePointerMove), t("pointerup", this._handlePointerUp), t("pointercancel", this._handlePointerCancel), t("mousemove", this._handleMouseMove), t("mouseup", this._handleMouseUp), t("touchmove", this._handleTouchMove), t("touchend", this._handleTouchEnd), t("touchcancel", this._handleTouchCancel);
  }
  isEmpty() {
    return this._isEmpty;
  }
  fromData(t, { clear: i = !0 } = {}) {
    i && this.clear(), this._fromData(
      t,
      this._drawCurve.bind(this),
      this._drawDot.bind(this)
    ), this._data = this._data.concat(t);
  }
  toData() {
    return this._data;
  }
  _isLeftButtonPressed(t, i) {
    return i ? t.buttons === 1 : (t.buttons & 1) === 1;
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
    const i = t.changedTouches[0];
    return {
      event: t,
      type: t.type,
      x: i.clientX,
      y: i.clientY,
      pressure: i.force
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
  _handlePointerCancel(t) {
    this._allowPointerId(t) && (t.preventDefault(), this._strokeEnd(this._pointerEventToSignatureEvent(t), !1));
  }
  _handleTouchCancel(t) {
    t.cancelable && t.preventDefault(), this._strokeEnd(this._touchEventToSignatureEvent(t), !1);
  }
  _getPointerId(t) {
    return t.persistentDeviceId || t.pointerId;
  }
  _allowPointerId(t, i = !1) {
    return typeof this._strokePointerId > "u" ? i : this._getPointerId(t) === this._strokePointerId;
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
    const { addEventListener: n } = this._getListenerFunctions();
    switch (t.event.type) {
      case "mousedown":
        n("mousemove", this._handleMouseMove, {
          passive: !1
        }), n("mouseup", this._handleMouseUp, { passive: !1 });
        break;
      case "touchstart":
        n("touchmove", this._handleTouchMove, {
          passive: !1
        }), n("touchend", this._handleTouchEnd, { passive: !1 }), n("touchcancel", this._handleTouchCancel, { passive: !1 });
        break;
      case "pointerdown":
        n("pointermove", this._handlePointerMove, {
          passive: !1
        }), n("pointerup", this._handlePointerUp, {
          passive: !1
        }), n("pointercancel", this._handlePointerCancel, {
          passive: !1
        });
        break;
    }
    this._drawingStroke = !0;
    const a = this._getPointGroupOptions(), l = {
      ...a,
      points: []
    };
    this._data.push(l), this._reset(a), this._strokeUpdate(t);
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
    const i = this._createPoint(t.x, t.y, t.pressure), n = this._data[this._data.length - 1], a = n.points, l = a.length > 0 && a[a.length - 1], _ = l ? i.distanceTo(l) <= this.minDistance : !1, o = this._getPointGroupOptions(n);
    if (!l || !(l && _)) {
      const u = this._addPoint(i, o);
      l ? u && this._drawCurve(u, o) : this._drawDot(i, o), a.push({
        time: i.time,
        x: i.x,
        y: i.y,
        pressure: i.pressure
      });
    }
    this.dispatchEvent(new CustomEvent("afterUpdateStroke", { detail: t }));
  }
  _strokeEnd(t, i = !0) {
    this._removeMoveUpEventListeners(), this._drawingStroke && (i && this._strokeUpdate(t), this._drawingStroke = !1, this._strokePointerId = void 0, this.dispatchEvent(new CustomEvent("endStroke", { detail: t })));
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
  _createPoint(t, i, n) {
    const a = this.canvas.getBoundingClientRect();
    return new N(
      t - a.left,
      i - a.top,
      n,
      (/* @__PURE__ */ new Date()).getTime()
    );
  }
  // Add point to _lastPoints array and generate a new curve if there are enough points (i.e. 3)
  _addPoint(t, i) {
    const { _lastPoints: n } = this;
    if (n.push(t), n.length > 2) {
      n.length === 3 && n.unshift(n[0]);
      const a = this._calculateCurveWidths(
        n[1],
        n[2],
        i
      ), l = Mt.fromPoints(n, a);
      return n.shift(), l;
    }
    return null;
  }
  _calculateCurveWidths(t, i, n) {
    const a = n.velocityFilterWeight * i.velocityFrom(t) + (1 - n.velocityFilterWeight) * this._lastVelocity, l = this._strokeWidth(a, n), _ = {
      end: l,
      start: this._lastWidth
    };
    return this._lastVelocity = a, this._lastWidth = l, _;
  }
  _strokeWidth(t, i) {
    return Math.max(i.maxWidth / (t + 1), i.minWidth);
  }
  _drawCurveSegment(t, i, n) {
    const a = this._ctx;
    a.moveTo(t, i), a.arc(t, i, n, 0, 2 * Math.PI, !1), this._isEmpty = !1;
  }
  _drawCurve(t, i) {
    const n = this._ctx, a = t.endWidth - t.startWidth, l = Math.ceil(t.length()) * 2;
    n.beginPath(), n.fillStyle = i.penColor;
    for (let _ = 0; _ < l; _ += 1) {
      const o = _ / l, u = o * o, f = u * o, p = 1 - o, P = p * p, T = P * p;
      let C = T * t.startPoint.x;
      C += 3 * P * o * t.control1.x, C += 3 * p * u * t.control2.x, C += f * t.endPoint.x;
      let y = T * t.startPoint.y;
      y += 3 * P * o * t.control1.y, y += 3 * p * u * t.control2.y, y += f * t.endPoint.y;
      const v = Math.min(
        t.startWidth + f * a,
        i.maxWidth
      );
      this._drawCurveSegment(C, y, v);
    }
    n.closePath(), n.fill();
  }
  _drawDot(t, i) {
    const n = this._ctx, a = i.dotSize > 0 ? i.dotSize : (i.minWidth + i.maxWidth) / 2;
    n.beginPath(), this._drawCurveSegment(t.x, t.y, a), n.closePath(), n.fillStyle = i.penColor, n.fill();
  }
  _fromData(t, i, n) {
    for (const a of t) {
      const { points: l } = a, _ = this._getPointGroupOptions(a);
      if (l.length > 1)
        for (let o = 0; o < l.length; o += 1) {
          const u = l[o], f = new N(
            u.x,
            u.y,
            u.pressure,
            u.time
          );
          o === 0 && this._reset(_);
          const p = this._addPoint(f, _);
          p && i(p, _);
        }
      else
        this._reset(_), n(l[0], _);
    }
  }
  toSVG({ includeBackgroundColor: t = !1, includeDataUrl: i = !1 } = {}) {
    var p, P, T, C, y;
    const n = this._data, a = Math.max(window.devicePixelRatio || 1, 1), l = 0, _ = 0, o = this.canvas.width / a, u = this.canvas.height / a, f = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if (f.setAttribute("xmlns", "http://www.w3.org/2000/svg"), f.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), f.setAttribute("viewBox", `${l} ${_} ${o} ${u}`), f.setAttribute("width", o.toString()), f.setAttribute("height", u.toString()), t && this.backgroundColor) {
      const v = document.createElement("rect");
      v.setAttribute("width", "100%"), v.setAttribute("height", "100%"), v.setAttribute("fill", this.backgroundColor), f.appendChild(v);
    }
    if (i && this._dataUrl) {
      const v = ((p = this._dataUrlOptions) == null ? void 0 : p.ratio) || window.devicePixelRatio || 1, D = ((P = this._dataUrlOptions) == null ? void 0 : P.width) || this.canvas.width / v, E = ((T = this._dataUrlOptions) == null ? void 0 : T.height) || this.canvas.height / v, L = ((C = this._dataUrlOptions) == null ? void 0 : C.xOffset) || 0, A = ((y = this._dataUrlOptions) == null ? void 0 : y.yOffset) || 0, w = document.createElement("image");
      w.setAttribute("x", L.toString()), w.setAttribute("y", A.toString()), w.setAttribute("width", D.toString()), w.setAttribute("height", E.toString()), w.setAttribute("preserveAspectRatio", "none"), w.setAttribute("href", this._dataUrl), f.appendChild(w);
    }
    return this._fromData(
      n,
      (v, { penColor: D }) => {
        const E = document.createElement("path");
        if (!isNaN(v.control1.x) && !isNaN(v.control1.y) && !isNaN(v.control2.x) && !isNaN(v.control2.y)) {
          const L = `M ${v.startPoint.x.toFixed(3)},${v.startPoint.y.toFixed(
            3
          )} C ${v.control1.x.toFixed(3)},${v.control1.y.toFixed(3)} ${v.control2.x.toFixed(3)},${v.control2.y.toFixed(3)} ${v.endPoint.x.toFixed(3)},${v.endPoint.y.toFixed(3)}`;
          E.setAttribute("d", L), E.setAttribute("stroke-width", (v.endWidth * 2.25).toFixed(3)), E.setAttribute("stroke", D), E.setAttribute("fill", "none"), E.setAttribute("stroke-linecap", "round"), f.appendChild(E);
        }
      },
      (v, { penColor: D, dotSize: E, minWidth: L, maxWidth: A }) => {
        const w = document.createElement("circle"), F = E > 0 ? E : (L + A) / 2;
        w.setAttribute("r", F.toString()), w.setAttribute("cx", v.x.toString()), w.setAttribute("cy", v.y.toString()), w.setAttribute("fill", D), f.appendChild(w);
      }
    ), f.outerHTML;
  }
};
const Wt = ["aria-disabled"], Rt = {
  name: "Vue3Signature"
}, At = /* @__PURE__ */ mt({
  ...Rt,
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
  setup(d, { expose: r, emit: t }) {
    const i = {
      width: "100%",
      height: "100%"
    }, n = t, a = d, l = pt(null), _ = `canvas-${Math.random().toString(36).slice(2, 9)}`, o = wt(null), u = yt({
      backgroundColor: "rgb(255,255,255)",
      penColor: "rgb(0, 0, 0)",
      minWidth: 0.5,
      maxWidth: 2.5,
      ...a.sigOption
    });
    let f = null;
    const p = /* @__PURE__ */ new Map(), P = () => {
      if (typeof document > "u")
        return null;
      if (f)
        return f;
      const e = document.createElement("canvas");
      return e.width = 1, e.height = 1, f = e.getContext("2d"), f;
    }, T = (e) => {
      if (!e)
        return null;
      if (p.has(e))
        return p.get(e);
      const s = P();
      if (!s)
        return null;
      s.clearRect(0, 0, 1, 1);
      try {
        s.fillStyle = e;
      } catch (g) {
        return console.warn(`[vue3-signature] Unable to parse color "${e}"`, g), null;
      }
      s.fillRect(0, 0, 1, 1);
      const h = s.getImageData(0, 0, 1, 1).data, c = [h[0], h[1], h[2], h[3]];
      return p.set(e, c), c;
    }, C = (e, s) => {
      const h = e.getContext("2d");
      if (!h)
        return null;
      const { width: c, height: g } = e;
      if (c === 0 || g === 0)
        return null;
      const x = h.getImageData(0, 0, c, g).data, U = T(s);
      let S = g, M = c, W = -1, R = -1;
      const $ = (k) => U ? x[k] === U[0] && x[k + 1] === U[1] && x[k + 2] === U[2] && x[k + 3] === U[3] : x[k + 3] === 0;
      for (let k = 0; k < g; k += 1)
        for (let O = 0; O < c; O += 1) {
          const vt = (k * c + O) * 4;
          $(vt) || (O < M && (M = O), O > W && (W = O), k < S && (S = k), k > R && (R = k));
        }
      if (W === -1 || R === -1)
        return null;
      const Y = W - M + 1, J = R - S + 1;
      return Y <= 0 || J <= 0 ? null : {
        x: M,
        y: S,
        width: Y,
        height: J
      };
    }, y = [], v = (e) => {
      e && Object.entries(e).forEach(([s, h]) => {
        h !== void 0 && (u[s] = h);
      });
    }, D = () => {
      var e;
      w(), (e = o.value) == null || e.off(), o.value = null;
    }, E = (e) => {
      let s, h = [];
      const c = !e.isEmpty();
      try {
        h = e.toData();
      } catch (g) {
        console.warn("[vue3-signature] Failed to read signature data", g);
      }
      if (c)
        try {
          s = e.toDataURL();
        } catch (g) {
          console.warn("[vue3-signature] Failed to capture dataURL", g);
        }
      return {
        hasSignature: c,
        strokes: h,
        dataUrl: s
      };
    }, L = (e) => {
      var s;
      if (!(!e || !o.value || !e.hasSignature)) {
        if ((s = e.strokes) != null && s.length) {
          o.value.fromData(e.strokes);
          return;
        }
        e.dataUrl && o.value.fromDataURL(e.dataUrl).catch(() => {
        });
      }
    }, A = () => {
      if (!o.value) return;
      w(), Object.entries({
        beginStroke: (s) => n("beginStroke", s),
        endStroke: (s) => n("endStroke", s),
        beforeUpdateStroke: (s) => n("beforeUpdateStroke", s),
        afterUpdateStroke: (s) => n("afterUpdateStroke", s)
      }).forEach(([s, h]) => {
        var g;
        const c = (b) => {
          const x = b.detail;
          h(x);
        };
        (g = o.value) == null || g.addEventListener(s, c), y.push({ type: s, listener: c });
      }), o.value.onBegin = () => n("begin"), o.value.onEnd = () => n("end");
    };
    function w() {
      !o.value || !y.length || (y.forEach(({ type: e, listener: s }) => {
        var h;
        (h = o.value) == null || h.removeEventListener(e, s);
      }), y.length = 0);
    }
    const F = (e) => {
      o.value && (e ? o.value.off() : o.value.on());
    }, j = (e, s) => {
      if (/px$/i.test(e)) {
        const h = Number(e.replace(/px/gi, ""));
        return Number.isFinite(h) ? h : s;
      }
      return s;
    }, B = () => {
      const e = l.value, s = o.value;
      if (!e || !s) return;
      let h;
      !a.clearOnResize && !s.isEmpty() && (h = E(s));
      const c = Math.max(window.devicePixelRatio || 1, 1), g = e.parentElement, b = (g == null ? void 0 : g.clientWidth) ?? e.offsetWidth, x = (g == null ? void 0 : g.clientHeight) ?? e.offsetHeight, U = j(a.w, b), S = j(a.h, x);
      e.width = U * c, e.height = S * c;
      const M = e.getContext("2d");
      M == null || M.scale(c, c), s.clear(), h ? L(h) : Object.keys(a.waterMark).length && z(a.waterMark);
    }, V = (e) => {
      !e || !o.value || o.value.fromDataURL(e).catch(() => {
      });
    }, Q = (e) => {
      var s;
      return e ?? ((s = o.value) == null ? void 0 : s.backgroundColor) ?? u.backgroundColor ?? "rgba(0,0,0,0)";
    }, H = (e) => {
      const s = l.value, h = o.value;
      if (!s || !h || h.isEmpty())
        return null;
      const c = C(s, Q(e == null ? void 0 : e.backgroundColor));
      if (!c)
        return null;
      const g = s.getContext("2d");
      if (!g)
        return null;
      const b = document.createElement("canvas");
      b.width = c.width, b.height = c.height;
      const x = b.getContext("2d");
      if (!x)
        return null;
      const U = g.getImageData(c.x, c.y, c.width, c.height);
      x.putImageData(U, 0, 0);
      let S;
      return e != null && e.format ? S = b.toDataURL(e.format, e.encoderOptions) : S = b.toDataURL(), {
        canvas: b,
        dataUrl: S,
        bounds: c
      };
    }, Z = (e, s) => {
      var h;
      return ((h = H({ format: e, encoderOptions: s })) == null ? void 0 : h.dataUrl) ?? "";
    }, z = (e) => {
      if (Object.prototype.toString.call(e) !== "[object Object]")
        throw new Error("Expected Object, got " + typeof e + ".");
      const s = l.value, h = o.value;
      if (!s || !h) return;
      const c = s.getContext("2d");
      if (!c) return;
      const {
        text: g = "",
        x: b = 20,
        y: x = 20,
        sx: U = 40,
        sy: S = 40,
        font: M = "20px sans-serif",
        fillStyle: W = "#333",
        strokeStyle: R = "#333",
        style: $ = "fill"
      } = e;
      c.save(), c.font = M, c.fillStyle = W, c.strokeStyle = R, $ === "all" ? (c.fillText(g, b, x), c.strokeText(g, U, S)) : $ === "stroke" ? c.strokeText(g, U, S) : c.fillText(g, b, x), c.restore(), h._isEmpty = !1;
    }, q = async (e = !1) => {
      const s = l.value;
      if (!s) return;
      const h = e && o.value ? E(o.value) : void 0;
      D(), o.value = new Ot(s, { ...u }), A(), F(a.disabled), await Dt(), B(), h ? L(h) : a.defaultUrl ? V(a.defaultUrl) : Object.keys(a.waterMark).length && z(a.waterMark), n("ready", o.value);
    }, tt = () => {
      var e;
      return (e = o.value) == null ? void 0 : e.clear();
    }, et = () => {
      var e;
      return (e = o.value) == null ? void 0 : e.redraw();
    }, X = (e, s) => o.value ? o.value.toDataURL(e, s) : "", it = (e) => {
      var s;
      return ((s = o.value) == null ? void 0 : s.toSVG(e)) ?? "";
    }, nt = X, st = (e, s) => {
      var h;
      return (h = o.value) == null ? void 0 : h.fromDataURL(e, s);
    }, ot = (e, s) => {
      var h;
      return (h = o.value) == null ? void 0 : h.fromData(e, s);
    }, at = () => {
      var e;
      return ((e = o.value) == null ? void 0 : e.toData()) ?? [];
    }, rt = () => {
      var e;
      return ((e = o.value) == null ? void 0 : e.isEmpty()) ?? !0;
    }, ht = () => {
      var e;
      return (e = o.value) == null ? void 0 : e.on();
    }, lt = () => {
      var e;
      return (e = o.value) == null ? void 0 : e.off();
    }, ct = (e, s, h) => {
      var c;
      return (c = o.value) == null ? void 0 : c.addEventListener(e, s, h);
    }, dt = (e, s, h) => {
      var c;
      return (c = o.value) == null ? void 0 : c.removeEventListener(e, s, h);
    }, ut = (e = 1) => {
      const s = o.value;
      if (!s || e <= 0) return;
      const h = s.toData();
      h.length && (h.splice(Math.max(h.length - e, 0), e), s.fromData(h));
    }, ft = () => o.value;
    return I(
      () => a.sigOption,
      (e) => {
        v(e), q(!0);
      },
      { deep: !0 }
    ), I(
      () => a.disabled,
      (e) => F(e),
      { immediate: !0 }
    ), I(
      () => a.defaultUrl,
      (e) => V(e)
    ), I(
      () => [a.w, a.h],
      () => B()
    ), I(
      () => a.waterMark,
      (e) => {
        e && Object.keys(e).length && z(e);
      },
      { deep: !0 }
    ), xt(() => {
      q(), window.addEventListener("resize", B);
    }), Et(() => {
      window.removeEventListener("resize", B), D();
    }), r({
      clear: tt,
      save: nt,
      toDataURL: X,
      toTrimmedDataURL: Z,
      toSVG: it,
      fromDataURL: st,
      fromData: ot,
      toData: at,
      redraw: et,
      isEmpty: rt,
      undo: ut,
      addWaterMark: z,
      trim: H,
      enable: ht,
      disable: lt,
      addEventListener: ct,
      removeEventListener: dt,
      getInstance: ft
    }), (e, s) => (bt(), St("div", {
      class: "vue3-signature",
      style: Pt({ width: d.w, height: d.h }),
      onTouchmove: s[0] || (s[0] = kt(() => {
      }, ["prevent"]))
    }, [
      Ct("canvas", {
        ref_key: "canvasRef",
        ref: l,
        class: Ut(["vue3-signature__canvas", { "vue3-signature__canvas--disabled": d.disabled }]),
        "data-uid": _,
        "aria-disabled": d.disabled ? "true" : void 0,
        style: i
      }, null, 10, Wt)
    ], 36));
  }
}), It = (d, r) => {
  const t = d.__vccOpts || d;
  for (const [i, n] of r)
    t[i] = n;
  return t;
}, Ft = /* @__PURE__ */ It(At, [["__scopeId", "data-v-66fe26ed"]]);
function Bt(d) {
  return d.install = (r) => {
    r.component(d.name, d);
  }, d;
}
const Nt = Bt(Ft);
export {
  Nt as default
};
