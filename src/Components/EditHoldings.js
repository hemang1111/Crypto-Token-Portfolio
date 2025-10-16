import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import InfoBox from './Infobox';
import { useDispatch, useSelector } from 'react-redux';
import { toFixedFloat, setLocalData } from '../config';
import { setToken } from '../redux/tokenSlice';
function EditHoldings(props) {
    const dispatch = useDispatch();
    const { selectedTokens } = useSelector((state) => state.token);
    const [inputValue, setinputValue] = useState(toFixedFloat(props.token.holding));
    const inputref = useRef(null);
    useEffect(() => {
        setinputValue(props.token.holding);
        setTimeout(() => {
            inputref.current.focus();
        }, 10);
    }, []);
    // useEffect(() => {
    //     console.log("inputValue", inputValue)
    // }, [inputValue])
    //called when click on save holding button
    const handleHoldingSave = () => {
        let tempArray = JSON.parse(JSON.stringify(selectedTokens || []));
        let index = tempArray.findIndex((t) => t.id == props.token.id);
        // at given index update holding and calculate value of token accordignly
        tempArray[index].holding = toFixedFloat(inputValue || 0);
        tempArray[index].value = (toFixedFloat(props.token.current_price) * toFixedFloat(inputValue || 0)) || (toFixedFloat(props.token?.data?.price) * toFixedFloat(inputValue || 0));
        dispatch(setToken(tempArray));
        setLocalData('watchList', tempArray);
        //remove token from editing mode
        props.setEditingHoldings([...props.editingHoldings.filter((t) => t !== props.token.id)]);
    };
    try {
        return (_jsx(_Fragment, { children: _jsx(InfoBox, { show: props.editingHoldings.indexOf(props.token.id) !== -1, onClickOutside: () => { props.setEditingHoldings([...props.editingHoldings.filter((t) => t !== props.token.id)]); }, message: _jsxs("div", { className: 'w-[100%] flex justify-between', children: [_jsx("input", { className: 'w-auto change-holding-input', placeholder: 'Select', ref: inputref, type: 'number', value: inputValue, onChange: (e) => {
                                const val = e.target.value;
                                // Allow empty input or valid number
                                if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                    setinputValue(val);
                                }
                            }, onKeyDown: (e) => {
                                if (e.key === 'Enter') {
                                    // Enter was pressed
                                    console.log('Enter pressed!', inputValue);
                                    handleHoldingSave(); // Call save function
                                }
                            } }), _jsx("button", { className: ' ml-2 w-[30%] px-[12px] py-[8px] rounded-md bg-[var(--green-accent)] text-[var(--dark-base)] ml-2 font-medium text-sm', onClick: () => { handleHoldingSave(); }, children: "Save" })] }) }) }));
    }
    catch (e) {
        console.log(e);
        return _jsx(_Fragment, {});
    }
}
export default EditHoldings;
