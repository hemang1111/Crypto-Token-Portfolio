import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import { CHART_COLORS } from "../config";
const PortfolioDonutChart = () => {
    const { selectedTokens } = useSelector((state) => state.token);
    const total = selectedTokens?.reduce((acc, item) => acc + item.value, 0) || 0;
    const data = useMemo(() => {
        const tempArray = JSON.parse(JSON.stringify(selectedTokens || []));
        tempArray.forEach((token) => {
            token.name = `${token.name} (${token.symbol})`;
        });
        tempArray.sort((a, b) => b.value - a.value);
        return tempArray;
    }, [selectedTokens]);
    const legendItems = useMemo(() => data.map((d, i) => ({
        name: d.name,
        value: d.value,
        color: CHART_COLORS[i % CHART_COLORS.length],
    })), [data]);
    return (_jsxs("div", { className: "\r\n        flex flex-col md:flex-row \r\n        items-center md:items-start \r\n        justify-center md:justify-between \r\n        gap-3 w-full h-auto md:h-[150px]\r\n      ", children: [_jsx("div", { className: "\r\n          w-[190px] h-[190px] md:h-full \r\n          flex items-center justify-center\r\n        ", children: _jsx(ResponsiveContainer, { width: "90%", height: "100%", children: _jsx(PieChart, { margin: { left: 0, right: 0, top: 0, bottom: 0 }, children: _jsx(Pie, { data: data, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", innerRadius: 30, outerRadius: 70, paddingAngle: 2, label: false, children: data.map((entry, index) => (_jsx(Cell, { fill: CHART_COLORS[index % CHART_COLORS.length] }, `cell-${index}`))) }) }) }) }), _jsx("div", { className: "\r\n          flex-1 w-full md:w-auto \r\n          h-auto md:h-full \r\n          overflow-hidden\r\n        ", children: _jsx("div", { className: "\r\n            overflow-y-auto pl-2 scrollbar-hide \r\n            max-h-[250px] md:max-h-full\r\n          ", children: _jsx("ul", { className: "list-none m-0 p-0 text-xs", children: legendItems.map((item) => {
                            const percent = total
                                ? ((item.value / total) * 100).toFixed(1)
                                : "0.0";
                            return (_jsxs("li", { className: "flex justify-between items-center mb-3", children: [_jsx("span", { style: { color: item.color }, children: item.name }), _jsx("span", { className: "text-[var(--gray-100)]", children: `${percent}%` })] }, item.name));
                        }) }) }) })] }));
};
export default PortfolioDonutChart;
