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
            <div className="group-horizontal-block">
                {item.title && <div className="group-horizontal-title">{item.title}</div>}

                <div
                    className="group-horizontal"
                    style={{ "--group-items": item.items.length } as React.CSSProperties}
                >
                    {item.items.map((subItem, idx) => (
                        <div key={idx} className="group-horizontal-item">
                            <LayoutRenderer item={subItem} />
                        </div>
                    ))}
                </div>
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