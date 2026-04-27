export type LineChartConfig = {
  title?: string;
  type: 'line-chart';
  x: Array<string | number>;
  y: number[];
};

export type BarChartConfig = {
  title?: string;
  type: 'bar-chart';
  x: Array<string | number>;
  y: number[];
};

export type PieChartConfig = {
  title?: string;
  type: 'pie-chart';
  labels: string[];
  values: number[];
};

export type ScatterChartConfig = {
  title?: string;
  type: 'scatter-chart';
  x: number[];
  y: number[];
};

export type SummaryConfig = {
  title: string;
  type: 'summary';
  currentValue: number;
  previousValue: number;
  unit?: string;
};

export type ChartConfig =
  | LineChartConfig
  | BarChartConfig
  | PieChartConfig
  | ScatterChartConfig
  | SummaryConfig;
