# Dashboards Builder

JSON-конфигурируемая система для построения интерактивных дашбордов на React и Apache ECharts.

Проект позволяет описывать структуру дашборда в JSON-конфиге: диаграммы, группы, вкладки, источники данных и связи с полями из `mock.json` или API.

---

## Возможности

- 11 типов диаграмм: от простых метрик до комбинированных графиков.
- Поддержка layout-компонентов: вкладки, горизонтальные и вертикальные группы.
- Динамическая загрузка данных из `mock.json` или API.
- Поддержка dot-notation для обращения к вложенным данным.
- Поддержка нескольких линий и столбцов в `line-chart`, `bar-chart` и `combo-chart`.
- Фильтрация по месяцам через UI.
- Dark theme с CSS-переменными.
- Docker-конфигурация для разработки и production.

---

## Стек

- React 19
- TypeScript 5.8
- Apache ECharts 6.0
- Vite 7.1
- Docker
- Nginx

---

## Быстрый старт

### Локально

```bash
npm install
npm run dev
```

Сборка production-версии:

```bash
npm run build
```

Preview production-сборки:

```bash
npm run preview
```

---

## Docker

### Development

```bash
docker compose up dev
```

Dev-сервер Vite будет доступен на:

```text
http://localhost:5173
```

### Production

```bash
docker compose up web
```

Production-версия через Nginx будет доступна на:

```text
http://localhost:3000
```

---

## Переменные окружения

Создай `.env` или используй переменные окружения при запуске.

```env
VITE_USE_MOCK=true
VITE_API_URL=http://api.local/data
```

Поля:

| Переменная | Описание |
|---|---|
| `VITE_USE_MOCK` | `true` — использовать `src/mock/mock.json`; `false` — загружать данные из API |
| `VITE_API_URL` | URL API, если `VITE_USE_MOCK=false` |

---

## Структура проекта

```text
src/
├── App.tsx
├── ChartRenderer.tsx
├── TabsBlock.tsx
├── MonthSelector.tsx
├── chartConfigToOption.ts
├── dataLoader.ts
├── types.ts
├── styles.css
├── main.tsx
├── config/
│   └── chartConfig.json
└── mock/
    └── mock.json
```

Основные файлы:

| Файл | Назначение |
|---|---|
| `src/config/chartConfig.json` | JSON-конфигурация дашборда |
| `src/mock/mock.json` | Mock-данные |
| `src/dataLoader.ts` | Загрузка и подготовка данных |
| `src/chartConfigToOption.ts` | Преобразование конфигов в ECharts options |
| `src/ChartRenderer.tsx` | Рендер диаграмм и layout-компонентов |
| `src/TabsBlock.tsx` | Рендер вкладок |
| `src/types.ts` | TypeScript-типы диаграмм |

---

## Конфигурация дашборда

Главный конфиг находится в:

```text
src/config/chartConfig.json
```

Корневая структура:

```json
{
  "layout": [
    {
      "type": "chart",
      "config": {
        "title": "Поступления по ОД",
        "type": "bar-chart",
        "dataSource": {
          "xField": "общее.месяц",
          "yField": "ДДС.Поступления по ОД"
        }
      }
    }
  ]
}
```

---

## Layout-компоненты

### `chart`

Одна диаграмма.

```json
{
  "type": "chart",
  "config": {
    "title": "Поступления по ОД",
    "type": "bar-chart",
    "dataSource": {
      "xField": "общее.месяц",
      "yField": "ДДС.Поступления по ОД"
    }
  }
}
```

---

### `group-horizontal`

Горизонтальная группа компонентов.

```json
{
  "type": "group-horizontal",
  "title": "Ключевые метрики",
  "items": [
    {
      "type": "chart",
      "config": {
        "title": "Доход",
        "type": "single-value",
        "value": 250000,
        "unit": "₽"
      }
    },
    {
      "type": "chart",
      "config": {
        "title": "Расход",
        "type": "single-value",
        "value": 180000,
        "unit": "₽"
      }
    }
  ]
}
```

---

### `group-vertical`

Вертикальная группа компонентов.

```json
{
  "type": "group-vertical",
  "title": "Финансовый отчёт",
  "items": [
    {
      "type": "chart",
      "config": {
        "title": "Поступления",
        "type": "bar-chart",
        "dataSource": {
          "xField": "общее.месяц",
          "yField": "ДДС.Поступления по ОД"
        }
      }
    },
    {
      "type": "chart",
      "config": {
        "title": "Выбытия",
        "type": "bar-chart",
        "dataSource": {
          "xField": "общее.месяц",
          "yField": "ДДС.Выбытия по ОД"
        }
      }
    }
  ]
}
```

---

### `tabs-block`

Блок с вкладками.

Актуальный формат использует `items` внутри каждой вкладки.

```json
{
  "type": "tabs-block",
  "title": "Финансовые показатели",
  "tabs": [
    {
      "name": "Денежный поток",
      "items": [
        {
          "type": "chart",
          "config": {
            "title": "Поступления по ОД",
            "type": "bar-chart",
            "dataSource": {
              "xField": "общее.месяц",
              "yField": "ДДС.Поступления по ОД"
            }
          }
        }
      ]
    },
    {
      "name": "P&L",
      "items": []
    }
  ]
}
```

