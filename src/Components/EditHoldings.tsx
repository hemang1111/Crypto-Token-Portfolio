import { useEffect, useState, useRef } from 'react'
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

    //called when click on save holding button
    const handleHoldingSave = () => {
        let tempArray = JSON.parse(JSON.stringify(selectedTokens || []))
        let index  = tempArray.findIndex((t)=> t.id == props.token.id)
        // at given index update holding and calculate value of token accordignly
        tempArray[index].holding = toFixedFloat(inputValue || 0)
        tempArray[index].value = (toFixedFloat(props.token.current_price) * toFixedFloat(inputValue || 0) ) || ( toFixedFloat(props.token?.data?.price) * toFixedFloat(inputValue || 0) )
        dispatch(setToken(tempArray))
        setLocalData('lastUpdated', new Date())
        setLocalData('watchList', tempArray)
        //remove token from editing mode
        props.setEditingHoldings([...props.editingHoldings.filter((t: string) => t !== props.token.id)])
    }

    try {
        return (
            <>
                <InfoBox
                    show={props.editingHoldings.indexOf(props.token.id) !== -1}
                    onClickOutside={() => { props.setEditingHoldings([...props.editingHoldings.filter((t: string) => t !== props.token.id)]) }}
                    message={
                        <div className='w-[100%] flex justify-between'>
                            <input className='w-auto change-holding-input'
                            placeholder='Select'
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
                                        handleHoldingSave(); // Call save function
                                    }
                                }}
                            >
                            </input>
                            <button className=' ml-2 w-[30%] px-[12px] py-[8px] rounded-md bg-[var(--green-accent)] text-[var(--dark-base)] ml-2 font-medium text-sm' onClick={() => { handleHoldingSave() }}>
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