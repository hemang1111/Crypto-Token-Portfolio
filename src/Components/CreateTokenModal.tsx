import React, { useEffect, useMemo, useState } from 'react'
import Shimmer from './Shimmer'
import NoData from './NoData'
import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../redux/store';
import { addToken, removeToken, setToken } from '../redux/tokenSlice';
import { getLocalData, setLocalData, toFixedFloat , ApiPageLimit} from '../config';
import StarIcon from './ICONS/StarIcon'
import CustomeModal from './CustomeModal'
import ImageLoad from './ImageLoad'


interface CreateTokenModalProps {
  openAddToken: boolean;
  addTokenShimmer: boolean;
  trendingToken: any;
  tokenList: any;
  handleClose: () => void;
}

interface TokenProps {
  coin: Record<string, any>;
  index: number;
  tempSelectedTokens: any;
  setTempSelectedTokens: any;
}

//render each token's UI from list 
const TokenSelectionList: React.FC<TokenProps> = (props) => {

  const isSelected = props.tempSelectedTokens?.findIndex((o: any) => o['id'] == props.coin.id) !== -1

  //add or remove token from watchlist 
  const handleWhatchList = (coin: any) => {
    let index  = props.tempSelectedTokens.findIndex((t)=> t.id == props.coin.id) 
    if (index == -1 ) {
      // const exists = props.tempSelectedTokens.some(t => t.id === props.coin.id);
      // if (!exists) {
        props.setTempSelectedTokens([...props.tempSelectedTokens, { ...props.coin, "holding": 1 }])
      // }
    }
    else {
      const newArray = props.tempSelectedTokens.filter(t => t.id !== props.coin.id);
      props.setTempSelectedTokens(newArray)
    }
  }

  return (
    <>
      <div 
        onClick={(e) => {
          e.stopPropagation(); // prevents bubbling to modal
          handleWhatchList(props.coin);
        }}
      className={`flex justify-between py-2 px-[12px] mx-[8px] rounded-md mb-1 cursor-pointer ${isSelected ? 'hover:bg-[var(--green-accent-06) bg-[var(--green-accent-06)]' : 'hover:bg-[var(--dark-base)]'} `} key={'token-' + props.index}>
        <div className='w-80 flex align-middle'>
          <div className='w-6 h-6'>
            <ImageLoad className="rounded-[4px]" url={props.coin.thumb || props.coin.image} />
          </div>
          <div className='ml-2 font-normal text-sm text-base text-[var(--cream-white)]'>
            {`${props.coin.name} (${props.coin.symbol})`}
          </div>
        </div>
        {/* radio selection and star icon */}
        <div className='flex'>
          {
            isSelected ?
              <div className="mr-2 flex items-center justify-center ">
                <StarIcon class="w-4 h-4 rounded-full bg-transparent p-[2px] fill-[var(--green-accent)]" />
              </div>
              :
              <></>
          }
          <div className="mr-2 flex items-center justify-center ">
            <label className="round-checkbox">
              <input type="checkbox" checked={isSelected}
                onChange={(e) => { handleWhatchList( props.coin) }}
              />
              <span className="custom-checkbox"></span>
            </label>
          </div>
        </div>

      </div>
    </>
  )
}


