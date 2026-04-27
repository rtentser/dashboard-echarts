export type LineChartConfig = {
  title?: string;
  type: 'line-chart';
  x: Array<string | number>;
  y?: number[]; // Single series (backward compatible)
  series?: Array<{ name: string; data: number[] }>; // Multiple series
};

export type BarChartConfig = {
  title?: string;
  type: 'bar-chart';
  x: Array<string | number>;
  y?: number[]; // Single series (backward compatible)
  series?: Array<{ name: string; data: number[] }>; // Multiple series
};

export type StackedBarChartConfig = {
  title?: string;
  type: 'stacked-bar-chart';
  x: Array<string | number>;
  series: Array<{ name: string; data: number[] }>;
};

export type AreaChartConfig = {
  title?: string;
  type: 'area-chart';
  x: Array<string | number>;
  y: number[];
};

export type PieChartConfig = {
  title?: string;
  type: 'pie-chart';
  labels: string[];
  values: number[];
};

export type DoughnutChartConfig = {
  title?: string;
  type: 'doughnut-chart';
  labels: string[];
  values: number[];
};

export type Pie3DChartConfig = {
  title?: string;
  type: 'pie-3d-chart';
  labels: string[];
  values: number[];
};

export type ComboChartConfig = {
  title?: string;
  type: 'combo-chart';
  x: Array<string | number>;
  line?: number[] | Array<{ name: string; data: number[] }>; // Single or multiple lines
  bar?: number[] | Array<{ name: string; data: number[] }>; // Single or multiple bars
  series?: Array<{ name: string; type: 'line' | 'bar'; data: number[] }>; // Explicit series
};

export type ScatterChartConfig = {
  title?: string;
  type: 'scatter-chart';
  x: number[];
  y: number[];
};

export type SingleValueConfig = {
  title: string;
  type: 'single-value';
  value: number | string;
  unit?: string;
};

export type SummaryConfig = {
  title: string;
  type: 'summary';
  currentValue: number;
  previousValue: number;
  unit?: string;
  monthIndex?: number; // Optional: index for month-based filtering
};

export type SummaryDataSourceConfig = {
  title: string;
  type: 'summary';
  dataSource: {
    valueField: string; // path like "ДДС.Остаток денег на конец месяца"
  };
  unit?: string;
};

export type ChartConfig =
  | LineChartConfig
  | BarChartConfig
  | StackedBarChartConfig
  | AreaChartConfig
  | PieChartConfig
  | DoughnutChartConfig
  | Pie3DChartConfig
  | ComboChartConfig
  | ScatterChartConfig
  | SingleValueConfig
  | SummaryConfig
  | SummaryDataSourceConfig;
