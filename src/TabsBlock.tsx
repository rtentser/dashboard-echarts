import { useState } from "react";
import { ChartRenderer } from "./ChartRenderer";
import type { ChartConfig } from "./types";

interface TabsBlockProps {
  title?: string;
  tabs: Array<{
    name: string;
    charts: ChartConfig[];
  }>;
}

export function TabsBlock({ title, tabs }: TabsBlockProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: "30px" }}>
      {title && <h2>{title}</h2>}

      {/* Tabs Navigation */}
      <div className="tabs-nav">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`${activeTab === index ? "active" : ""}`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tabs-content">
        {tabs[activeTab]?.charts.map((config, index) => (
          <div key={index} className="chart-wrapper">
            <ChartRenderer config={config} />
          </div>
        ))}
      </div>
    </div>
  );
}
