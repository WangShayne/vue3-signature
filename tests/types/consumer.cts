import Vue3Signature = require("vue3-signature");
import type { TrimOptions, TrimResult } from "vue3-signature";

declare const signature: InstanceType<typeof Vue3Signature>;
const options: TrimOptions = { format: "image/png" };
const result: TrimResult | null = signature.trim(options);
void result;
