export const buildBullInject = (jobName: string): string => {
  return `BullQueue_${jobName}`;
};
