import type { ChartConfig } from './types';
import mockData from './mock/mock.json';

export interface ChartConfigWithDataSource {
  title: string;
  type: 'line-chart' | 'bar-chart' | 'stacked-bar-chart' | 'area-chart' | 'pie-chart' | 'doughnut-chart' | 'pie-3d-chart' | 'combo-chart' | 'scatter-chart';
  dataSource?: {
    xField?: string;
    yField?: string; // Single series
    yFields?: Array<{ name: string; field: string }>; // Multiple series for line/bar charts
    barFields?: Array<{ name: string; field: string }>; // Multiple bar series for combo
    lineFields?: Array<{ name: string; field: string }>; // Multiple line series for combo
    seriesField?: string; // For stacked charts
  };
}

export interface SingleValueConfigWithoutDataSource {
  title: string;
  type: 'single-value';
  value: number;
  unit?: string;
}

export interface SummaryConfigWithDataSource {
  title: string;
  type: 'summary';
  dataSource: {
    valueField: string; // path like "ДДС.Остаток денег на конец месяца"
  };
  unit?: string;
}

export interface SummaryConfigWithoutDataSource {
  title: string;
  type: 'summary';
  currentValue: number;
  previousValue: number;
  unit?: string;
  monthIndex?: number;
}

export interface TabConfig {
  name: string;
  items: LayoutComponent[];
}

export interface ChartComponentConfig {
  type: 'chart';
  config: ChartConfigWithDataSource | SingleValueConfigWithoutDataSource | SummaryConfigWithDataSource | SummaryConfigWithoutDataSource;
}

export interface TabsBlockComponentConfig {
  type: 'tabs-block';
  title?: string;
  tabs: TabConfig[];
}

export interface GroupHorizontalComponentConfig {
  type: 'group-horizontal';
  title?: string;
  items: LayoutComponent[];
}

export interface GroupVerticalComponentConfig {
  type: 'group-vertical';
  title: string;
  items: LayoutComponent[];
}

export type LayoutComponent = ChartComponentConfig | TabsBlockComponentConfig | GroupHorizontalComponentConfig | GroupVerticalComponentConfig;

export interface PageConfig {
  layout: LayoutComponent[];
}

/**
 * Extract nested value from object using dot notation
 * e.g., "общее.месяц" -> data.общее.месяц
 */
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Convert string numbers with spaces (like "12 129") to numbers
 */
const parseValue = (val: unknown): number => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    return parseInt(val.replace(/\s/g, ''), 10);
  }
  return 0;
};

/**
 * Load data from mock or API based on environment
 */
