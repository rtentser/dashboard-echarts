import type { EChartsOption, SeriesOption } from 'echarts';
import type { ChartConfig } from './types';

const ensureSameLength = (left: unknown[], right: unknown[], message: string) => {
  if (left.length !== right.length) {
    throw new Error(message);
  }
};

// Dark theme colors matching the design
const darkThemeColors = {
  bgDark: '#0a1020',
  bgCard: '#111a33',
  borderGold: '#c88b46',
  textGold: '#f4c56a',
  textLight: '#f6e7c8',
  textMuted: '#c7b38c',
  blueLight: '#3f7ee8',
  blueDark: '#102a5c',
  chartColors: [
    '#f4c56a',
    '#3f7ee8',
    '#2f63c7',
    '#b87532',
    '#a7d98b',
    '#e25b4f',
  ],
};

// Base dark theme configuration
const getDarkThemeConfig = (title: string = ''): Partial<EChartsOption> => ({
  backgroundColor: 'transparent',
  textStyle: {
    color: darkThemeColors.textLight,
    fontFamily: 'Manrope, Inter, system-ui, sans-serif',
  },
  title: {
    text: title,
    textStyle: {
      color: darkThemeColors.textGold,
      fontSize: 13,
      fontWeight: 500,
    },
    left: 'center',
    top: 0,
  },
  tooltip: {
    backgroundColor: 'rgba(20, 32, 58, 0.95)',
    borderColor: '#c88b46',
    textStyle: {
      color: darkThemeColors.textLight,
      fontFamily: 'Manrope, Inter, system-ui, sans-serif',
      fontSize: 12,
    },
    borderWidth: 1.25,
  },
  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: 'rgba(200, 139, 70, 0.48)',
        width: 1.5,
      },
    },
    axisLabel: {
      color: darkThemeColors.textMuted,
      fontSize: 11,
      fontWeight: 400,
      fontFamily: 'Manrope, Inter, system-ui, sans-serif',
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(200, 139, 70, 0.18)',
        width: 1,
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: 'rgba(200, 139, 70, 0.48)',
        width: 1.5,
      },
    },
    axisLabel: {
      color: darkThemeColors.textMuted,
      fontSize: 11,
      fontWeight: 400,
      fontFamily: 'Manrope, Inter, system-ui, sans-serif',
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(200, 139, 70, 0.18)',
        width: 1,
      },
    },
  },
  color: darkThemeColors.chartColors,
});

const wrapText = (text: string, maxChars = 28) => {
  if (!text) return '';

  const words = String(text).split(' ');
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;

    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);

  return lines.join('\n');
};

