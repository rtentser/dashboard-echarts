import React, { useState, useEffect, useCallback } from "react";
import { ChartRenderer } from "./ChartRenderer";
import { TabsBlock } from "./TabsBlock";
import { MonthSelector } from "./MonthSelector";
import { ChartConfig } from "./types";
import { loadPageData, LayoutComponent } from "./dataLoader";
import pageConfig from "./config/chartConfig.json";
import "./styles.css";

type LayoutItem = 
  | { type: 'chart'; data: ChartConfig }
  | { type: 'tabs-block'; title?: string; tabs: Array<{ name: string; charts: ChartConfig[] }> }
  | { type: 'group-horizontal'; title?: string; items: LayoutItem[] }
  | { type: 'group-vertical'; title: string; items: LayoutItem[] };

// Recursive layout renderer component
const LayoutRenderer: React.FC<{ item: LayoutItem }> = ({ item }) => {
  if (item.type === 'chart') {
    return (
      <div style={{ marginBottom: "30px" }}>
        <div className="chart-wrapper">
          <ChartRenderer config={item.data} />
        </div>
      </div>
    );
  }

  if (item.type === 'tabs-block') {
    return (
      <div style={{ marginBottom: "30px" }}>
        <TabsBlock title={item.title} tabs={item.tabs} />
      </div>
    );
  }

  if (item.type === 'group-horizontal') {
    return (
      <div className="group-horizontal">
        {item.title && <div style={{ width: '100%', marginBottom: '10px' }} className="group-horizontal-title">{item.title}</div>}
        {item.items.map((subItem, idx) => (
          <div key={idx} style={{ flex: '1 1 auto', minWidth: '300px' }}>
            <LayoutRenderer item={subItem} />
          </div>
        ))}
      </div>
    );
  }

  if (item.type === 'group-vertical') {
    return (
      <div className="group-vertical">
        <div className="group-vertical-title">{item.title}</div>
        {item.items.map((subItem, idx) => (
          <div key={idx}>
            <LayoutRenderer item={subItem} />
          </div>
        ))}
      </div>
    );
  }

  return <div>Unknown layout type</div>;
};

function App() {
  const [layoutItems, setLayoutItems] = useState<LayoutItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [startMonthIndex, setStartMonthIndex] = useState<number>(34); // 11.25
  const [endMonthIndex, setEndMonthIndex] = useState<number>(35);    // 12.25

  useEffect(() => {
    const fetchData = async (config: any) => {
      try {
        const items = await loadPageData(config, { start: startMonthIndex, end: endMonthIndex });
        setLayoutItems(items as LayoutItem[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    fetchData(pageConfig);

    // Watch for changes to chartConfig.json
    if (import.meta.hot) {
      import.meta.hot.accept("./config/chartConfig.json", (newModule: any) => {
        if (newModule) {
          const newConfig = newModule.default;
          fetchData(newConfig);
        }
      });

      // Watch for changes to mock.json
      import.meta.hot.accept("./mock/mock.json", () => {
        fetchData(pageConfig);
      });
    }
  }, [startMonthIndex, endMonthIndex]);

  const handleMonthsChange = useCallback((start: number, end: number) => {
    setStartMonthIndex(start);
    setEndMonthIndex(end);
  }, []);

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#e53935" }}>
        <h2>Error:</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (layoutItems.length === 0) {
    return <div style={{ padding: "20px", color: "var(--text-muted)" }}>Loading...</div>;
  }

  return (
    <div>
      <h1>Решения и результат</h1>

      <MonthSelector 
        onMonthsChange={handleMonthsChange}
      />

      {layoutItems.map((item, index) => (
        <LayoutRenderer key={index} item={item} />
      ))}
    </div>
  );
}

export default App;