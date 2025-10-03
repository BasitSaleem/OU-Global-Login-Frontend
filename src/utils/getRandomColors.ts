export function getColorFromId(id: string) {
  const colors = [
    "#137F6A", // teal
    "#795CF5", // purple
    "#FF6B6B", // red
    "#FFA94D", // orange
    "#4D96FF", // blue
    "#28C76F", // green
    "#F72585", // pink
    "#FFB347", // yellow-orange
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
