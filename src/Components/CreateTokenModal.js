import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal } from 'rsuite';
import Shimmer from './Shimmer';
import NoData from './NoData';
import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../redux/store';
import { addToken, removeToken, setToken } from '../redux/tokenSlice';
import { getLocalData, setLocalData, toFixedFloat, ApiPageLimit } from '../config';
import StarIcon from './ICONS/StarIcon';
import CustomeModal from './CustomeModal';
import ImageLoad from './ImageLoad';
//render each token's UI from list 
const TokenSelectionList = (props) => {
    const isSelected = props.tempSelectedTokens?.findIndex((o) => o['id'] == props.coin.id) !== -1;
    console.log(props);
    console.log(props.tempSelectedTokens);
    console.log("isSelected", isSelected);
    //add or remove token from watchlist 
    const handleWhatchList = (coin) => {
        let index = props.tempSelectedTokens.findIndex((t) => t.id == props.coin.id);
        if (index == -1) {
            // const exists = props.tempSelectedTokens.some(t => t.id === props.coin.id);
            // if (!exists) {
            props.setTempSelectedTokens([...props.tempSelectedTokens, { ...props.coin, "holding": 1 }]);
            // }
        }
        else {
            const newArray = props.tempSelectedTokens.filter(t => t.id !== props.coin.id);
            props.setTempSelectedTokens(newArray);
        }
    };
    return (_jsx(_Fragment, { children: _jsxs("div", { onClick: (e) => {
                e.stopPropagation(); // prevents bubbling to modal
                handleWhatchList(props.coin);
            }, className: `flex justify-between py-2 px-[12px] mx-[8px] rounded-md mb-1 cursor-pointer ${isSelected ? 'hover:bg-[var(--green-accent-06) bg-[var(--green-accent-06)]' : 'hover:bg-[var(--dark-base)]'} `, children: [_jsxs("div", { className: 'w-80 flex align-middle', children: [_jsx("div", { className: 'w-6 h-6', children: _jsx(ImageLoad, { className: "rounded-[4px]", url: props.coin.thumb || props.coin.image }) }), _jsx("div", { className: 'ml-2 font-normal text-sm text-base text-[var(--cream-white)]', children: `${props.coin.name} (${props.coin.symbol})` })] }), _jsxs("div", { className: 'flex', children: [isSelected ?
                            _jsx("div", { className: "mr-2 flex items-center justify-center ", children: _jsx(StarIcon, { class: "w-4 h-4 rounded-full bg-transparent p-[2px] fill-[var(--green-accent)]" }) })
                            :
                                _jsx(_Fragment, {}), _jsx("div", { className: "mr-2 flex items-center justify-center ", children: _jsxs("label", { className: "round-checkbox", children: [_jsx("input", { type: "checkbox", checked: isSelected, onChange: (e) => { handleWhatchList(props.coin); } }), _jsx("span", { className: "custom-checkbox" })] }) })] })] }, 'token-' + props.index) }));
};
const CreateTokenModal = (props) => {
    const [tokenSearch, SetTokenSearch] = useState('');
    const [tempSelectedTokens, setTempSelectedTokens] = useState([]);
    const handleTokenSearch = (e) => {
        SetTokenSearch(e.target.value);
    };
    // const trendingCoins = useMemo(() => {
    //   return props.trendingToken?.coins?.filter((trendingcoin: any) => tokenSearch?.trim()?.length ?  : true)
    // }, [tokenSearch, props.trendingToken?.coins])
    // filter token from search input if any
    const allCoins = useMemo(() => {
        return props.tokenList?.filter((trendingcoin) => tokenSearch?.trim()?.length ?
            (trendingcoin?.name?.toLowerCase()?.includes(tokenSearch?.trim()?.toLowerCase()) || trendingcoin?.item?.name?.toLowerCase()?.includes(tokenSearch?.trim()?.toLowerCase()))
            : true);
    }, [tokenSearch, props.tokenList]);
    const dispatch = useDispatch();
    // called when clicked on save watchlist button
    const saveWatchList = () => {
        let tempArray = JSON.parse(JSON.stringify(tempSelectedTokens || []));
        // calculate token value shilw saving in watchlist 
        tempArray.map((token) => {
            token.value = (toFixedFloat(token.current_price) * toFixedFloat(token.holding)) || (toFixedFloat(token?.data?.price) * toFixedFloat(token.holding));
            token.price_change_percentage_24h = typeof (token.price_change_percentage_24h) == 'number' ? toFixedFloat(token.price_change_percentage_24h, 2) : toFixedFloat(token.data.price_change_percentage_24h.usd, 2);
            token.current_price = token.current_price ? toFixedFloat(token.current_price) : toFixedFloat(token?.data?.price);
        });
        console.log(tempArray);
        //update last updated date 
        props.SetLastUpdated(new Date());
        setLocalData('lastUpdated', new Date());
        setLocalData('watchList', tempArray);
        dispatch(setToken(tempArray));
        props.handleClose();
        //re-set state variable after modal close 
        props.setPageNo(1);
        SetTokenSearch('');
    };
    //called when modal gets opened
    useEffect(() => {
        // set selected tokens from watchlist grid and show auto select in modal and set other state
        if (props.openAddToken) {
            SetTokenSearch('');
            setTempSelectedTokens(getLocalData('watchList') || []);
        }
    }, [props.openAddToken]);
    // call next market tokens on scroll in modal
    const handleScroll = async (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        // When user is near bottom (100px away) and already api is not in a call and api have next data available
        if (!props.addTokenShimmer && !props.nextPageShimmer && props.nextPage && allCoins?.length && scrollHeight - scrollTop - clientHeight < 100) {
            props.setNextPageShimmer(true);
            let res = await props.getMarketTokens(props.pageNo + 1);
            // on successfull response
            if (res.data) {
                // check when is last page 
                if (res?.data?.length !== ApiPageLimit) {
                    props.setNextPage(false);
                }
                // if not last page then incement page value to get upcoming data
                props.setPageNo(props.pageNo + 1);
                props.setNextPageShimmer(false);
            }
            // on error in api response
            else {
                setTimeout(() => {
                    props.setNextPageShimmer(false);
                }, 100);
            }
            // setPage((prev) => prev + 1);
        }
    };
    try {
        return (_jsx(_Fragment, { children: _jsx("div", { className: "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50", onClick: () => { props.handleClose(); props.setPageNo(1); }, children: _jsx("div", { className: "fixed inset-0 flex items-center justify-center  ", children: _jsxs("div", { className: " bg-[var(--dark)] rounded-xl shadow-lg w-[80%] sm:w-[70%] max-w-lg mx-4 py-2 max-h-[calc(100%-100px)] shadow-[0_0_25px_rgba(0,0,0,0.8)] ", onClick: (e) => e.stopPropagation(), children: [props.addTokenShimmer ?
                                _jsx(_Fragment, { children: _jsxs("div", { className: 'w-[100%] p-3 ', children: [_jsx("div", { className: 'w-75 ', children: _jsx(Shimmer, {}) }), _jsx("div", { className: 'w-75 mt-3', children: _jsx(Shimmer, {}) }), _jsx("div", { className: 'w-75 mt-3', children: _jsx(Shimmer, {}) }), _jsx("div", { className: 'w-75 mt-3', children: _jsx(Shimmer, {}) }), _jsx("div", { className: 'w-75 mt-3', children: _jsx(Shimmer, {}) }), _jsx("div", { className: 'w-75 mt-3', children: _jsx(Shimmer, {}) }), _jsx("div", { className: 'w-75 mt-3', children: _jsx(Shimmer, {}) })] }) })
                                :
                                    _jsxs(_Fragment, { children: [_jsx("div", { className: 'border-b border-[var(--white-8)] p-2', children: _jsx("input", { className: "search-token-input", placeholder: 'Search tokens (e.g., ETH, SOL)..', onChange: (e) => { handleTokenSearch(e); }, value: tokenSearch }) }), _jsx(_Fragment, { children: !allCoins?.length ?
                                                    _jsx("div", { className: 'flex justify-center items-center h-[calc(100vh-100px)] max-h-[500px]', children: _jsx(NoData, { message: "No Token(s) Found :(" }) })
                                                    :
                                                        _jsx(_Fragment, { children: _jsx("div", { className: 'h-[calc(100vh-100px)] max-h-[500px]  overflow-y-auto', onScroll: async (e) => { await handleScroll(e); }, children: !allCoins?.length ? _jsx(_Fragment, {})
                                                                    :
                                                                        _jsxs(_Fragment, { children: [_jsx("div", { className: 'text-xs text-[var(--gray-100)] py-[8px] font-medium pl-4', children: "Trending" }), allCoins?.map((trendingcoin, index) => {
                                                                                    return (_jsx(_Fragment, { children: _jsx(TokenSelectionList, { coin: trendingcoin.item ? trendingcoin.item : trendingcoin, index: index, tempSelectedTokens: tempSelectedTokens, setTempSelectedTokens: setTempSelectedTokens }) }));
                                                                                }), props.nextPageShimmer ?
                                                                                    _jsxs("div", { className: 'w-[100%] p-3', children: [_jsx("div", { className: 'w-75 ', children: _jsx(Shimmer, {}) }), _jsx("div", { className: 'w-75 mt-3', children: _jsx(Shimmer, {}) }), _jsx("div", { className: 'w-75 mt-3', children: _jsx(Shimmer, {}) }), _jsx("div", { className: 'w-75 mt-3', children: _jsx(Shimmer, {}) }), _jsx("div", { className: 'w-75 mt-3', children: _jsx(Shimmer, {}) }), _jsx("div", { className: 'w-75 mt-3', children: _jsx(Shimmer, {}) }), _jsx("div", { className: 'w-75 mt-3', children: _jsx(Shimmer, {}) })] })
                                                                                    :
                                                                                        _jsx(_Fragment, {})] }) }) }) })] }), props.addTokenShimmer ?
                                _jsx(_Fragment, {})
                                :
                                    _jsx("div", { className: 'rounded-b-xl flex items-center justify-end border-t border-[var(--white-8)] p-3 bg-[var(--dark)]', children: _jsx("button", { disabled: !tempSelectedTokens.length, onClick: !tempSelectedTokens.length ? (e) => { e.stopPropagation(); } : (e) => { e.stopPropagation(); saveWatchList(); }, className: ' px-[12px] py-[6px] rounded-md bg-[var(--green-accent)] text-[var(--dark-base)] ml-2 font-medium text-sm', children: "Add to Wishlist" }) })] }) }) }) }));
    }
    catch (e) {
        console.log(e);
        return _jsx(_Fragment, {});
    }
};
export default CreateTokenModal;
