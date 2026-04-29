import ReactECharts from 'echarts-for-react';
import { chartConfigToOption } from './chartConfigToOption';
import type { ChartConfig, SummaryConfig, SingleValueConfig, SummaryDataSourceConfig } from './types';

type ChartRendererProps = {
  config: ChartConfig;
  height?: number;
};

const formatNumberWithSpaces = (num: number): string => {
  return num.toLocaleString().replace(/,/g, ' ');
};

const SingleValueRenderer = ({ config }: { config: SingleValueConfig }) => {
  // Check if value is a valid date in DDMMYYYY format
  const isValidDateFormat = (val: number): boolean => {
    if (val < 1000000 || val > 31122099) return false;
    const str = String(val).padStart(8, '0');
    const day = parseInt(str.substring(0, 2), 10);
    const month = parseInt(str.substring(2, 4), 10);
    const year = parseInt(str.substring(4, 8), 10);

    // Check valid date ranges
    return day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 2000 && year <= 2099;
  };

  const isDate = typeof config.value === 'string' || (typeof config.value === 'number' && isValidDateFormat(config.value));

  let displayValue: string;

  if (typeof config.value === 'string') {
    // Already a string date like "27.04.2026"
    displayValue = config.value;
  } else if (isDate && typeof config.value === 'number') {
    // Format number as date: DDMMYYYY -> DD.MM.YYYY
    const str = String(config.value).padStart(8, '0');
    const day = str.substring(0, 2);
    const month = str.substring(2, 4);
    const year = str.substring(4, 8);
    displayValue = `${day}.${month}.${year}`;
  } else {
    // Format as number
    displayValue = formatNumberWithSpaces(config.value as number);
  }

  return (
    <div className="single-value-container">
      <div className="single-value-value">
        {displayValue}
        {config.unit && !isDate && <span className="single-value-unit">{config.unit}</span>}
      </div>
    </div>
  );
};

const SummaryRenderer = ({ config }: { config: SummaryConfig | SummaryDataSourceConfig }) => {
  // Handle both SummaryConfig (with number values) and SummaryDataSourceConfig (already processed)
  if (!('currentValue' in config)) {
    return <div>Invalid summary config</div>;
  }

  const summaryConfig = config as SummaryConfig;
  const difference = summaryConfig.currentValue - summaryConfig.previousValue;
  const isPositive = difference >= 0;
  const arrow = isPositive ? '↑' : '↓';

  return (
    <div className="summary-container">
      <div className="summary-current">
        <span className="summary-value">{formatNumberWithSpaces(summaryConfig.currentValue)}</span>
        {config.unit && <span className="summary-unit">{config.unit}</span>}
      </div>
      <div className={`summary-change ${isPositive ? 'positive' : 'negative'}`}>
        <span className="change-value">{arrow}{isPositive ? '' : ''}{formatNumberWithSpaces(Math.abs(difference))}</span>
      </div>
    </div>
  );
};

export const ChartRenderer = ({ config, height = 420 }: ChartRendererProps) => {
  if (config.type === 'single-value') {
    return (
      <div className="chart-wrapper-single-value">
        {config.title && <div className="chart-title">{config.title}</div>}
        <SingleValueRenderer config={config} />
      </div>
    );
  }

  if (config.type === 'summary') {
    return (
      <div className="chart-wrapper-summary">
        {config.title && <div className="chart-title">{config.title}</div>}
        <SummaryRenderer config={config as any} />
      </div>
    );
  }

  const option = chartConfigToOption(config);

  return (
    <div>
      <ReactECharts option={option} style={{ height }} notMerge lazyUpdate />
    </div>
  );
};
