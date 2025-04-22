export type ResourceUsageData = {
  cpu: Array<{ name: string; usage: number }>;
  memory: Array<{ name: string; usage: number }>;
};
