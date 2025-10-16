import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
export default function InfoBox(props) {
    const ref = useRef(null);
    const { onClickOutside } = props;
    useEffect(() => {
        try {
            const handleClickOutside = (event) => {
                //not closing when click on rage picker -> tasks quick date change
                let Element = document.querySelector("[class='rs-calendar']");
                //added for date picker month calendar
                let monthElement = document.querySelector("[class='rs-calendar rs-calendar-show-month-dropdown']");
                //for not closing the div when click on dante ranger picker --> application filter
                let dateRangeElement = document.querySelector("[class='rs-picker-daterange-panel']");
                let close = false;
                // do nothing, click was inside container
                if (Element?.contains(event.target) || dateRangeElement?.contains(event.target) || monthElement?.contains(event.target)) {
                    close = false;
                }
                else {
                    // hide autocomplete, click was outside container.
                    close = true;
                }
                if (ref.current && !ref.current.contains(event.target) && close) {
                    onClickOutside && onClickOutside(event);
                }
            };
            document.addEventListener('click', handleClickOutside, true);
            return () => {
                document.removeEventListener('click', handleClickOutside, true);
            };
        }
        catch (e) {
            console.log(e);
            return _jsx(_Fragment, {});
        }
    }, []);
    // onClickOutside
    if (!props.show)
        return null;
    try {
        return (_jsx("div", { ref: ref, className: `info-box ${props.className ? props.className : ''}`, children: props.message }));
    }
    catch (e) {
        console.log(e);
        return _jsx(_Fragment, {});
    }
}
