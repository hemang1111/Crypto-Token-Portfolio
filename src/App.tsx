import { useState, useEffect, useMemo } from 'react'
import './App.css'
import CreateTokenModal from './Components/CreateTokenModal'
import Watchlistgrid from './Components/Watchlistgrid'
import { useSelector, useDispatch } from 'react-redux'
import { setToken } from './redux/tokenSlice'
import { WalletProvider } from "./Components/WalletProvider";
import {WalletConnectButton} from './Components/WalletConnectButton'
import PortfolioDonutChart from './Components/PortfolioDonutChart'
import PlusIcon from './Components/ICONS/PlusIcon'
import RefreshIcon from './Components/ICONS/RefreshIcon'
import Rectangle_2 from './Components/ICONS/Rectangle_2'
import StarIcon from './Components/ICONS/StarIcon'
import { formatTime12Hour, getLocalData, listData, numberLocale, setLocalData, toFixedFloat , ApiPageLimit } from './config'

function App() {

  const { selectedTokens } = useSelector((state: any) => state.token);
  const dispatch = useDispatch()

  
  const [addTokenShimmer, setAddTokenShimmer] = useState(false)
  const [nextPageShimmer , setNextPageShimmer] = useState(false)
  const [pageNo , setPageNo] = useState(1)
  const [nextPage , setNextPage] = useState(true)
  
  const [tokenList, setTokenList] = useState([])
  
  const [lastUpdated, SetLastUpdated] = useState(getLocalData("lastUpdated"))
  const [openAddToken, setOpen] = useState(false);

  const [isRefreshing , SetIsRefreshing] = useState(false)

  const getTrendingToken = async () =>{
    return await listData('https://api.coingecko.com/api/v3/search/trending')
  } 

  const getMarketTokens = async ( currentPageNO = pageNo ) =>{
    return await listData('https://api.coingecko.com/api/v3/coins/markets' , true ,ApiPageLimit   , currentPageNO )
  }

  //called when click on create token button
  const handleAddToken = async () => {
    setOpen(true) // open modal 

    setAddTokenShimmer(true)
    //call market token 
    const res: { [key: string]: any } = await getMarketTokens(pageNo)
    // on successfull response
    if(res.data){
      // check when is last page 
      if( res?.data?.length !== ApiPageLimit){
        setNextPage(false)
      }
      // if not last page then incement page value to get upcoming data
      else{
        setPageNo(pageNo + 1 )
      }
    }
    // call trending tokens
    let trendingTokenRes: { [key: string]: any } = await getTrendingToken()
    // setTrendingToken(trendingTokenRes.data)
    
    // remove dulication of token from market and trending token api 
    let tempArray : any = []
    if(Array.isArray(res?.data)){
      tempArray = [ ...res?.data ]
    }

    if(Array.isArray(trendingTokenRes?.data?.coins)){
      trendingTokenRes.data?.coins?.map((t)=>{
        // find is given token from trending api response is also present in market token api
        let index = tempArray.findIndex(o => o['id'] == t.item.id)

        //if it is there then , combine both api's response in single object and update 
        if( index !== -1){
          tempArray[index] = {...tempArray[index] , ...t.item }
        }
        // if not found then , just push 
        else{
          tempArray.push(t)
        }
      })
    }
    setTokenList(tempArray)

    setAddTokenShimmer(false)
  }

  // const { address, isConnected } = useAccount();
  // const { connect, connectors, error, isLoading, pendingConnector } =
  //   useConnect();
  // const { disconnect } = useDisconnect();

  const handleClose = () => setOpen(false);

  //called when clicked on refresh token button
  const refreshWatchList = async () => {
    SetIsRefreshing(true)
    // get watchlisted token's id and prepare string to pass in api filter / params
    const idsParam = selectedTokens?.map((token: any) => token.id)?.filter(Boolean)?.join(",")

    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${'usd'}&ids=${idsParam}`;
    const res: any = await listData(url, false)
    SetIsRefreshing(false)

    // on successfull response
    if (res.data) {
      SetLastUpdated(new Date())
      let tempArray = JSON.parse(JSON.stringify(selectedTokens || []))
      let newArray: any = []

      // update value of each token and update all data with latets response except holdings
      tempArray.map((token: any) => {
        const updatedToken = res.data?.find(o => o['id'] == token.id)
        let obj = { ...updatedToken }
        obj.holding = token.holding
        obj.value = (toFixedFloat(updatedToken.current_price) * toFixedFloat(token.holding)) || (toFixedFloat(updatedToken?.data?.price) * toFixedFloat(token.holding))
        obj.price_change_percentage_24h = typeof (updatedToken.price_change_percentage_24h) == 'number' ? toFixedFloat(updatedToken.price_change_percentage_24h, 2) : toFixedFloat(updatedToken?.data?.price_change_percentage_24h?.usd, 2)
        obj.current_price = updatedToken.current_price ? toFixedFloat(updatedToken.current_price) : toFixedFloat(updatedToken?.data?.price)
        newArray.push(obj)
      })
      setLocalData('watchList', newArray)
      setLocalData('lastUpdated', new Date())
      // uppdate watchlist grid
      dispatch(setToken(newArray))
    }

  }

  // calculate total portfolio from each token's value
  const totalportfolio = useMemo(() => {
    return selectedTokens?.reduce((acc: number, item: any) => acc + item.value, 0);
  }, [selectedTokens])

  try {
    return (
      <>
        <div className='w-[100%]'>
          <div className='flex justify-between p-[12px] mb-4 sm:mb-0  '>
            <div className='flex items-center font-semibold text-sm md:text-[20px] leading-[24px] text-[var(--white)]'>
              <Rectangle_2 class="text-[var(--green-accent)]"/>
              <span className='ml-1'>
                Token Portfolio
              </span>
            </div>
            {/* className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" */}
            <WalletProvider>
              <WalletConnectButton/>
            </WalletProvider>
          </div>

          <div className='p-0 md:p-5 flex flex-col w-[100%] justify-between'>
            <div className='w-[100%] '>
              <div className='flex flex-col md:flex-row justify-between w-full bg-[var(--dark-base)] p-[24px] md:rounded-xl'>
                <div className='flex flex-col w-auto md:w-[100%] justify-between'>
                  <div >
                    <div className='text-base text-[var(--gray-100)] pb-2'>Portfolio Total</div>
                    <div className='text-4xl font-medium leading-[110%] text-[var(--white-text)] pb-4'>{`$ ${toFixedFloat(totalportfolio , 2 ).toLocaleString(numberLocale)}`}</div>
                  </div>
                  <div className='text-xs text-[var(--gray-100)] '>
                    {`Last updated : ${formatTime12Hour(lastUpdated)}`}
                  </div>
                </div>
                {
                  selectedTokens?.length ?
                    <div className='w-[100%] mt-4 sm:mt-0'>
                      <div className='text-base text-[var(--gray-100)]'>Portfolio Total</div>                  
                      <PortfolioDonutChart />
                    </div>
                  :
                    <></>
                }
              </div>
              
            </div>

            <div className="p-3">
              <div className='flex justify-between mt-5'>
                <div className='flex items-center w-auto sm:w-1/6 text-[var(--white)] text-lg font-medium'>
                  <StarIcon class="w-5 sm:w-8 h-5 sm:h-8 rounded-full bg-transparent p-[2px] fill-[var(--green-accent)]"/>
                  <span className='ml-1'>
                    Watchlist
                  </span>
                </div>
                <div className='flex w-auto justify-between'>
                  <button onClick={() => { refreshWatchList() }} className='flex items-center bg-[var(--dark-base)] px-[12px] py-[6px] rounded-md text-[var(--white)] font-medium text-sm'>
                    <RefreshIcon class="text-[var(--gray-100)]" rotating={isRefreshing}/>
                    <span className='ml-1 hidden sm:block'>
                      Refresh Prices
                    </span>
                  </button>
                  <button onClick={() => { handleAddToken() }} className='flex items-center px-[12px] py-[6px] rounded-md bg-[var(--green-accent)] text-[var(--dark-base)] ml-2 font-medium text-sm'>
                    <PlusIcon />
                    Add Token
                  </button>
                </div>
              </div>
              <Watchlistgrid SetLastUpdated={SetLastUpdated}/>
            </div>
          </div>
        
        {
          openAddToken ?
            <CreateTokenModal
              openAddToken={openAddToken}
              addTokenShimmer={addTokenShimmer}
              handleClose={handleClose}
              tokenList={tokenList}
              // trendingToken={trendingToken}
              SetLastUpdated={SetLastUpdated}
              getMarketTokens={getMarketTokens}
              setAddTokenShimmer={setAddTokenShimmer}
              nextPageShimmer= {nextPageShimmer}
              setNextPageShimmer={setNextPageShimmer}
              pageNo={pageNo}
              setPageNo={setPageNo}
              nextPage={nextPage}
              setNextPage={setNextPage}
            />
          :
            <></>
        }
        </div>
      </>
    )
  }
  catch (e) {
    console.log(e)
    return <></>
  }
}

export default App