Неактуальный формат с `charts` использовать не нужно:

```json
{
  "tabs": [
    {
      "name": "Денежный поток",
      "charts": []
    }
  ]
}
```

---

## Поддерживаемые типы диаграмм

| Тип | Описание |
|---|---|
| `single-value` | Одно значение |
| `summary` | Текущее значение и изменение |
| `bar-chart` | Столбчатая диаграмма |
| `stacked-bar-chart` | Столбчатая диаграмма с накоплением |
| `line-chart` | Линейный график |
| `area-chart` | Линейный график с заливкой |
| `pie-chart` | Круговая диаграмма |
| `doughnut-chart` | Кольцевая диаграмма |
| `pie-3d-chart` | Круговая диаграмма с 3D-эффектом |
| `combo-chart` | Комбинированная диаграмма: столбцы + линии |
| `scatter-chart` | Диаграмма рассеивания |

Подробная документация по всем типам диаграмм находится в:

```text
README_CHARTS.md
```

---

## Работа с данными

Диаграммы могут получать данные через `dataSource`.

Поля в `dataSource` указываются через dot-notation.

```json
{
  "dataSource": {
    "xField": "общее.месяц",
    "yField": "ДДС.Остаток денег на конец месяца"
  }
}
```

Это означает:

```ts
data["общее"]["месяц"]
data["ДДС"]["Остаток денег на конец месяца"]
```

---

## Ожидаемый формат данных

Пример структуры `mock.json` или ответа API:

```json
{
  "общее": {
    "месяц": ["Янв", "Фев", "Мар"],
    "месяцы": ["2024-01", "2024-02", "2024-03"]
  },
  "ДДС": {
    "Остаток денег на конец месяца": [100000, 125000, 140000],
    "Поступления по ОД": [50000, 60000, 70000],
    "Выбытия по ОД": [30000, 35000, 40000],
    "Комфортные коридоры по остаткам денег": [90000, 100000, 110000]
  }
}
```

---

## Примеры диаграмм

### `single-value`

```json
{
  "title": "Текущий остаток денежных средств",
  "type": "single-value",
  "value": 19827961,
  "unit": "₽"
}
```

---

### `summary`

```json
{
  "title": "Остаток денег",
  "type": "summary",
  "dataSource": {
    "valueField": "ДДС.Остаток денег на конец месяца"
  },
  "unit": "₽"
}
```

---

### `bar-chart`

Один ряд столбцов:

```json
{
  "title": "Поступления по ОД",
  "type": "bar-chart",
  "dataSource": {
    "xField": "общее.месяц",
    "yField": "ДДС.Поступления по ОД"
  }
}
```

Несколько рядов столбцов:

```json
{
  "title": "Поступления и выбытия",
  "type": "bar-chart",
  "dataSource": {
    "xField": "общее.месяц",
    "yFields": [
      {
        "name": "Поступления по ОД",
        "field": "ДДС.Поступления по ОД"
      },
      {
        "name": "Выбытия по ОД",
        "field": "ДДС.Выбытия по ОД"
      }
    ]
  }
}
```

---

### `line-chart`

Одна линия:

```json
{
  "title": "Остаток денег",
  "type": "line-chart",
  "dataSource": {
    "xField": "общее.месяц",
    "yField": "ДДС.Остаток денег на конец месяца"
  }
}
```

Несколько линий:

```json
{
  "title": "Денежный поток",
  "type": "line-chart",
  "dataSource": {
    "xField": "общее.месяц",
    "yFields": [
      {
        "name": "Поступления по ОД",
        "field": "ДДС.Поступления по ОД"
      },
      {
        "name": "Выбытия по ОД",
        "field": "ДДС.Выбытия по ОД"
      },
      {
        "name": "Остаток денег",
        "field": "ДДС.Остаток денег на конец месяца"
      }
    ]
  }
}
```

---

### `combo-chart`

Комбинированная диаграмма: столбцы и линии на одном графике.

```json
{
  "title": "Остаток денег на конец месяца",
  "type": "combo-chart",
  "dataSource": {
    "xField": "общее.месяц",
    "barFields": [
      {
        "name": "Остаток денег",
        "field": "ДДС.Остаток денег на конец месяца"
      }
    ],
    "lineFields": [
      {
        "name": "Комфортные коридоры",
        "field": "ДДС.Комфортные коридоры по остаткам денег"
      }
    ]
  }
}
```

Несколько столбцов и несколько линий:

```json
{
  "title": "Остаток денег и коридоры",
  "type": "combo-chart",
  "dataSource": {
    "xField": "общее.месяц",
    "barFields": [
      {
        "name": "Остаток денег",
        "field": "ДДС.Остаток денег на конец месяца"
      },
      {
        "name": "Поступления по ОД",
        "field": "ДДС.Поступления по ОД"
      }
    ],
    "lineFields": [
      {
        "name": "Комфортные коридоры",
        "field": "ДДС.Комфортные коридоры по остаткам денег"
      },
      {
        "name": "Общий денежный поток",
        "field": "ДДС.Общий денежный поток"
      }
    ]
  }
}
```

