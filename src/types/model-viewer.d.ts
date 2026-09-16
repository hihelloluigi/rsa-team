import type { ModelViewerElement } from "@google/model-viewer";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

// <model-viewer> is a web component, so React knows nothing about its
// attributes. Only the ones ShirtViewer uses are declared; add to this list
// rather than reaching for `any` at the call site.
type ModelViewerAttributes = DetailedHTMLProps<
  HTMLAttributes<ModelViewerElement>,
  ModelViewerElement
> & {
  src?: string;
  alt?: string;
  loading?: "auto" | "lazy" | "eager";
  "camera-controls"?: boolean;
  "auto-rotate"?: boolean;
  "rotation-per-second"?: string;
  "camera-orbit"?: string;
  "min-camera-orbit"?: string;
  "max-camera-orbit"?: string;
  "field-of-view"?: string;
  "interpolation-decay"?: string;
  "shadow-intensity"?: string;
  exposure?: string;
  "interaction-prompt"?: "auto" | "none";
  "touch-action"?: "pan-y" | "pan-x" | "none";
  "disable-pan"?: boolean;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerAttributes;
    }
  }
}
