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
      const config2 = config as any;
      const xData = config2.x;

      // Support both single series (y) and multiple series
      let series: any[] = [];

      if (config2.series && Array.isArray(config2.series) && config2.series.length > 0 && config2.series[0].name) {
        // Multiple series format
        series = config2.series.map((s: any, idx: number) => ({
          type: 'line',
          data: s.data,
          name: s.name,
          smooth: true,
          itemStyle: {
            color: darkThemeColors.chartColors[idx % darkThemeColors.chartColors.length],
          },
          lineStyle: {
            color: darkThemeColors.chartColors[idx % darkThemeColors.chartColors.length],
            width: 2,
          },
          symbolSize: 5,
          symbol: 'circle',
        }));
      } else if (config2.y && Array.isArray(config2.y)) {
        // Single series format (backward compatible)
        ensureSameLength(xData, config2.y, '`x` and `y` must have the same length for line-chart.');
        series = [
          {
            type: 'line',
            data: config2.y,
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
        ];
      }

      return {
        ...getDarkThemeConfig(config2.title),
        xAxis: {
          ...getDarkThemeConfig().xAxis,
          data: xData,
        },
        yAxis: getDarkThemeConfig().yAxis,
        series,
      };
    }

    case 'bar-chart': {
      const config2 = config as any;
      const xData = config2.x;

      // Support both single series (y) and multiple series
      let series: any[] = [];

      if (config2.series && Array.isArray(config2.series) && config2.series.length > 0 && config2.series[0].name) {
        // Multiple series format
        series = config2.series.map((s: any, idx: number) => ({
          type: 'bar',
          data: s.data,
          name: s.name,
          label: {
            show: true,
            position: 'top',
            color: darkThemeColors.textLight,
            fontSize: 11,
            formatter: ({ value }: any) =>
              typeof value === 'number' ? value.toLocaleString('ru-RU') : String(value),
          },
          itemStyle: {
            color: darkThemeColors.chartColors[idx % darkThemeColors.chartColors.length],
          },
          emphasis: {
            itemStyle: {
              color: darkThemeColors.chartColors[idx % darkThemeColors.chartColors.length],
              opacity: 0.8,
            },
          },
        }));
      } else if (config2.y && Array.isArray(config2.y)) {
        // Single series format (backward compatible)
        ensureSameLength(xData, config2.y, '`x` and `y` must have the same length for bar-chart.');
        series = [
          {
            type: 'bar',
            data: config2.y,
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
            label: {
              show: true,
              position: 'top',
              color: darkThemeColors.textLight,
              fontSize: 11,
              formatter: ({ value }: any) =>
                typeof value === 'number' ? value.toLocaleString('ru-RU') : String(value),
            },
          },
        ];
      }

      return {
        ...getDarkThemeConfig(config2.title),
        xAxis: {
          ...getDarkThemeConfig().xAxis,
          data: xData,
        },
        yAxis: getDarkThemeConfig().yAxis,
        series,
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

    case 'single-value': {
      // Single value doesn't use ECharts, return empty config
      return {
        ...getDarkThemeConfig(),
      };
    }

    case 'stacked-bar-chart': {
      // TODO: Implement stacked bar chart
      const config2 = config as any;
      return {
        ...getDarkThemeConfig(config2.title),
        xAxis: {
          type: 'category',
          data: config2.x,
        },
        yAxis: {},
        series: (config2.series || []).map((s: any) => ({
          type: 'bar',
          data: s.data,
          name: s.name,
          stack: 'total',
        })),
      };
    }

    case 'area-chart': {
      const config2 = config as any;
      return {
        ...getDarkThemeConfig(config2.title),
        xAxis: {
          ...getDarkThemeConfig().xAxis,
          data: config2.x,
        },
        yAxis: getDarkThemeConfig().yAxis,
        series: [
          {
            type: 'line',
            data: config2.y,
            smooth: true,
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
          },
        ],
      };
    }

    case 'doughnut-chart': {
      const config2 = config as any;
      return {
        ...getDarkThemeConfig(config2.title),
        series: [
          {
            type: 'pie',
            radius: ['40%', '60%'],
            data: config2.labels.map((label: string, idx: number) => ({
              name: label,
              value: config2.values[idx],
            })),
          },
        ],
      };
    }

    case 'pie-3d-chart': {
      // 3D pie is similar to regular pie but with emphasis
      const config2 = config as any;
      return {
        ...getDarkThemeConfig(config2.title),
        series: [
          {
            type: 'pie',
            radius: '60%',
            data: config2.labels.map((label: string, idx: number) => ({
              name: label,
              value: config2.values[idx],
            })),
            itemStyle: {
              borderColor: darkThemeColors.bgCard,
              borderWidth: 2,
            },
          },
        ],
      };
    }

    case 'combo-chart': {
      const config2 = config as any;
      let series: any[] = [];

      // Support explicit series format
      if (config2.series && Array.isArray(config2.series)) {
        series = config2.series.map((s: any, idx: number) => ({
          type: s.type === 'line' ? 'line' : 'bar',
          data: s.data,
          name: s.name,
          smooth: s.type === 'line',
          itemStyle: {
            color: darkThemeColors.chartColors[idx % darkThemeColors.chartColors.length],
          },
          lineStyle: s.type === 'line' ? {
            color: darkThemeColors.chartColors[idx % darkThemeColors.chartColors.length],
          } : undefined,
        }));
      } else {
        // Support legacy bar/line format with single or multiple series each

        // Process bar data
        if (config2.bar) {
          if (Array.isArray(config2.bar)) {
            if (config2.bar.length > 0 && typeof config2.bar[0] === 'number') {
              // Single bar series
              series.push({
                type: 'bar',
                data: config2.bar,
                name: 'Bar',
                itemStyle: {
                  color: darkThemeColors.blueLight,
                },
              });
            } else if (config2.bar.length > 0 && config2.bar[0].name) {
              // Multiple bar series
              config2.bar.forEach((s: any, idx: number) => {
                series.push({
                  type: 'bar',
                  data: s.data,
                  name: s.name,
                  itemStyle: {
                    color: darkThemeColors.chartColors[idx % darkThemeColors.chartColors.length],
                  },
                });
              });
            }
          }
        }

        // Process line data
        if (config2.line) {
          if (Array.isArray(config2.line)) {
            if (config2.line.length > 0 && typeof config2.line[0] === 'number') {
              // Single line series
              series.push({
                type: 'line',
                data: config2.line,
                name: 'Line',
                smooth: true,
                itemStyle: {
                  color: darkThemeColors.borderGold,
                },
                lineStyle: {
                  color: darkThemeColors.borderGold,
                },
              });
            } else if (config2.line.length > 0 && config2.line[0].name) {
              // Multiple line series
              config2.line.forEach((s: any, idx: number) => {
                series.push({
                  type: 'line',
                  data: s.data,
                  name: s.name,
                  smooth: true,
                  itemStyle: {
                    color: darkThemeColors.chartColors[(idx + (config2.bar?.length || 0)) % darkThemeColors.chartColors.length],
                  },
                  lineStyle: {
                    color: darkThemeColors.chartColors[(idx + (config2.bar?.length || 0)) % darkThemeColors.chartColors.length],
                  },
                });
              });
            }
          }
        }
      }

      return {
        ...getDarkThemeConfig(config2.title),
        xAxis: {
          ...getDarkThemeConfig().xAxis,
          data: config2.x,
        },
        yAxis: getDarkThemeConfig().yAxis,
        series,
      };
    }

    default: {
      const neverConfig: never = config;
      throw new Error(`Unsupported chart type: ${JSON.stringify(neverConfig)}`);
    }
  }
};
