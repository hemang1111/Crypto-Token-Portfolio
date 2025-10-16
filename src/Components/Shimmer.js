import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const Shimmer = ({ 
//   width = 'w-[100%]',   // default width
height = 'h-5', // default height
 }) => {
    return _jsx("div", { className: `shimmer rounded-md ${height}` });
};
export default Shimmer;
