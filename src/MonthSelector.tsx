import React, { useEffect, useState } from 'react';
import type { ChartConfig } from './types';
import mockData from './mock/mock.json';

type MonthSelectorProps = {
    onMonthsChange: (startMonthIndex: number, endMonthIndex: number) => void;
};

export const MonthSelector: React.FC<MonthSelectorProps> = ({ onMonthsChange }) => {
    const [months, setMonths] = useState<string[]>([]);
    const [startMonth, setStartMonth] = useState<number>(34); // 11.25
    const [endMonth, setEndMonth] = useState<number>(35);    // 12.25

    useEffect(() => {
        // Load months from mock data
        const loadMonths = () => {
            try {
                const loadedMonths = mockData?.['общее']?.['месяц'] || [];
                setMonths(loadedMonths);
                // Call handler with default values on first load
                if (loadedMonths.length > 0) {
                    onMonthsChange(34, 35);
                }
            } catch (err) {
                console.error('Failed to load months:', err);
            }
        };

        loadMonths();
    }, [onMonthsChange]);

    const handleStartMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const idx = parseInt(e.target.value);
        setStartMonth(idx);
        onMonthsChange(idx, endMonth);
    };

    const handleEndMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const idx = parseInt(e.target.value);
        setEndMonth(idx);
        onMonthsChange(startMonth, idx);
    };

    return (
        <div className="month-selector">
            <div className="month-selector-group">
                <label className="month-selector-label">Исходный месяц:</label>
                <select value={startMonth} onChange={handleStartMonthChange} className="month-selector-input">
                    {months.map((month, idx) => (
                        <option key={idx} value={idx}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>

            <div className="month-selector-group">
                <label className="month-selector-label">Основной месяц:</label>
                <select value={endMonth} onChange={handleEndMonthChange} className="month-selector-input">
                    {months.map((month, idx) => (
                        <option key={idx} value={idx}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
