import type { ChartConfig } from './types';

export interface ChartConfigWithDataSource {
  title: string;
  type: 'line-chart' | 'bar-chart' | 'pie-chart' | 'scatter-chart';
  dataSource: {
    xField: string; // path like "общее.месяц"
    yField: string; // path like "ДДС.Остаток денег на конец месяца "
  };
}

export interface SummaryConfigWithoutDataSource {
  title: string;
  type: 'summary';
  currentValue: number;
  previousValue: number;
  unit?: string;
}

export interface TabConfig {
  name: string;
  charts: (ChartConfigWithDataSource | SummaryConfigWithoutDataSource)[];
}

export interface ChartComponentConfig {
  type: 'chart';
  config: ChartConfigWithDataSource | SummaryConfigWithoutDataSource;
}

export interface TabsBlockComponentConfig {
  type: 'tabs-block';
  title?: string;
  tabs: TabConfig[];
}

export type LayoutComponent = ChartComponentConfig | TabsBlockComponentConfig;

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
  const useMock = import.meta.env.VITE_USE_MOCK === 'true';

  if (useMock) {
    // Load mock data via fetch to allow HMR to detect changes
    const response = await fetch('/src/mock/mock.json');
    if (!response.ok) {
      throw new Error('Failed to load mock data');
    }
    return response.json();
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
  configWithDataSource: ChartConfigWithDataSource | SummaryConfigWithoutDataSource
): Promise<ChartConfig> => {
  // Summary doesn't need to load data
  if (configWithDataSource.type === 'summary') {
    return configWithDataSource as any;
  }

  const data = await loadData();

  const { title, type, dataSource } = configWithDataSource as ChartConfigWithDataSource;
  const { xField, yField } = dataSource;

  const xData = getNestedValue(data, xField) as (string | number)[];
  const yDataRaw = getNestedValue(data, yField) as unknown[];

  if (!xData || !yDataRaw) {
    throw new Error(`Could not find fields: ${xField}, ${yField}`);
  }

  const yData = yDataRaw.map(parseValue);

  return {
    title,
    type: type as any,
    x: xData,
    y: yData,
  };
};

/**
 * Load multiple charts from config array
 */
export const loadChartsData = async (
  chartsConfig: (ChartConfigWithDataSource | SummaryConfigWithoutDataSource)[]
): Promise<ChartConfig[]> => {
  return Promise.all(chartsConfig.map(config => loadChartData(config)));
};

/**
 * Load tabs with all charts
 */
export const loadTabsData = async (
  tabsConfig: TabConfig[] | undefined
): Promise<Array<{ name: string; charts: ChartConfig[] }>> => {
  if (!tabsConfig || tabsConfig.length === 0) return [];
  return Promise.all(
    tabsConfig.map(async (tab) => ({
      name: tab.name,
      charts: await loadChartsData(tab.charts),
    }))
  );
};

/**
 * Load page data (process layout with mixed components)
 */
export const loadPageData = async (
  pageConfig: PageConfig
): Promise<Array<{
  type: 'chart' | 'tabs-block';
  data: ChartConfig;
} | {
  type: 'tabs-block';
  title?: string;
  tabs: Array<{ name: string; charts: ChartConfig[] }>;
}>> => {
  return Promise.all(
    (pageConfig.layout || []).map(async (component) => {
      if (component.type === 'chart') {
        return {
          type: 'chart' as const,
          data: await loadChartData(component.config),
        };
      } else if (component.type === 'tabs-block') {
        return {
          type: 'tabs-block' as const,
          title: component.title,
          tabs: await Promise.all(
            component.tabs.map(async (tab) => ({
              name: tab.name,
              charts: await loadChartsData(tab.charts),
            }))
          ),
        };
      }
      throw new Error(`Unknown component type: ${(component as any).type}`);
    })
  );
};
