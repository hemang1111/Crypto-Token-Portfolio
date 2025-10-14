import React, { useEffect, useMemo, useState } from 'react'
import { Button, Modal } from 'rsuite';
import Shimmer from './Shimmer'
import NoData from './NoData'
import star from '../assets/star.svg'
import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../redux/store';
import { addToken, removeToken, setToken  } from '../redux/tokenSlice';
import { getLocalData , setLocalData , toFixedFloat } from '../config';


interface CreateTokenModalProps {
  openAddToken: boolean;
  addTokenShimmer: boolean;
  trendingToken: any;
  tokenList: any;
  handleClose: () => void;
}

interface TokenProps {
  coin: Record<string, any>;
  index: number ;
  tempSelectedTokens : any ;
  setTempSelectedTokens : any ;
}

const Token: React.FC<TokenProps> = (props) => {
  
  const isSelected = props.tempSelectedTokens?.findIndex( (o:any) => o['id'] == props.coin.id) !== -1
  console.log(props)
  console.log(props.tempSelectedTokens)
  console.log("isSelected",isSelected)

  const handleWhatchList = (e : any , coin : any ) =>{

    if(e.target.checked){
      const exists = props.tempSelectedTokens.some(t => t.id === props.coin.id);
      if (!exists) {
        props.setTempSelectedTokens( [...props.tempSelectedTokens , { ...props.coin , "holding" : 1} ] )
      }
    }
    else{
      
      const newArray = props.tempSelectedTokens.filter(t => t.id !== props.coin.id);
      props.setTempSelectedTokens(newArray)
    }
  }

  return (
    <>
      <div className='flex justify-between py-2' key={'token-' + props.index}>
        <div className='w-80 flex align-middle'>
          <div className='w-6 h-6'>
            <img className="rounded-[4px]" src={props.coin.thumb || props.coin.image} />
          </div>
          <div className='ml-2 font-normal text-base'>
            {`${props.coin.name} (${props.coin.symbol})`}
          </div>
        </div>
        {/* radio selection and star icon */}
        <div className='flex'>
          {
            isSelected ? 
              <div className="mr-2 flex items-center justify-center ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-4 h-4 rounded-full bg-[rgba(169,232,81,1)] p-[2px]"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
            :
              <></>
          }
          <div className="mr-2 flex items-center justify-center ">
            <label className="round-checkbox">
              <input type="checkbox" checked={ isSelected  } 
                onChange={(e)=>{ handleWhatchList(e , props.coin ) }}
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
  const [tempSelectedTokens , setTempSelectedTokens] = useState([])

  const handleTokenSearch = (e: any) => {
    SetTokenSearch(e.target.value)
  }

  const trendingCoins = useMemo(() => {
    return props.trendingToken?.coins?.filter((trendingcoin: any) => tokenSearch?.trim()?.length ? trendingcoin?.item?.name?.toLowerCase()?.includes(tokenSearch?.trim()?.toLowerCase()) : true)
  }, [tokenSearch, props.trendingToken?.coins])

  const allCoins = useMemo(() => {
    return props.tokenList?.filter((trendingcoin: any) => tokenSearch?.trim()?.length ? trendingcoin?.name?.toLowerCase()?.includes(tokenSearch?.trim()?.toLowerCase()) : true)
  }, [tokenSearch, props.tokenList])

  const dispatch = useDispatch()
  const saveWatchList = () =>{
    let tempArray = JSON.parse(JSON.stringify(tempSelectedTokens || []))

    tempArray.map((token)=>{
      token.value = (toFixedFloat(token.current_price) * toFixedFloat(token.holding) ) || ( toFixedFloat(token?.data?.price) * toFixedFloat(token.holding) )
      token.price_change_percentage_24h =typeof(token.price_change_percentage_24h) == 'number' ? toFixedFloat(token.price_change_percentage_24h , 2): toFixedFloat(token.data.price_change_percentage_24h.usd , 2)
      token.current_price = token.current_price ? toFixedFloat(token.current_price) : toFixedFloat(token?.data?.price)
    })
    console.log(tempArray)

    props.SetLastUpdated(new Date())
    setLocalData('lastUpdated', new Date() )
    setLocalData('watchList', tempArray )
    dispatch(setToken(tempArray))
    props.handleClose()
    SetTokenSearch('')
  }

  try {
    return (
      <div className="p-10">
        <Modal open={props.openAddToken} onClose={props.handleClose} 
          onOpen={
              ()=>{
                SetTokenSearch('')
                setTempSelectedTokens(getLocalData('watchList') || [])
              }
          }
        >

          <Modal.Body>
            {
              props.addTokenShimmer ?
                <>
                  <div className='w-100 p-3'>
                    <div className='w-75'><Shimmer /></div>
                    <div className='w-75 mt-3'><Shimmer /></div>
                    <div className='w-75 mt-3'><Shimmer /></div>
                  </div>
                </>
                :
                <>
                  <div>
                    <div className='border-b-2 rgba(255, 255, 255, 0.1) p-4'>
                      <input className="search-token-input" placeholder='Search tokens (e.g., ETH, SOL)..'
                        onChange={(e) => { handleTokenSearch(e) }}
                        value={tokenSearch}
                      />
                    </div>
                    <>
                      {
                        !trendingCoins?.length && !allCoins?.length ?
                          <NoData message="No Token(s) Found :(" />
                          :
                          <>
                            <div className='max-h-9/10 overflow-y-auto pl-4'>
                              {
                                !trendingCoins.length ? <></>
                                  :
                                  <>
                                    <div className='text-[20px] text-gray-500 font-medium'>Trending</div>
                                    {
                                      trendingCoins?.map((trendingcoin: { [key: string]: any }, index: number) => {
                                        return (
                                          <>
                                            <Token coin={trendingcoin.item} index={index} tempSelectedTokens={tempSelectedTokens} setTempSelectedTokens={setTempSelectedTokens} />
                                          </>
                                        )
                                      })
                                    }
                                  </>

                              }
                            </div>
                            <div className='pl-4'>
                              {
                                allCoins?.map((trendingcoin: { [key: string]: any }, index: number) => {
                                  return (
                                    <>
                                      <Token coin={trendingcoin} index={index} tempSelectedTokens={tempSelectedTokens} setTempSelectedTokens={setTempSelectedTokens} />
                                    </>
                                  )
                                })
                              }
                            </div>
                          </>
                      }
                    </>
                  </div>
                </>
            }
          </Modal.Body>

          {
            props.addTokenShimmer ?
              <></>
              :
              <div className='border-t-2 rgba(255, 255, 255, 0.1)'>
                <Modal.Footer>
                  <Button disabled={!tempSelectedTokens.length} onClick={!tempSelectedTokens.length ? ()=>{} : ()=>{saveWatchList()}} appearance="primary">
                    Add to Wishlist
                  </Button>
                </Modal.Footer>
              </div>
          }
        </Modal>
      </div>
    )
  }
  catch (e) {
    console.log(e)
    return <></>
  }
}

export default CreateTokenModal

// const url = 'https://api.coingecko.com/api/v3/coins/{id}/market_chart';
// const options = {method: 'GET', headers: {'x-cg-demo-api-key': ''}, body: undefined};

// try {
//   const response = await fetch(url, options);
//   const data = await response.json();
//   console.log(data);
// } catch (error) {
//   console.error(error);
// }