const CreateTokenModal: React.FC<CreateTokenModalProps> = (props) => {

  const [tokenSearch, SetTokenSearch] = useState('')
  const [tempSelectedTokens, setTempSelectedTokens] = useState([])

  const handleTokenSearch = (e: any) => {
    SetTokenSearch(e.target.value)
  }

  // const trendingCoins = useMemo(() => {
  //   return props.trendingToken?.coins?.filter((trendingcoin: any) => tokenSearch?.trim()?.length ?  : true)
  // }, [tokenSearch, props.trendingToken?.coins])

  // filter token from search input if any
  const allCoins = useMemo(() => {
    return props.tokenList?.filter((trendingcoin: any) => tokenSearch?.trim()?.length ? 
      ( trendingcoin?.name?.toLowerCase()?.includes(tokenSearch?.trim()?.toLowerCase()) || trendingcoin?.item?.name?.toLowerCase()?.includes(tokenSearch?.trim()?.toLowerCase()) ) 
    : true
  )
  }, [tokenSearch, props.tokenList])

  const dispatch = useDispatch()

  // called when clicked on save watchlist button
  const saveWatchList = () => {
    let tempArray = JSON.parse(JSON.stringify(tempSelectedTokens || []))

    // calculate token value shilw saving in watchlist 
    tempArray.map((token) => {
      token.value = (toFixedFloat(token.current_price) * toFixedFloat(token.holding)) || (toFixedFloat(token?.data?.price) * toFixedFloat(token.holding))
      token.price_change_percentage_24h = typeof (token.price_change_percentage_24h) == 'number' ? toFixedFloat(token.price_change_percentage_24h, 2) : toFixedFloat(token.data.price_change_percentage_24h.usd, 2)
      token.current_price = token.current_price ? toFixedFloat(token.current_price) : toFixedFloat(token?.data?.price)
    })

    //update last updated date 
    props.SetLastUpdated(new Date())
    setLocalData('lastUpdated', new Date())
    setLocalData('watchList', tempArray)
    dispatch(setToken(tempArray))
    props.handleClose()

    //re-set state variable after modal close 
    props.setPageNo(1)
    SetTokenSearch('')
  }

  //called when modal gets opened
  useEffect(()=>{
    // set selected tokens from watchlist grid and show auto select in modal and set other state
    if(props.openAddToken){
      SetTokenSearch('')
      setTempSelectedTokens(getLocalData('watchList') || [])
    }
  },[props.openAddToken])

  // call next market tokens on scroll in modal
  const handleScroll = async (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // When user is near bottom (100px away) and already api is not in a call and api have next data available
    if ( !props.addTokenShimmer && !props.nextPageShimmer && props.nextPage && allCoins?.length && ( Math.abs(scrollHeight - scrollTop - clientHeight ) < 150 )) {
      props.setNextPageShimmer(true)
      let res = await props.getMarketTokens(props.pageNo + 1)
      // on successfull response
      if(res.data){
        // check when is last page 
        if( res?.data?.length !== ApiPageLimit){
          props.setNextPage(false)
        }
        // if not last page then incement page value to get upcoming data
        props.setPageNo(props.pageNo + 1 )
        props.setNextPageShimmer(false)
      }
      // on error in api response
      else{
        setTimeout(()=>{
          props.setNextPageShimmer(false)
        },100)
      }
      // setPage((prev) => prev + 1);
    }
  };

  try {
    return (
      <>
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={()=>{ props.handleClose() ; props.setPageNo(1)}} // close on overlay click
        >
          <div className="fixed inset-0 flex items-center justify-center  ">
            <div
              className=" bg-[var(--dark)] rounded-xl shadow-lg w-[80%] sm:w-[70%] max-w-lg mx-4 py-2 max-h-[calc(100%-100px)] shadow-[0_0_25px_rgba(0,0,0,0.8)] "
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
            >
              {
                props.addTokenShimmer ?
                  <>
                    <div className='w-[100%] p-3 '>
                      <div className='w-75 '><Shimmer /></div>
                      <div className='w-75 mt-3'><Shimmer /></div>
                      <div className='w-75 mt-3'><Shimmer /></div>
                      <div className='w-75 mt-3'><Shimmer /></div>
                      <div className='w-75 mt-3'><Shimmer /></div>
                      <div className='w-75 mt-3'><Shimmer /></div>
                      <div className='w-75 mt-3'><Shimmer /></div>
                    </div>
                  </>
                  :
                  <>
                      <div className='border-b border-[var(--white-8)] p-2'>
                        <input className="search-token-input" placeholder='Search tokens (e.g., ETH, SOL)..'
                          onChange={(e) => { handleTokenSearch(e) }}
                          value={tokenSearch}
                        />
                      </div>
                      <>
                        {
                          !allCoins?.length ?
                          <div className='flex justify-center items-center h-[calc(100vh-100px)] max-h-[500px]'>
                            <NoData message="No Token(s) Found :(" />
                          </div>
                            :
                            <>
                              <div className='h-[calc(100vh-100px)] max-h-[500px]  overflow-y-auto relative'
                                onScroll={async (e)=>{ await handleScroll(e)}}
                              >
                                {
                                  !allCoins?.length ? <></>
                                    :
                                    <>
                                      <div className='text-xs text-[var(--gray-100)] py-[8px] font-medium pl-4'>Trending</div>
                                      {
                                        allCoins?.map((trendingcoin: { [key: string]: any }, index: number) => {
                                          return (
                                            <>
                                              <TokenSelectionList coin={trendingcoin.item ? trendingcoin.item : trendingcoin} index={index} tempSelectedTokens={tempSelectedTokens} setTempSelectedTokens={setTempSelectedTokens} />
                                            </>
                                          )
                                        })
                                      }
                                      {
                                        props.nextPageShimmer ?
                                          <div className='w-[100%] p-3'>
                                            <div className='w-75 '><Shimmer /></div>
                                            <div className='w-75 mt-3'><Shimmer /></div>
                                            <div className='w-75 mt-3'><Shimmer /></div>
                                            <div className='w-75 mt-3'><Shimmer /></div>
                                            <div className='w-75 mt-3'><Shimmer /></div>
                                            <div className='w-75 mt-3'><Shimmer /></div>
                                            <div className='w-75 mt-3'><Shimmer /></div>
                                          </div>
                                        : 
                                          <></>
                                      }
                                    </>
                                }
                              </div>
                            </>
                        }
                      </>
                  </>
              }

              {
                props.addTokenShimmer ?
                  <></>
                  :
                  <div className='rounded-b-xl flex items-center justify-end border-t border-[var(--white-8)] p-3 bg-[var(--dark)]'>
                    <button disabled={!tempSelectedTokens.length} onClick={!tempSelectedTokens.length ? (e) => {e.stopPropagation(); } : (e) => {e.stopPropagation(); saveWatchList() }} className=' px-[12px] py-[6px] rounded-md bg-[var(--green-accent)] text-[var(--dark-base)] ml-2 font-medium text-sm'>
                      Add to Wishlist
                    </button>
                  </div>
              }
            </div>
          </div>
        </div>

      </> 
    )
  }
  catch (e) {
    console.log(e)
    return <></>
  }
}

export default CreateTokenModal