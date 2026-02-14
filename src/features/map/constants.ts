/** Carto Positron — no labels (base layer under country polygons) */
export const CARTO_POSITRON_NO_LABELS =
  "https://basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png";

/** Carto Positron — labels only (overlaid above country polygons) */
export const CARTO_POSITRON_LABELS =
  "https://basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}@2x.png";

export const VISITED_FILL_COLOR = "#00838f";
export const VISITED_FILL_OPACITY = 0.35;
export const VISITED_BORDER_COLOR = "#00838f";
export const VISITED_BORDER_WIDTH = 1.5;
export const HOVER_FILL_OPACITY = 0.5;

export const INITIAL_CENTER = [15, 20] as [number, number];
export const INITIAL_ZOOM = 1.8;

/** Padding for fitBounds when a country is selected */
export const FIT_BOUNDS_PADDING_DESKTOP = {
  top: 80,
  bottom: 80,
  left: 80,
  right: 440, // room for drawer
};
export const FIT_BOUNDS_PADDING_MOBILE = {
  top: 80,
  bottom: 340, // room for bottom sheet
  left: 40,
  right: 40,
};
