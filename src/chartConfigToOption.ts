import type { EChartsOption } from 'echarts';
import type { ChartConfig } from './types';

const ensureSameLength = (left: unknown[], right: unknown[], message: string) => {
  if (left.length !== right.length) {
    throw new Error(message);
  }
};

// Dark theme colors matching the design
const darkThemeColors = {
  bgDark: '#030810',
  bgCard: '#0a1530',
  borderGold: '#ffd700',
  textGold: '#ffd700',
  textLight: '#ffffff',
  textMuted: '#b0b0b0',
  blueLight: '#5ab3ff',
  blueDark: '#1a2f50',
  chartColors: ['#ffd700', '#5ab3ff', '#7cb342', '#ff6b6b', '#29b6f6', '#ab47bc'],
};

// Base dark theme configuration
const getDarkThemeConfig = (title: string = ''): Partial<EChartsOption> => ({
  backgroundColor: 'transparent',
  textStyle: {
    color: darkThemeColors.textLight,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  title: {
    text: title,
    textStyle: {
      color: darkThemeColors.textGold,
      fontSize: 14,
      fontWeight: 600,
    },
    left: 'center',
    top: 0,
  },
  tooltip: {
    backgroundColor: 'rgba(15, 37, 64, 0.9)',
    borderColor: '#f0c674',
    textStyle: {
      color: darkThemeColors.textLight,
    },
    borderWidth: 1,
  },
  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 215, 0, 0.3)',
      },
    },
    axisLabel: {
      color: darkThemeColors.textMuted,
      fontSize: 11,
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 215, 0, 0.12)',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 215, 0, 0.3)',
      },
    },
    axisLabel: {
      color: darkThemeColors.textMuted,
      fontSize: 11,
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 215, 0, 0.12)',
      },
    },
  },
  color: darkThemeColors.chartColors,
});

export const chartConfigToOption = (config: ChartConfig): EChartsOption => {
  switch (config.type) {
    case 'line-chart': {
      ensureSameLength(config.x, config.y, '`x` and `y` must have the same length for line-chart.');

      return {
        ...getDarkThemeConfig(config.title),
        xAxis: {
          ...getDarkThemeConfig().xAxis,
          data: config.x,
        },
        yAxis: getDarkThemeConfig().yAxis,
        series: [
          {
            type: 'line',
            data: config.y,
            smooth: true,
            itemStyle: {
              color: darkThemeColors.borderGold,
            },
            lineStyle: {
              color: darkThemeColors.borderGold,
              width: 2,
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(255, 215, 0, 0.4)' },
                  { offset: 1, color: 'rgba(255, 215, 0, 0.08)' },
                ],
              },
            },
            symbolSize: 5,
            symbol: 'circle',
          },
        ],
      };
    }

    case 'bar-chart': {
      ensureSameLength(config.x, config.y, '`x` and `y` must have the same length for bar-chart.');

      return {
        ...getDarkThemeConfig(config.title),
        xAxis: {
          ...getDarkThemeConfig().xAxis,
          data: config.x,
        },
        yAxis: getDarkThemeConfig().yAxis,
        series: [
          {
            type: 'bar',
            data: config.y,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#ffd700' },
                  { offset: 1, color: '#5ab3ff' },
                ],
              },
            },
            emphasis: {
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: '#ffed4e' },
                    { offset: 1, color: '#5ab3ff' },
                  ],
                },
              },
            },
          },
        ],
      };
    }

    case 'pie-chart': {
      ensureSameLength(
        config.labels,
        config.values,
        '`labels` and `values` must have the same length for pie-chart.',
      );

      return {
        ...getDarkThemeConfig(config.title),
        tooltip: {
          ...getDarkThemeConfig().tooltip,
          trigger: 'item',
        },
        legend: {
          bottom: 0,
          textStyle: {
            color: darkThemeColors.textMuted,
          },
        },
        series: [
          {
            type: 'pie',
            radius: '60%',
            data: config.labels.map((label, index) => ({
              name: label,
              value: config.values[index],
            })),
            itemStyle: {
              borderColor: darkThemeColors.bgCard,
              borderWidth: 2,
            },
            label: {
              color: darkThemeColors.textLight,
              fontSize: 12,
            },
          },
        ],
      };
    }

    case 'scatter-chart': {
      ensureSameLength(config.x, config.y, '`x` and `y` must have the same length for scatter-chart.');

      return {
        ...getDarkThemeConfig(config.title),
        xAxis: {
          type: 'value' as const,
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 215, 0, 0.3)',
            },
          },
          axisLabel: {
            color: darkThemeColors.textMuted,
            fontSize: 11,
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 215, 0, 0.12)',
            },
          },
        },
        yAxis: {
          type: 'value' as const,
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 215, 0, 0.3)',
            },
          },
          axisLabel: {
            color: darkThemeColors.textMuted,
            fontSize: 11,
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 215, 0, 0.12)',
            },
          },
        },
        series: [
          {
            type: 'scatter',
            data: config.x.map((xValue, index) => [xValue, config.y[index]]),
            itemStyle: {
              color: darkThemeColors.borderGold,
              opacity: 0.8,
            },
            symbolSize: 8,
            emphasis: {
              itemStyle: {
                color: '#ffed4e',
                borderColor: darkThemeColors.textLight,
                borderWidth: 2,
              },
            },
          },
        ],
      };
    }

    case 'summary': {
      // Summary charts don't use ECharts, return empty config
      return {
        ...getDarkThemeConfig(),
      };
    }

    default: {
      const neverConfig: never = config;
      throw new Error(`Unsupported chart type: ${JSON.stringify(neverConfig)}`);
    }
  }
};
