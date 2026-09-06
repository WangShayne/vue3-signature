declare const component: typeof import("./index.js").default;
declare namespace component {
  type TrimOptions = import("./types.js").TrimOptions;
  type TrimResult = import("./types.js").TrimResult;
}
export = component;
