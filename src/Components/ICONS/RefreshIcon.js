import { jsx as _jsx } from "react/jsx-runtime";
function RefreshIcon(props) {
    return (_jsx("span", { className: `material-symbols-outlined text-lg  ${props.rotating ? 'animate-spin' : ''} ${props.class}`, children: "autorenew" }));
}
export default RefreshIcon;
