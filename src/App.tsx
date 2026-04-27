import { useState, useEffect } from "react";
import { ChartRenderer } from "./ChartRenderer";
import { TabsBlock } from "./TabsBlock";
import { ChartConfig } from "./types";
import { loadPageData } from "./dataLoader";
import pageConfig from "./config/chartConfig.json";
import "./styles.css";

type LayoutItem = 
  | { type: 'chart'; data: ChartConfig }
  | { type: 'tabs-block'; title?: string; tabs: Array<{ name: string; charts: ChartConfig[] }> };

function App() {
  const [layoutItems, setLayoutItems] = useState<LayoutItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (config: any) => {
      try {
        const items = await loadPageData(config);
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

      {layoutItems.map((item, index) => {
        if (item.type === 'chart') {
          return (
            <div key={index} style={{ marginBottom: "30px" }}>
              <div className="chart-wrapper">
                <ChartRenderer config={item.data} />
              </div>
            </div>
          );
        }

        if (item.type === 'tabs-block') {
          return (
            <div key={index}>
              <TabsBlock title={item.title} tabs={item.tabs} />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

export default App;