import { z } from "zod";

export const RED_HIGHLIGHT = "red";
export const DARK_RED_HIGHLIGHT = "dark_red";
export const ORANGE_HIGHLIGHT = "orange";
export const DARK_ORANGE_HIGHLIGHT = "dark_orange";
export const GREEN_HIGHLIGHT = "green";
export const DARK_GREEN_HIGHLIGHT = "dark_green";
export const BLUE_HIGHLIGHT = "blue";
export const DARK_BLUE_HIGHLIGHT = "dark_blue";
export const GRAY_HIGHLIGHT = "gray";
export const DARK_GRAY_HIGHLIGHT = "dark_gray";
export const HIGHLIGHT_COLORS = [
  RED_HIGHLIGHT,
  DARK_RED_HIGHLIGHT,
  ORANGE_HIGHLIGHT,
  DARK_ORANGE_HIGHLIGHT,
  GREEN_HIGHLIGHT,
  DARK_GREEN_HIGHLIGHT,
  BLUE_HIGHLIGHT,
  DARK_BLUE_HIGHLIGHT,
  GRAY_HIGHLIGHT,
  DARK_GRAY_HIGHLIGHT,
] as const;

export const highlightValidator = z.enum(HIGHLIGHT_COLORS);
export type HighlightColor = z.infer<typeof highlightValidator>;
