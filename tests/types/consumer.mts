import Vue3Signature, { type TrimOptions, type TrimResult } from "vue3-signature";

declare const signature: InstanceType<typeof Vue3Signature>;
const options: TrimOptions = { format: "image/png", backgroundColor: "white" };
const result: TrimResult | null = signature.trim(options);
const dataUrl: string = signature.toTrimmedDataURL("image/png");
signature.fromDataURL("data:image/png;base64,...");
signature.addEventListener("beginStroke", (event) => event.preventDefault());
void result;
void dataUrl;
