# Dashboards Builder - JSON-конфигурируемая система для построения дашбордов

**Мощный React MVP** для построения интерактивных дашбордов с графиками из JSON-конфига через Apache ECharts.

## 🚀 Возможности

- ✅ **11 типов диаграмм** — от простых значений до комбинированных графиков
- ✅ **Гибкая сетка компонентов** — горизонтальное и вертикальное группирование
- ✅ **Вкладки** — организация диаграмм по категориям
- ✅ **Динамическая загрузка данных** — из mock.json или API
- ✅ **Фильтрация по месяцам** — выбор диапазонов дат через UI
- ✅ **Dark theme** — современный интерфейс с золотыми акцентами
- ✅ **Hot Module Replacement** — изменения применяются мгновенно
- ✅ **Docker** — контейнеризация для dev и production

## 📦 Стек

- **React 19** — фреймворк
- **TypeScript 5.8** — типизация
- **Apache ECharts 6.0** — диаграммы
- **Vite 7.1** — сборка и HMR
- **Docker** — контейнеризация
- **Nginx** — production сервер

## 🎯 Быстрый старт

### Локально

```bash
# Установка зависимостей
npm install

# Разработка (с HMR)
npm run dev

# Сборка для production
npm run build

# Preview собранного проекта
npm run preview
```

### Docker

```bash
# Разработка (Vite на http://localhost:5173)
docker compose up dev

# Production (Nginx на http://localhost:3000)
docker compose up web
```

## 📊 Поддерживаемые типы диаграмм

| Тип | Описание | Пример |
|-----|---------|--------|
| `single-value` | Одно числовое значение | Текущий баланс: 125 000₽ |
| `summary` | Значение + изменение | Остаток: 125 000₽ (↑ 25 000) |
| `bar-chart` | Столбчатая диаграмма | Продажи по месяцам |
| `stacked-bar-chart` | Столбцы с накоплением | Структура расходов |
| `line-chart` | Линейный график | Тренд продаж |
| `area-chart` | График с заливкой | Накопление капитала |
| `pie-chart` | Круговая диаграмма | Доля рынка |
| `doughnut-chart` | Кольцевая диаграмма | Распределение ресурсов |
| `pie-3d-chart` | 3D круговая диаграмма | Структура доходов |
| `combo-chart` | Комбинированная | Продажи и прибыль |
| `scatter-chart` | Диаграмма рассеивания | Корреляция данных |

📖 **Полная документация** всех типов: [README_CHARTS.md](README_CHARTS.md)

## 🏗️ Структура проекта

```
src/
├── App.tsx              # Главный компонент с layout renderer
├── ChartRenderer.tsx    # Отображение диаграмм и компонентов
├── TabsBlock.tsx        # Компонент вкладок
├── MonthSelector.tsx    # Выбор месяцев
├── chartConfigToOption.ts # Преобразование конфига в ECharts option
├── dataLoader.ts        # Загрузка и обработка данных
├── types.ts            # TypeScript типы
├── styles.css          # Темизация и стили
├── main.tsx            # Точка входа
└── config/
    └── chartConfig.json # Конфигурация дашборда
└── mock/
    └── mock.json       # Тестовые данные
```

## ⚙️ Конфигурация

### Переменные окружения (.env)

```env
VITE_USE_MOCK=true          # true = mock.json, false = API
VITE_API_URL=http://api.local/data  # URL для API
```

### Структура chartConfig.json

```json
{
  "layout": [
    {
      "type": "chart",
      "config": {
        "title": "Название",
        "type": "bar-chart",
        "dataSource": {
          "xField": "общее.месяц",
          "yField": "ДДС.Остаток денег на конец месяца"
        }
      }
    }
  ]
}
```

### Типы компонентов макета

#### `chart` — Одна диаграмма

```json
{
  "type": "chart",
  "config": { /* конфиг диаграммы */ }
}
```

#### `tabs-block` — Вкладки с диаграммами

```json
{
  "type": "tabs-block",
  "title": "Аналитика",
  "tabs": [
    {
      "name": "Вкладка 1",
      "charts": [ /* массив конфигов */ ]
    }
  ]
}
```

#### `group-horizontal` — Горизонтальная сетка

```json
{
  "type": "group-horizontal",
  "title": "Ключевые метрики",
  "items": [ /* массив компонентов */ ]
}
```

#### `group-vertical` — Вертикальное группирование

```json
{
  "type": "group-vertical",
  "title": "Финансовый отчёт",
  "items": [ /* массив компонентов */ ]
}
```

## 🔄 Работа с данными

### Источники данных

- **Mock:** `src/mock/mock.json` (по умолчанию)
- **API:** URL из переменной `VITE_API_URL`

### Dot-notation для доступа к полям

```json
{
  "dataSource": {
    "xField": "общее.месяц",           // data.общее.месяц
    "yField": "ДДС.Остаток денег"      // data.ДДС["Остаток денег"]
  }
}
```

### Фильтрация по месяцам

UI месяца-селектора автоматически загружает месяцы из `data['общее']['месяц']` и позволяет выбрать диапазон для фильтрации.

## 🎨 Темизация

Все цвета контролируются CSS переменными в `styles.css`:

```css
--bg-dark: #030810          /* Фон */
--text-gold: #ffd700        /* Золотой текст */
--text-light: #ffffff       /* Белый текст */
--blue-light: #5ab3ff       /* Голубой акцент */
```

