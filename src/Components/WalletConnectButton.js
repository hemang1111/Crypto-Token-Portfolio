import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import WalletIcon from './ICONS/WalletIcon';
export function WalletConnectButton(props) {
    return (_jsx(ConnectButton.Custom, { children: ({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted, }) => {
            const ready = mounted && authenticationStatus !== "loading";
            const connected = ready &&
                account &&
                chain &&
                (!authenticationStatus || authenticationStatus === "authenticated");
            return (_jsx("div", { ...(!ready && {
                    "aria-hidden": true,
                    style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                    },
                }), children: (() => {
                    if (!connected) {
                        return (_jsxs("button", { onClick: openConnectModal, className: "flex items-center rounded-[100px] bg-[var(--green-accent)] text-[var(--dark-base)] text-sm font-medium  px-2 py-1 sm:px-4 py-2 sm:py-1", children: [_jsx(WalletIcon, {}), _jsx("span", { className: "ml-1", children: "Connect Wallet" })] }));
                    }
                    if (chain.unsupported) {
                        return (_jsx("button", { onClick: openChainModal, className: "px-4 py-2 bg-red-600 text-white rounded-lg", children: "Wrong Network" }));
                    }
                    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { onClick: openChainModal, className: "flex items-center bg-gray-800 text-white px-3 py-2 rounded-md", children: [chain.hasIcon && (_jsx("div", { className: "mr-2 w-5 h-5", children: chain.iconUrl && (_jsx("img", { alt: chain.name ?? "Chain icon", src: chain.iconUrl, style: { width: 20, height: 20, borderRadius: 999 } })) })), chain.name] }), _jsxs("button", { onClick: openAccountModal, className: "px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700", children: [account.displayName, account.displayBalance
                                        ? ` (${account.displayBalance})`
                                        : ""] })] }));
                })() }));
        } }));
}
