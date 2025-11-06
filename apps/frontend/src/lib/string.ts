export const truncateText = (description: string, maxLength = 80) => {
  if (description.length <= maxLength) return description
  return description.substring(0, maxLength) + "..."
}

export const capitalizeFirstLetter = (text: string, allWords = false) => {
  if (allWords) {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const getNameInitials = (name: string) => {
  const names = name.split(" ")
  const initials = names.map((n) => n.charAt(0)).join("")
  return initials.toUpperCase()
}