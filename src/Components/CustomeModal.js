import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
const CustomeModal = ({ isOpen, onClose, children }) => {
    if (!isOpen)
        return null; // don't render anything if modal is closed
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-40", onClick: onClose }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-[rgba(39,39,42,1)] rounded-xl shadow-lg max-w-lg w-full mx-4 p-6 relative", onClick: (e) => e.stopPropagation(), children: [children, _jsx("button", { className: "absolute top-3 right-3 text-white text-lg font-bold", onClick: onClose, children: "\u00D7" })] }) })] }));
};
export default CustomeModal;
