import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
const NoData = ({ message = "No data found", image = "https://cdn-icons-png.flaticon.com/512/4076/4076549.png", // default placeholder image
height = "h-32", width = "w-32", }) => {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center text-center py-8 text-gray-400", children: [_jsx("img", { src: image, alt: "No data", className: `${height} ${width} mb-4 opacity-80` }), _jsx("p", { className: "text-sm font-medium", children: message })] }));
};
export default NoData;