const loadData = async (): Promise<any> => {
  const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

  if (useMock) {
    // Return imported mock data
    return mockData;
  }

  // TODO: Replace with actual API call
  const apiUrl = import.meta.env.VITE_API_URL || '/api/data';
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${apiUrl}`);
  }
  return response.json();
};

/**
 * Load chart data from mock.json or external API
 */
export const loadChartData = async (
  configWithDataSource: ChartConfigWithDataSource | SingleValueConfigWithoutDataSource | SummaryConfigWithDataSource | SummaryConfigWithoutDataSource,
  monthIndices?: { start: number; end: number }
): Promise<ChartConfig> => {
  // Single value doesn't need to load data
  if (configWithDataSource.type === 'single-value') {
    return configWithDataSource as any;
  }

  // Handle summary with dataSource - needs data loading
  if (configWithDataSource.type === 'summary' && 'dataSource' in configWithDataSource) {
    const data = await loadData();
    const config = configWithDataSource as SummaryConfigWithDataSource;
    const { valueField } = config.dataSource;

    const allValues = getNestedValue(data, valueField) as unknown[];
    if (!Array.isArray(allValues) || allValues.length === 0) {
      throw new Error(`Could not find field: ${valueField}`);
    }

    // Get current and previous values based on month indices
    const endIdx = monthIndices?.end ?? allValues.length - 1;
    const startIdx = monthIndices?.start ?? Math.max(0, endIdx - 1);

    const currentValue = parseValue(allValues[endIdx]);
    const previousValue = parseValue(allValues[startIdx]);

    return {
      title: config.title,
      type: 'summary',
      currentValue,
      previousValue,
      unit: config.unit,
    } as any;
  }

  // Handle summary without dataSource - return as-is
  if (configWithDataSource.type === 'summary') {
    return configWithDataSource as any;
  }

  const data = await loadData();

  const { title, type, dataSource } = configWithDataSource as ChartConfigWithDataSource;
  // If no dataSource, return as-is
  if (!dataSource) {
    return configWithDataSource as any;
  }

  const { xField, yField, yFields, barFields, lineFields, seriesField } = dataSource;

  // Handle different chart types
  if (type === 'stacked-bar-chart') {
    // Stacked bar charts need series field
    const xData = xField ? (getNestedValue(data, xField) as (string | number)[]) : [];
    if (!xData || xData.length === 0) {
      throw new Error(`Could not find xField: ${xField}`);
    }
    // For now, return empty series - would need different config structure
    return {
      title,
      type,
      x: xData,
      series: [{ name: 'Series 1', data: [] }],
    } as any;
  }

  // Handle line-chart and bar-chart with multiple series
  if ((type === 'line-chart' || type === 'bar-chart') && yFields && yFields.length > 0) {
    const xData = xField ? (getNestedValue(data, xField) as (string | number)[]) : [];
    if (!xData || xData.length === 0) {
      throw new Error(`Could not find xField: ${xField}`);
    }

    const series = yFields.map(({ name, field }) => {
      const yDataRaw = getNestedValue(data, field) as unknown[];
      if (!Array.isArray(yDataRaw)) {
        throw new Error(`Could not find field: ${field}`);
      }
      return {
        name,
        data: yDataRaw.map(parseValue),
      };
    });

    return {
      title,
      type,
      x: xData,
      series,
    } as any;
  }

  // Handle combo-chart with multiple series
  if (type === 'combo-chart' && (barFields || lineFields)) {
    const xData = xField ? (getNestedValue(data, xField) as (string | number)[]) : [];
    if (!xData || xData.length === 0) {
      throw new Error(`Could not find xField: ${xField}`);
    }

    const series: Array<{ name: string; type: 'bar' | 'line'; data: number[] }> = [];

    // Add bar series
    if (barFields && barFields.length > 0) {
      barFields.forEach(({ name, field }) => {
        const yDataRaw = getNestedValue(data, field) as unknown[];
        if (!Array.isArray(yDataRaw)) {
          throw new Error(`Could not find field: ${field}`);
        }
        series.push({
          name,
          type: 'bar',
          data: yDataRaw.map(parseValue),
        });
      });
    }

    // Add line series
    if (lineFields && lineFields.length > 0) {
      lineFields.forEach(({ name, field }) => {
        const yDataRaw = getNestedValue(data, field) as unknown[];
        if (!Array.isArray(yDataRaw)) {
          throw new Error(`Could not find field: ${field}`);
        }
        series.push({
          name,
          type: 'line',
          data: yDataRaw.map(parseValue),
        });
      });
    }

    return {
      title,
      type,
      x: xData,
      series,
    } as any;
  }

  // Handle single series (backward compatible)
  const xData = xField ? (getNestedValue(data, xField) as (string | number)[]) : [];
  const yDataRaw = yField ? (getNestedValue(data, yField) as unknown[]) : [];

  if (!Array.isArray(xData) || !Array.isArray(yDataRaw) || xData.length === 0 || yDataRaw.length === 0) {
    throw new Error(`Could not find fields: ${xField}, ${yField}`);
  }

  const yData = yDataRaw.map(parseValue);

  return {
    title,
    type: type as any,
    x: xData,
    y: yData,
  } as any;
};

/**
 * Load multiple charts from config array
 */
export const loadChartsData = async (
  chartsConfig: (ChartConfigWithDataSource | SingleValueConfigWithoutDataSource | SummaryConfigWithDataSource | SummaryConfigWithoutDataSource)[],
  monthIndices?: { start: number; end: number }
): Promise<ChartConfig[]> => {
  return Promise.all(chartsConfig.map(config => loadChartData(config, monthIndices)));
};

/**
 * Load tabs with all charts
 */
export const loadTabsData = async (
  tabsConfig: TabConfig[] | undefined,
  monthIndices?: { start: number; end: number }
): Promise<any[]> => {
  if (!tabsConfig || tabsConfig.length === 0) return [];

  return Promise.all(
    tabsConfig.map(async (tab) => ({
      name: tab.name,
      items: await Promise.all(
        tab.items.map((item) => processLayoutComponent(item, monthIndices))
      ),
    }))
  );
};

/**
 * Load page data (process layout with mixed components) - RECURSIVE
 */
const processLayoutComponent = async (
  component: LayoutComponent,
  monthIndices?: { start: number; end: number }
): Promise<any> => {
  if (component.type === 'chart') {
    return {
      type: 'chart' as const,
      data: await loadChartData(component.config, monthIndices),
    };
  }

  if (component.type === 'tabs-block') {
    return {
      type: 'tabs-block' as const,
      title: component.title,
      tabs: await loadTabsData(component.tabs, monthIndices),
    };
  }

  if (component.type === 'group-horizontal') {
    return {
      type: 'group-horizontal' as const,
      title: component.title,
      items: await Promise.all(
        component.items.map(item => processLayoutComponent(item, monthIndices))
      ),
    };
  }

  if (component.type === 'group-vertical') {
    return {
      type: 'group-vertical' as const,
      title: component.title,
      items: await Promise.all(
        component.items.map(item => processLayoutComponent(item, monthIndices))
      ),
    };
  }

  throw new Error(`Unknown component type: ${(component as any).type}`);
};

export const loadPageData = async (
  pageConfig: PageConfig,
  monthIndices?: { start: number; end: number }
): Promise<any[]> => {
  return Promise.all(
    (pageConfig.layout || []).map(component => processLayoutComponent(component, monthIndices))
  );
};
