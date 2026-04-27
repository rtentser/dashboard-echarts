import ReactECharts from 'echarts-for-react';
import { chartConfigToOption } from './chartConfigToOption';
import type { ChartConfig, SummaryConfig } from './types';

type ChartRendererProps = {
  config: ChartConfig;
  height?: number;
};

const SummaryRenderer = ({ config }: { config: SummaryConfig }) => {
  const difference = config.currentValue - config.previousValue;
  const percentChange = (difference / config.previousValue) * 100;
  const isPositive = difference >= 0;
  const arrow = isPositive ? '↑' : '↓';

  return (
    <div className="summary-container">
      <div className="summary-title">{config.title}</div>
      <div className="summary-current">
        <span className="summary-value">{config.currentValue.toLocaleString()}</span>
        {config.unit && <span className="summary-unit">{config.unit}</span>}
      </div>
      <div className={`summary-change ${isPositive ? 'positive' : 'negative'}`}>
        <span className="change-value">{arrow}{isPositive ? '' : ''}{Math.abs(difference).toLocaleString()}</span>
      </div>
    </div>
  );
};

export const ChartRenderer = ({ config, height = 420 }: ChartRendererProps) => {
  if (config.type === 'summary') {
    return (
      <div className="chart-wrapper-summary">
        {config.title && <div className="chart-title">{config.title}</div>}
        <SummaryRenderer config={config} />
      </div>
    );
  }

  const option = chartConfigToOption(config);

  return (
    <div>
      {config.title && <div className="chart-title">{config.title}</div>}
      <ReactECharts option={option} style={{ height }} notMerge lazyUpdate />
    </div>
  );
};