## 🌐 Docker

### Development

```bash
docker compose up dev --build
```

- Node 20-Alpine
- Vite dev server на :5173
- Hot Module Replacement включен
- Source code mounted для горячей перезагрузки

### Production

```bash
docker compose up web
```

- Multi-stage build (Node builder → Nginx)
- Optimized bundle
- Nginx на :3000
- Готово к deployment

## 📝 API данных

Ожидаемый формат `mock.json` или ответа API:

```json
{
  "общее": {
    "месяц": ["Янв", "Фев", "Мар", ...],
    "месяцы": ["2024-01", "2024-02", ...]
  },
  "ДДС": {
    "Остаток денег на конец месяца": [100000, 125000, ...],
    "Поступления по ОД": [50000, 60000, ...],
    "Зарплата": [30000, 35000, ...]
  }
}
```

## 🔧 Разработка

### Добавление нового типа диаграммы

1. **types.ts** — добавить новый `export type`
2. **chartConfigToOption.ts** — добавить `case` в switch
3. **README_CHARTS.md** — документировать

### Форматирование

```bash
npm run lint      # Проверка с ESLint
npm run format    # Форматирование (при наличии prettier)
```

## 📚 Примеры

### Простой дашборд с 3 метриками

```json
{
  "layout": [
    {
      "type": "group-horizontal",
      "items": [
        {
          "type": "chart",
          "config": {
            "type": "single-value",
            "title": "Доход",
            "value": 250000,
            "unit": "₽"
          }
        },
        {
          "type": "chart",
          "config": {
            "type": "single-value",
            "title": "Расход",
            "value": 180000,
            "unit": "₽"
          }
        },
        {
          "type": "chart",
          "config": {
            "type": "single-value",
            "title": "Прибыль",
            "value": 70000,
            "unit": "₽"
          }
        }
      ]
    },
    {
      "type": "chart",
      "config": {
        "type": "bar-chart",
        "title": "Доход по месяцам",
        "dataSource": {
          "xField": "общее.месяц",
          "yField": "ДДС.Остаток денег на конец месяца"
        }
      }
    }
  ]
}
```

## 📄 Лицензия

MIT

## 🐛 Troubleshooting

**Q: HMR не работает в Docker dev контейнере**  
A: Убедитесь, что `--host 0.0.0.0` передана в Vite и порт 5173 открыт

**Q: Диаграмма не отображается**  
A: Проверьте пути в `dataSource` и структуру `mock.json`

**Q: API возвращает 404**  
A: Установите `VITE_USE_MOCK=true` или проверьте `VITE_API_URL`

---

Создано с ❤️ для построения красивых дашбордов из JSON



```json
{
  "title": "Apple pies eaten",
  "type": "line-chart",
  "x": ["01.01.26", "02.01.26", "03.01.26", "04.01.26"],
  "y": [3, 5, 2, 6]
}
```

#### Поля

- `x: (string | number)[]` — подписи по оси X;
- `y: number[]` — значения по оси Y.

#### Ограничения

- `x.length` должен совпадать с `y.length`.

---

### 2. `bar-chart`

Столбчатый график.

#### Конфиг

```json
{
  "title": "Revenue by month",
  "type": "bar-chart",
  "x": ["Jan", "Feb", "Mar", "Apr"],
  "y": [120, 210, 180, 260]
}
```

#### Поля

- `x: (string | number)[]` — категории по оси X;
- `y: number[]` — значения столбцов.

#### Ограничения

- `x.length` должен совпадать с `y.length`.

---

### 3. `pie-chart`

Круговая диаграмма.

#### Конфиг

```json
{
  "title": "Traffic sources",
  "type": "pie-chart",
  "labels": ["Direct", "Search", "Ads", "Referral"],
  "values": [45, 30, 15, 10]
}
```

#### Поля

- `labels: string[]` — названия сегментов;
- `values: number[]` — значения сегментов.

#### Ограничения

- `labels.length` должен совпадать с `values.length`.

---

### 4. `scatter-chart`

Точечный график.

#### Конфиг

```json
{
  "title": "Height vs Weight",
  "type": "scatter-chart",
  "x": [160, 165, 170, 175, 180],
  "y": [55, 62, 68, 74, 81]
}
```

#### Поля

- `x: number[]` — координаты X;
- `y: number[]` — координаты Y.

#### Ограничения

- `x.length` должен совпадать с `y.length`.

---

## Где добавлять новые типы

### Новый тип данных

Добавляется в `src/types.ts`.

### Правила преобразования в ECharts

Добавляются в `src/chartConfigToOption.ts`.

### Рендер

Компонент рендера находится в `src/ChartRenderer.tsx`.

## Структура проекта

```text
src/
  App.tsx
  ChartRenderer.tsx
  chartConfigToOption.ts
  main.tsx
  styles.css
  types.ts
```

## Как это работает

1. Пользователь вставляет JSON в textarea.
2. JSON парсится в React.
3. Конфиг преобразуется в `EChartsOption`.
4. `echarts-for-react` рендерит график.

## Дальше можно расширить

- несколько серий в одном графике;
- area chart;
- donut chart;
- stacked bar;
- кастомные цвета;
- легенду и дополнительные настройки осей;
- загрузку JSON из файла или API.