Важно: для `combo-chart` нужно использовать `xField`, `barFields` и `lineFields`.

Неактуальный формат ниже использовать не нужно:

```json
{
  "dataSource": {
    "x": "общее.месяц",
    "bar": "ДДС.Остаток денег на конец месяца",
    "line": "ДДС.Комфортные коридоры по остаткам денег"
  }
}
```

---

### `area-chart`

```json
{
  "title": "Накопление капитала",
  "type": "area-chart",
  "dataSource": {
    "xField": "общее.месяц",
    "yField": "ДДС.Остаток денег на конец месяца"
  }
}
```

---

### `doughnut-chart`

```json
{
  "title": "Выполнение плана по остатку денежных средств",
  "type": "doughnut-chart",
  "scaleLabel": "от месячного плана по остатку Д/С",
  "dataSource": {
    "valueField": "ПДДС.План Выполнения по Остатку денежных средств"
  }
}
```

---

### `pie-chart`

```json
{
  "title": "Распределение доходов",
  "type": "pie-chart",
  "labels": ["Источник A", "Источник B", "Источник C"],
  "values": [30, 45, 25]
}
```

---

### `scatter-chart`

```json
{
  "title": "Корреляция X и Y",
  "type": "scatter-chart",
  "x": [10, 20, 30, 40, 50],
  "y": [5, 15, 25, 35, 45]
}
```

---

## Пример полной конфигурации

```json
{
  "layout": [
    {
      "type": "tabs-block",
      "title": "Финансовые показатели",
      "tabs": [
        {
          "name": "Денежный поток",
          "items": [
            {
              "type": "chart",
              "config": {
                "title": "Сегодня",
                "type": "single-value",
                "value": "27.04.2026"
              }
            },
            {
              "type": "chart",
              "config": {
                "title": "Текущий остаток денежных средств",
                "type": "single-value",
                "value": 19827961,
                "unit": "₽"
              }
            },
            {
              "type": "chart",
              "config": {
                "title": "Остаток денег на конец месяца",
                "type": "combo-chart",
                "dataSource": {
                  "xField": "общее.месяц",
                  "barFields": [
                    {
                      "name": "Остаток денег",
                      "field": "ДДС.Остаток денег на конец месяца"
                    }
                  ],
                  "lineFields": [
                    {
                      "name": "Комфортные коридоры",
                      "field": "ДДС.Комфортные коридоры по остаткам денег"
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          "name": "P&L",
          "items": [
            {
              "type": "chart",
              "config": {
                "title": "Зарплата",
                "type": "bar-chart",
                "dataSource": {
                  "xField": "общее.месяц",
                  "yField": "ДДС.Зарплата"
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Фильтрация по месяцам

UI месяца-селектора автоматически загружает месяцы из:

```ts
data["общее"]["месяц"]
```

и позволяет выбрать диапазон для фильтрации.

Диаграммы, которые используют массивы данных из `dataSource`, должны иметь значения той же длины, что и массив месяцев.

---

## Разработка

### Добавление нового типа диаграммы

1. Добавить TypeScript-тип в `src/types.ts`.
2. Добавить обработку данных в `src/dataLoader.ts`, если диаграмма использует `dataSource`.
3. Добавить преобразование в ECharts option в `src/chartConfigToOption.ts`.
4. Добавить рендеринг или обработку в `src/ChartRenderer.tsx`, если требуется.
5. Обновить `README_CHARTS.md`.

---

## Форматирование и проверка

```bash
npm run lint
npm run build
```

---

## Troubleshooting

### Диаграмма не отображается

Проверь:

- существует ли поле в `mock.json` или ответе API;
- правильно ли указан путь в `dataSource`;
- совпадает ли длина массива X и массива Y;
- используется ли актуальный формат конфига для нужного типа диаграммы.

---

### `Could not find fields: undefined, undefined`

Обычно означает, что диаграмма ожидает `xField` и `yField`, но в конфиге указаны другие поля.

Для `combo-chart` используй такой формат:

```json
{
  "dataSource": {
    "xField": "общее.месяц",
    "barFields": [
      {
        "name": "Остаток денег",
        "field": "ДДС.Остаток денег на конец месяца"
      }
    ],
    "lineFields": [
      {
        "name": "Комфортные коридоры",
        "field": "ДДС.Комфортные коридоры по остаткам денег"
      }
    ]
  }
}
```

А не такой:

```json
{
  "dataSource": {
    "x": "общее.месяц",
    "bar": "ДДС.Остаток денег на конец месяца",
    "line": "ДДС.Комфортные коридоры по остаткам денег"
  }
}
```

---

### `tabs[].charts` не работает

В актуальной структуре вкладки используют `items`.

Неправильно:

```json
{
  "name": "Денежный поток",
  "charts": []
}
```

Правильно:

```json
{
  "name": "Денежный поток",
  "items": []
}
```

---

### API возвращает 404

Проверь:

```env
VITE_USE_MOCK=true
```

или корректность:

```env
VITE_API_URL=http://api.local/data
```
