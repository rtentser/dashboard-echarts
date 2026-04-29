import React from "react";
import { ChartRenderer } from "./ChartRenderer";
import { TabsBlock } from "./TabsBlock";
import type { ChartConfig } from "./types";

export type LayoutItem =
    | { type: "chart"; data: ChartConfig }
    | { type: "tabs-block"; title?: string; tabs: Array<{ name: string; items: LayoutItem[] }> }
    | { type: "group-horizontal"; title?: string; items: LayoutItem[] }
    | { type: "group-vertical"; title: string; items: LayoutItem[] };

export const LayoutRenderer: React.FC<{ item: LayoutItem }> = ({ item }) => {
    if (item.type === "chart") {
        return (
            <div style={{ marginBottom: "30px" }}>
                <div className="chart-wrapper">
                    <ChartRenderer config={item.data} />
                </div>
            </div>
        );
    }

    if (item.type === "tabs-block") {
        return (
            <div style={{ marginBottom: "30px" }}>
                <TabsBlock title={item.title} tabs={item.tabs} />
            </div>
        );
    }

    if (item.type === "group-horizontal") {
        return (
            <div className="group-horizontal">
                {item.title && <div className="group-horizontal-title">{item.title}</div>}
                {item.items.map((subItem, idx) => (
                    <div key={idx} style={{ flex: "1 1 auto", minWidth: "300px" }}>
                        <LayoutRenderer item={subItem} />
                    </div>
                ))}
            </div>
        );
    }

    if (item.type === "group-vertical") {
        return (
            <div className="group-vertical">
                <div className="group-vertical-title">{item.title}</div>
                {item.items.map((subItem, idx) => (
                    <LayoutRenderer key={idx} item={subItem} />
                ))}
            </div>
        );
    }

    return <div>Unknown layout type</div>;
};