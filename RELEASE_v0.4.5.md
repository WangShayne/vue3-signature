# v0.4.5

Fixes signature trimming warnings and restores the legacy stroke events used by existing applications.

- Fix #33: read pixels once from a dedicated off-screen canvas created with `willReadFrequently: true`. The color parser uses the same hint. Cropping preserves the original pixels without changing the visible canvas or the caller's context options.
- Restore `begin` / `end` compatibility events by forwarding the current `signature_pad` stroke events. Recipes that trim or save in `@end` work again.
- Avoid encoding an unused PNG when vector strokes can be restored directly during resize or option changes.
- Provide separate ESM and CommonJS type entries, with `types` before each runtime condition, so NodeNext and bundler projects resolve the component's default export correctly.
- Use the application's peer Vue installation and remove the unused `default-passive-events` dependency and demo patch.
- Update the build and test dependencies, use one npm lockfile, and run component tests and library builds before packaging and Pages deployment.

Validation covers real Vue and `signature_pad` instances, mouse and pointer input, disabled toggles, cancelable strokes, event aliases, repeated cropping, transparent and colored backgrounds, exact cropped pixels, high-DPI bounds, resize preservation, clear-on-resize, undo, and option changes. Pixel tests use a native canvas renderer with jsdom DOM events.

Issue #32's original disabled-cursor regression has a regression check. The later report of an application that cannot draw remains open because it lacks a reproducible example; this release does not claim to resolve that unverified case.

Automated validation: `npm test`, `npm run build`, `npm run test:types`, `npm run build:demo`, `npm audit`, and package-consumer checks. Interactive browser validation is unavailable in this environment: local navigation returns `ERR_BLOCKED_BY_CLIENT`.