export const chartConfigToOption = (config: ChartConfig): EChartsOption => {
  switch (config.type) {
    case 'line-chart': {
      const config2 = config as any;

      if (!Array.isArray(config2.series) || config2.series.length === 0) {
        throw new Error('line-chart requires `series`.');
      }

      config2.series.forEach((s: any) => {
        ensureSameLength(
          config2.x,
          s.data,
          '`x` and every line-chart series data array must have the same length.',
        );
      });

      return {
        ...getDarkThemeConfig(config2.title),
        tooltip: {
          ...getDarkThemeConfig().tooltip,
          trigger: 'axis',
        },
        legend: {
          bottom: 0,
          textStyle: {
            color: darkThemeColors.textMuted,
          },
        },
        xAxis: {
          ...getDarkThemeConfig().xAxis,
          data: config2.x,
        },
        yAxis: getDarkThemeConfig().yAxis,
        series: config2.series.map((s: any, idx: number) => ({
          type: 'line',
          name: s.name,
          data: s.data,
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          itemStyle: {
            color: darkThemeColors.chartColors[idx % darkThemeColors.chartColors.length],
          },
          lineStyle: {
            color: darkThemeColors.chartColors[idx % darkThemeColors.chartColors.length],
            width: 2,
          },
        })),
      } satisfies EChartsOption;
    }

    case 'bar-chart': {
      const config2 = config as any;

      if (!Array.isArray(config2.series) || config2.series.length === 0) {
        throw new Error('bar-chart requires `series`.');
      }

      config2.series.forEach((s: any) => {
        ensureSameLength(
          config2.x,
          s.data,
          '`x` and every bar-chart series data array must have the same length.',
        );
      });

      return {
        ...getDarkThemeConfig(config2.title),
        tooltip: {
          ...getDarkThemeConfig().tooltip,
          trigger: 'axis',
        },
        legend: {
          bottom: 0,
          textStyle: {
            color: darkThemeColors.textMuted,
          },
        },
        xAxis: {
          ...getDarkThemeConfig().xAxis,
          data: config2.x,
        },
        yAxis: getDarkThemeConfig().yAxis,
        series: config2.series.map((s: any, idx: number) => ({
          type: 'bar',
          name: s.name,
          data: s.data,
          itemStyle: {
            color: darkThemeColors.chartColors[idx % darkThemeColors.chartColors.length],
            borderRadius: [6, 6, 0, 0],
          },
        })),
      } satisfies EChartsOption;
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
        ] satisfies SeriesOption[],
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
              color: 'rgba(200, 139, 70, 0.48)',
              width: 1.5,
            },
          },
          axisLabel: {
            color: darkThemeColors.textMuted,
            fontSize: 11,
            fontWeight: 400,
            fontFamily: 'Manrope, Inter, system-ui, sans-serif',
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(200, 139, 70, 0.18)',
              width: 1,
            },
          },
        },
        yAxis: {
          type: 'value' as const,
          axisLine: {
            lineStyle: {
              color: 'rgba(200, 139, 70, 0.48)',
              width: 1.5,
            },
          },
          axisLabel: {
            color: darkThemeColors.textMuted,
            fontSize: 11,
            fontWeight: 400,
            fontFamily: 'Manrope, Inter, system-ui, sans-serif',
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(200, 139, 70, 0.18)',
              width: 1,
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
        ] satisfies SeriesOption[],
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
        })) satisfies SeriesOption[],
      };
    }

    case 'area-chart': {
      const config2 = config as any;

      if (!Array.isArray(config2.series) || config2.series.length === 0) {
        throw new Error('area-chart requires `series`.');
      }

      config2.series.forEach((s: any) => {
        ensureSameLength(
          config2.x,
          s.data,
          '`x` and every area-chart series data array must have the same length.',
        );
      });

      return {
        ...getDarkThemeConfig(config2.title),
        tooltip: {
          ...getDarkThemeConfig().tooltip,
          trigger: 'axis',
        },
        legend: {
          bottom: 0,
          textStyle: {
            color: darkThemeColors.textMuted,
          },
        },
        xAxis: {
          ...getDarkThemeConfig().xAxis,
          data: config2.x,
        },
        yAxis: getDarkThemeConfig().yAxis,
        series: config2.series.map((s: any, idx: number) => ({
          type: 'line',
          name: s.name,
          data: s.data,
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          itemStyle: {
            color: darkThemeColors.chartColors[idx % darkThemeColors.chartColors.length],
          },
          lineStyle: {
            color: darkThemeColors.chartColors[idx % darkThemeColors.chartColors.length],
            width: 2,
          },
          areaStyle: {
            opacity: 0.24,
          },
        })),
      } satisfies EChartsOption;
    }

    case 'doughnut-chart': {
      const config2 = config as any;

      const rawValue = Number(config2.value ?? config2.values?.[0] ?? 0);

      // для текста — без ограничений
      const displayPercent = rawValue;

      // для графика — максимум 100
      const chartPercent = Math.max(0, Math.min(100, rawValue));

      const scaleLabel = config2.scaleLabel ?? config2.label ?? config2.labels?.[0] ?? '';

      return {
        ...getDarkThemeConfig(config2.title),
        tooltip: {
          ...getDarkThemeConfig().tooltip,
          trigger: 'item',
          formatter: '{b}: {c}%',
        },
        title: {
          text: wrapText(String(config2.title ?? '').toUpperCase(), 28),
          left: 16,
          top: 14,
          textStyle: {
            color: darkThemeColors.textGold,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 22,
            align: 'left',
          },
        },
        // title: {
        //   text: wrapText(String(config2.title ?? '').toUpperCase(), 28),
        //   left: 16,
        //   top: 14,
        //   textStyle: {
        //     color: darkThemeColors.textGold,
        //     fontSize: 10,
        //     fontWeight: 700,
        //     lineHeight: 14,
        //     align: 'left',
        //   },
        // },
        xAxis: {
          show: false,
        },
        yAxis: {
          show: false,
        },

        series: [
          {
            type: 'pie',
            center: ['50%', '56%'],
            radius: ['52%', '68%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'center',
              formatter: () => {
                return `{value|${displayPercent}%}\n{label|${wrapText(scaleLabel, 16)}}`;
              },
              rich: {
                value: {
                  color: darkThemeColors.textGold,
                  fontSize: 26,
                  fontWeight: 700,
                  lineHeight: 34,
                  align: 'center',
                },
                label: {
                  color: darkThemeColors.textMuted,
                  fontSize: 12,
                  lineHeight: 16,
                  align: 'center',
                },
              },
            },
            labelLine: { show: false },
            data: [
              {
                name: scaleLabel || 'Значение',
                value: chartPercent,
                itemStyle: { color: darkThemeColors.borderGold },
              },
              {
                name: 'Остаток',
                value: Math.max(0, 100 - chartPercent),
                itemStyle: { color: 'rgba(200, 139, 70, 0.14)' },
              },
            ]
          },
        ],
      } satisfies EChartsOption;
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
      } satisfies EChartsOption;
    }

    case 'combo-chart': {
      const config2 = config as any;
      let series: SeriesOption[] = [];

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
