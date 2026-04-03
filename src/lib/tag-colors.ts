export const TAG_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  default: { bg: "#f3f4f6", text: "#374151", ring: "#d1d5db" },
  gray:    { bg: "#e5e7eb", text: "#374151", ring: "#9ca3af" },
  brown:   { bg: "#fce8cd", text: "#78350f", ring: "#d97706" },
  orange:  { bg: "#fed7aa", text: "#9a3412", ring: "#f97316" },
  yellow:  { bg: "#fef08a", text: "#854d0e", ring: "#eab308" },
  green:   { bg: "#bbf7d0", text: "#166534", ring: "#22c55e" },
  blue:    { bg: "#bfdbfe", text: "#1e40af", ring: "#3b82f6" },
  purple:  { bg: "#ddd6fe", text: "#5b21b6", ring: "#8b5cf6" },
  pink:    { bg: "#fbcfe8", text: "#9d174d", ring: "#ec4899" },
  red:     { bg: "#fecaca", text: "#991b1b", ring: "#ef4444" },
};

export const TAG_COLOR_NAMES = Object.keys(TAG_COLORS);

export function getTagColorStyle(color: string): React.CSSProperties {
  const c = TAG_COLORS[color] ?? TAG_COLORS["default"];
  return { backgroundColor: c.bg, color: c.text, borderColor: c.ring };
}
