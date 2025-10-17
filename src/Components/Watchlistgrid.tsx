import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../redux/tokenSlice';
import { gridPageLimit, getLocalData, safeParseInt, safeParseFloat, toFixedFloat, numberLocale , setLocalData} from '../config'
import NoData from './NoData';
import TokenSparkLine from './TokenSparkLine';
import EditHoldings from './EditHoldings';
import ImageLoad from './ImageLoad'
import MoreHorizontal from './ICONS/MoreHorizontal'
import DeleteIcon from './ICONS/DeleteIcon'
import InfoBox from './Infobox'

function Watchlistgrid(props) {

  const { selectedTokens } = useSelector((state: any) => state.token);

  const [pageNo, setPageNo] = useState(1)
  const [editingHoldings, setEditingHoldings] = useState([])

  const [showDeleteToken , setShowDeleteToken] = useState(false)
  const [currentDeleteIndex , setCurrentDeleteIndex] = useState(-1)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setToken(getLocalData('watchList')))
  }, [])

  //get page no wise tokens to show in grid
  const pageWiseToken = useMemo(() => {
    // get tokens from current page to total no of items per page
    return selectedTokens?.slice(((pageNo - 1) * gridPageLimit), selectedTokens?.length < pageNo * gridPageLimit ? selectedTokens?.length : (pageNo * gridPageLimit)) || []
  }, [selectedTokens, pageNo])

  // check can user go to previous or next page in grid
  const canPrev = useMemo(() => { return pageNo !== 1 }, [pageNo])
  const canNext = useMemo(() => { return pageNo < Math.ceil(safeParseFloat(selectedTokens?.length / gridPageLimit)) }, [pageNo, selectedTokens])

  const handleDelete = ( id ) =>{
    setShowDeleteToken(false)
    setCurrentDeleteIndex(-1)
    let tempArray = JSON.parse(JSON.stringify(selectedTokens || []))
    let indexToRemove  = tempArray.findIndex((t)=> t.id == id)

    tempArray = tempArray.filter((_, index) => index !== indexToRemove);
    setLocalData('lastUpdated', new Date())
    props.SetLastUpdated( new Date())
    setLocalData('watchList', tempArray)
    dispatch(setToken(tempArray))

  }

  try {
    return (
      <>
        <div className=" rounded-[12px] mt-2 border border-[var(--white-8)] w-[100%] overflow-x-auto">
          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-[var(--dark-base)] text-[var(--gray-100)] font-medium text-[13px] ">
              <tr>
                <th className="px-2 sm:px-4 py-2 w-5/6 sm:w-2/6 text-left ">Token</th>
                <th className="px-2 sm:px-4 py-2 w-1/6 text-left">Price</th>
                <th className="px-2 sm:px-4 py-2 w-auto text-left">24h %</th>
                <th className="px-2 sm:px-4 py-2 w-1/6 text-left">Sparkline (7d)</th>
                <th className="px-2 sm:px-4 py-2 text-left w-1/6 ">Holdings</th>
                <th className="px-2 sm:px-4 py-2 w-2/6 text-left">Value</th>
                <th className="px-2 sm:px-4 py-2 w-2/6 text-left"></th>
              </tr>
            </thead>
            <tbody >
              {
                !selectedTokens?.length ?
                  <tr>
                    <td  colSpan={50} >
                      <NoData message="No Token Found" />
                    </td>
                  </tr>
                  :

                  pageWiseToken?.map((token: object, index: number) => {
                    return (
                      <tr className="bg-[var(--dark)] hover:bg-[var(--dark-base)]  transition-colors" key={`token-grid-${index}`}>
                        <td className="px-2 sm:px-4 py-3 flex items-center">
                          <div className='w-6 h-6'>
                            <ImageLoad className="rounded-[4px]" url={token.thumb || token.image} />
                          </div>
                          <div className='ml-2 font-normal text-[13px] flex items-center'>
                            <span className='text-[var(--white)] '>{`${token.name}`}</span>
                            <span className='text-[var(--gray-100)] pl-1'>
                              {` (${token.symbol.toUpperCase()})`}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-[var(--gray-100)] text-[13px] whitespace-nowrap">{`$ ${toFixedFloat(token.current_price).toLocaleString(numberLocale)}`}</td>
                        <td className="px-2 sm:px-4 py-3 text-[var(--gray-100)] text-[13px] whitespace-nowrap">{`${token.price_change_percentage_24h < 0 ? '' : '+'} ${toFixedFloat(token.price_change_percentage_24h, 2)} %`}</td>
                        <td className="p-1">
                          {/* Sparkline Chart Component */}
                          <div className="w-[100%] ">
                            {
                              <TokenSparkLine id={token.id} price_change_percentage_24h={token.price_change_percentage_24h} />
                            }
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-[var(--white)] text-[13px] cursor-pointer" 
                        title='Double Click to Edit Holding'
                        onDoubleClick={() => {
                          setEditingHoldings([...editingHoldings, token.id])
                        }}>
                          {/* Update Holding Component */}
                          {
                            // show input and save button if token in editing mode
                            editingHoldings.indexOf(token.id) !== -1 ?
                              < EditHoldings SetLastUpdated={props.SetLastUpdated} setEditingHoldings={setEditingHoldings} editingHoldings={editingHoldings} token={token} />
                              :
                              <span>
                                {toFixedFloat(token.holding)}
                              </span>
                          }
                          <span>

                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-[var(--white)] text-[13px]">{`$${token?.value?.toLocaleString(numberLocale)}`}</td>
                        <td className="px-2 sm:px-4 py-3 text-[var(--gray-100)] text-[13px] whitespace-nowrap cursor-pointer relative">
                          {
                            showDeleteToken && (currentDeleteIndex == index )?
                                <InfoBox
                                    show={showDeleteToken}
                                    onClickOutside={() => { setShowDeleteToken(false) }}
                                    message={
                                      <>
                                        {
                                          <div className="flex justify-start items-center w-[100px] rounded-[8px]  z-50 absolute top-1/2 left-2 -translate-y-1/2 shadow-lg left-[-110px] px-2 border-2 border-[var(--dark)] bg-[var(--gray-500)] text-red-500" onClick={()=>{handleDelete(token.id)}}>
                                            <span><DeleteIcon class="mr-2"/></span>
                                            <span>Remove</span> 
                                          </div>
                                        }
                                      </>
                                    }
                                ></InfoBox>
                                :
                                <></>
                          }
                          <MoreHorizontal class="absolute top-1/2 right-2 -translate-y-1/2" onClick={()=>{setCurrentDeleteIndex(index) ; setShowDeleteToken(true)}}/>
                        </td>
                      </tr>
                    )
                  })
              }
              {/* Example row */}
            </tbody>
          </table>
        </div>
        <div className='w-[100%] flex justify-between border border-[var(--white-8)] p-4 rounded-b-[12px]'>
          {
            !selectedTokens?.length ?
              <></>
              :
              <div className='w-auto text-[var(--gray-100)] font-medium text-[13px]'>
                {
                  ` ${((pageNo - 1) * gridPageLimit) + 1} - ${selectedTokens?.length < pageNo * gridPageLimit ? selectedTokens?.length : pageNo * gridPageLimit} of ${safeParseInt(selectedTokens?.length)} results`
                }
              </div>
          }
          {
            !selectedTokens?.length ?
              <></>
              :
              <div className='w-auto flex justify-evenly'>
                <div className=' text-[var(--gray-100)] font-medium text-[13px]'>
                  {`${pageNo} of ${Math.ceil(safeParseFloat(selectedTokens?.length / gridPageLimit))} pages`}
                </div>
                <button disabled={!canPrev} className={` ml-2 font-medium text-[13px] hover:none cursor-pointer ${canPrev ? 'text-[var(--gray-100)]' : 'text-[var(--gray-400)]'}`}
                  onClick={() => {
                    if (canPrev) {
                      setPageNo(pageNo - 1)
                    }
                  }}
                >
                  Prev
                </button>
                <button disabled={!canNext} className={` ml-2 font-medium text-[13px] cursor-pointer hover:none ${canNext ? 'text-[var(--gray-100)]' : 'text-[var(--gray-400)]'}`}
                  onClick={() => {
                    if (canNext) {
                      setPageNo(pageNo + 1)
                    }
                  }}
                >
                  Next
                </button>
              </div>

          }
        </div>
      </>
    );
  } catch (e) {
    console.log(e);
    return <></>;
  }
}

export default Watchlistgrid;
