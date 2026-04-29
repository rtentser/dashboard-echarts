import { useState } from "react";
import { LayoutRenderer, type LayoutItem } from "./LayoutRenderer";

interface TabsBlockProps {
  title?: string;
  tabs: Array<{
    name: string;
    items: LayoutItem[];
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
        {tabs[activeTab]?.items.map((item, index) => (
          <div key={index} className="chart-wrapper">
            <LayoutRenderer key={index} item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
