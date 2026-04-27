# ECharts JSON MVP

Минимальный React MVP для построения графиков из JSON-конфига через Apache ECharts.

## Что умеет

- принимает JSON-конфиг;
- определяет тип графика по полю `type`;
- преобразует конфиг в `EChartsOption`;
- сразу показывает превью графика в React UI.

## Стек

- React
- TypeScript
- Apache ECharts
- echarts-for-react
- Vite

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Общая идея конфига

У каждого графика есть поле:

- `title` — заголовок графика, необязательное;
- `type` — тип графика;
- остальные поля зависят от типа.

---

## Доступные типы графиков

### 1. `line-chart`

Линейный график.

#### Конфиг

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
