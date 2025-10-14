import type { AnyARecord } from 'dns';
import { useEffect, useRef } from 'react';


export default function InfoBox(props : any) {
  const ref = useRef(null);
  const { onClickOutside  } = props;
  
  useEffect(() => {
    try {
      const handleClickOutside = (event : AnyARecord) => { 

        //not closing when click on rage picker -> tasks quick date change
        let Element = document.querySelector("[class='rs-calendar']")
        //added for date picker month calendar
        let monthElement = document.querySelector("[class='rs-calendar rs-calendar-show-month-dropdown']")
        //for not closing the div when click on dante ranger picker --> application filter
        let dateRangeElement = document.querySelector("[class='rs-picker-daterange-panel']")
        let close = false
        // do nothing, click was inside container
        if( Element?.contains( event.target ) || dateRangeElement?.contains(event.target) || monthElement?.contains( event.target )){
          close = false
        } else {
          // hide autocomplete, click was outside container.
          close = true
        }
        if (ref.current && !ref.current.contains(event.target) && close ) {
            onClickOutside && onClickOutside(event);
          }
      }
      
      document.addEventListener('click', handleClickOutside, true)

      return () => {
        document.removeEventListener('click', handleClickOutside, true)
      }
      
    }catch (e) {
      console.log(e)
      return <></>
    }
    
  }, [])
  // onClickOutside
  if(!props.show)
    return null

  try {
    return (
      <div ref={ref} className={`info-box ${props.className ? props.className : ''}`}>
          {props.message}
      </div> 
    ) 
  } catch (e) {
    console.log(e)
    return <></>
  }
}




