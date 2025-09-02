export const formatBytes = (bytes: number | string) => {
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