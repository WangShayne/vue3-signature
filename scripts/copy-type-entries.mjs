import { copyFile } from "node:fs/promises";

await Promise.all(["mts", "cts"].map((extension) => copyFile(
  new URL(`../lib/entry.d.${extension}`, import.meta.url),
  new URL(`../types/index.d.${extension}`, import.meta.url),
)));
