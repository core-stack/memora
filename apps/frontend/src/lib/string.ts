export const truncateText = (description: string, maxLength = 80) => {
  if (description.length <= maxLength) return description
  return description.substring(0, maxLength) + "..."
}