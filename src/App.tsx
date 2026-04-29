import { useState, useEffect, useCallback } from "react";
import { LayoutRenderer, type LayoutItem } from "./LayoutRenderer";
import { MonthSelector } from "./MonthSelector";
import { loadPageData } from "./dataLoader";
import pageConfig from "./config/chartConfig.json";
import "./styles.css";


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