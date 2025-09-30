export const formatBytes = (bytes: number | string | undefined) => {
  if (bytes === undefined) return "0 B";
  const bytesNumber = typeof bytes === 'string' ? parseInt(bytes) : bytes;
  const k = 1024;
  if (bytesNumber < k) {
    return `${bytesNumber} B`;
  } else if (bytesNumber < k * k) {
    return `${(bytesNumber / 1024).toFixed(2)} KB`;
  } else if (bytesNumber < k * k * k) {
    return `${(bytesNumber / 1048576).toFixed(2)} MB`;
  } else {
    return `${(bytesNumber / 1073741824).toFixed(2)} GB`;
  }
}

export const formatDuration = (seconds: number | undefined): string => {
  if (seconds === undefined) return "0:00"
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}
