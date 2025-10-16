import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../redux/tokenSlice';
import { gridPageLimit, getLocalData, safeParseInt, safeParseFloat, toFixedFloat, numberLocale } from '../config';
import NoData from './NoData';
import TokenSparkLine from './TokenSparkLine';
import EditHoldings from './EditHoldings';
import ImageLoad from './ImageLoad';
function Watchlistgrid() {
    const { selectedTokens } = useSelector((state) => state.token);
    const [pageNo, setPageNo] = useState(1);
    const [editingHoldings, setEditingHoldings] = useState([]);
    useEffect(() => {
        console.log("editingHoldings", editingHoldings);
    }, [editingHoldings]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setToken(getLocalData('watchList')));
        console.log(selectedTokens);
    }, []);
    //get page no wise tokens to show in grid
    const pageWiseToken = useMemo(() => {
        // get tokens from current page to total no of items per page
        return selectedTokens?.slice(((pageNo - 1) * gridPageLimit), selectedTokens?.length < pageNo * gridPageLimit ? selectedTokens?.length : (pageNo * gridPageLimit)) || [];
    }, [selectedTokens, pageNo]);
    // check can user go to previous or next page in grid
    const canPrev = useMemo(() => { return pageNo !== 1; }, [pageNo]);
    const canNext = useMemo(() => { return pageNo < Math.ceil(safeParseFloat(selectedTokens?.length / gridPageLimit)); }, [pageNo, selectedTokens]);
    try {
        return (_jsxs(_Fragment, { children: [_jsx("div", { className: " rounded-[12px] mt-2 border border-[var(--white-8)] w-[100%] overflow-x-auto", children: _jsxs("table", { className: "min-w-full border-collapse table-auto", children: [_jsx("thead", { className: "bg-[var(--dark-base)] text-[var(--gray-100)] font-medium text-[13px] ", children: _jsxs("tr", { children: [_jsx("th", { className: "px-2 sm:px-4 py-2 w-5/6 sm:w-2/6 text-left ", children: "Token" }), _jsx("th", { className: "px-2 sm:px-4 py-2 w-1/6 text-left", children: "Price" }), _jsx("th", { className: "px-2 sm:px-4 py-2 w-auto text-left", children: "24h %" }), _jsx("th", { className: "px-2 sm:px-4 py-2 w-1/6 text-left", children: "Sparkline (7d)" }), _jsx("th", { className: "px-2 sm:px-4 py-2 text-left w-1/6 ", children: "Holdings" }), _jsx("th", { className: "px-2 sm:px-4 py-2 w-2/6 text-left", children: "Value" })] }) }), _jsx("tbody", { children: !selectedTokens?.length ?
                                    _jsx("tr", { children: _jsx("td", { colSpan: 50, children: _jsx(NoData, { message: "No Token Found" }) }) })
                                    :
                                        pageWiseToken?.map((token, index) => {
                                            console.log("token", token);
                                            return (_jsxs("tr", { className: "bg-[var(--dark)] hover:bg-[var(--dark-base)]  transition-colors", children: [_jsxs("td", { className: "px-2 sm:px-4 py-3 flex ", children: [_jsx("div", { className: 'w-6 h-6', children: _jsx(ImageLoad, { className: "rounded-[4px]", url: token.thumb || token.image }) }), _jsxs("div", { className: 'ml-2 font-normal text-[13px] flex items-center', children: [_jsx("span", { className: 'text-[var(--white)] ', children: `${token.name}` }), _jsx("span", { className: 'text-[var(--gray-100)] pl-1', children: ` (${token.symbol.toUpperCase()})` })] })] }), _jsx("td", { className: "px-2 sm:px-4 py-3 text-[var(--gray-100)] text-[13px] whitespace-nowrap", children: `$ ${toFixedFloat(token.current_price).toLocaleString(numberLocale)}` }), _jsx("td", { className: "px-2 sm:px-4 py-3 text-[var(--gray-100)] text-[13px] whitespace-nowrap", children: `${token.price_change_percentage_24h < 0 ? '' : '+'} ${toFixedFloat(token.price_change_percentage_24h, 2)} %` }), _jsx("td", { className: "p-1", children: _jsx("div", { className: "w-[100%] ", children: _jsx(TokenSparkLine, { id: token.id, price_change_percentage_24h: token.price_change_percentage_24h }) }) }), _jsxs("td", { className: "px-2 sm:px-4 py-3 text-[var(--white)] text-[13px] cursor-pointer", title: 'Double Click to Edit Holding', onDoubleClick: () => {
                                                            setEditingHoldings([...editingHoldings, token.id]);
                                                        }, children: [
                                                            // show input and save button if token in editing mode
                                                            editingHoldings.indexOf(token.id) !== -1 ?
                                                                _jsx(EditHoldings, { setEditingHoldings: setEditingHoldings, editingHoldings: editingHoldings, token: token })
                                                                :
                                                                    _jsx("span", { children: toFixedFloat(token.holding) }), _jsx("span", {})] }), _jsx("td", { className: "px-2 sm:px-4 py-3 text-[var(--white)] text-[13px]", children: `$${token?.value?.toLocaleString(numberLocale)}` })] }, `token-grid-${index}`));
                                        }) })] }) }), _jsxs("div", { className: 'w-[100%] flex justify-between border border-[var(--white-8)] p-4 rounded-b-[12px]', children: [!selectedTokens?.length ?
                            _jsx(_Fragment, {})
                            :
                                _jsx("div", { className: 'w-auto text-[var(--gray-100)] font-medium text-[13px]', children: ` ${((pageNo - 1) * gridPageLimit) + 1} - ${selectedTokens?.length < pageNo * gridPageLimit ? selectedTokens?.length : pageNo * gridPageLimit} of ${safeParseInt(selectedTokens?.length)} results` }), !selectedTokens?.length ?
                            _jsx(_Fragment, {})
                            :
                                _jsxs("div", { className: 'w-auto flex justify-evenly', children: [_jsx("div", { className: ' text-[var(--gray-100)] font-medium text-[13px]', children: `${pageNo} of ${Math.ceil(safeParseFloat(selectedTokens?.length / gridPageLimit))} pages` }), _jsx("button", { disabled: !canPrev, className: ` ml-2  font-medium text-[13px] cursor-pointer ${canPrev ? 'text-[var(--gray-100)]' : 'text-[var(--dark-8)]'}`, onClick: () => {
                                                if (canPrev) {
                                                    setPageNo(pageNo - 1);
                                                }
                                            }, children: "Prev" }), _jsx("button", { disabled: !canNext, className: ` ml-2 font-medium text-[13px] cursor-pointer ${canNext ? 'text-[var(--gray-100)]' : 'text-[var(--dark-8)]'}`, onClick: () => {
                                                if (canNext) {
                                                    setPageNo(pageNo + 1);
                                                }
                                            }, children: "Next" })] })] })] }));
    }
    catch (e) {
        console.log(e);
        return _jsx(_Fragment, {});
    }
}
export default Watchlistgrid;
