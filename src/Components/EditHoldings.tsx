import React, { useEffect, useState, useRef } from 'react'
import InfoBox from './Infobox'
import { useDispatch, useSelector } from 'react-redux';
import { toFixedFloat, setLocalData } from '../config'
import { setToken } from '../redux/tokenSlice';

function EditHoldings(props: any) {
    const dispatch = useDispatch()
    const { selectedTokens } = useSelector((state: any) => state.token)

    const [inputValue, setinputValue] = useState(toFixedFloat(props.token.holding))

    const inputref = useRef(null)

    useEffect(() => {
        setinputValue(props.token.holding)
        setTimeout(()=>{
            inputref.current.focus()
        },10)
    }, [])

    // useEffect(() => {
    //     console.log("inputValue", inputValue)
    // }, [inputValue])

    const handleHoldingSave = () => {
        let tempArray = JSON.parse(JSON.stringify(selectedTokens || []))
        tempArray[props.index].holding = toFixedFloat(inputValue || 0)
        tempArray[props.index].value = (toFixedFloat(props.token.current_price) * toFixedFloat(inputValue || 0) ) || ( toFixedFloat(props.token?.data?.price) * toFixedFloat(inputValue || 0) )
        dispatch(setToken(tempArray))
        setLocalData('watchList', tempArray)
        props.setEditingHoldings([...props.editingHoldings.filter((t: string) => t !== props.token.id)])
    }

    try {
        return (
            <>
                <InfoBox
                    show={props.editingHoldings.indexOf(props.token.id) !== -1}
                    onClickOutside={() => { props.setEditingHoldings([...props.editingHoldings.filter((t: string) => t !== props.token.id)]) }}
                    message={
                        <div className='w-100 flex justify-between'>
                            <input className='w-60 change-holding-input'
                                ref={inputref}
                                type='number'
                                value={inputValue}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // Allow empty input or valid number
                                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                        setinputValue(val);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        // Enter was pressed
                                        console.log('Enter pressed!', inputValue);
                                        handleHoldingSave(); // Call save function
                                    }
                                }}
                            >
                            </input>
                            <button className=' ml-2 w-[30%]' onClick={() => { handleHoldingSave() }}>
                                Save
                            </button>
                        </div>
                    }
                >
                </InfoBox>
            </>
        )
    }
    catch (e) {
        console.log(e)
        return <></>
    }
}

export default EditHoldings