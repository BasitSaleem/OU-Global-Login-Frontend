export function getColorFromId(id: string) {
  const colors = [
    "#795CF5", // purple
    "#B11E67", // magenta
    "#F59E0B", // amber
    "#10B981", // green
    "#3B82F6", // blue
    "#F43F5E", // rose
    "#8B5CF6", // violet
    "#14B8A6", // teal
    "#EC4899", // pink
    "#6366F1", // indigo
    "#FF6B6B", // red
    "#FFA94D", // orange
    "#FFB347", // yellow-orange
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
