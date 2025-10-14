import { useState , useEffect } from 'react'
import './App.css'
import CreateTokenModal from './Components/CreateTokenModal'
import Watchlistgrid from './Components/Watchlistgrid'
import { listData, setLocalData, toFixedFloat } from './config'
import PortfolioDonutChart from './Components/PortfolioDonutChart'
import { Button } from 'rsuite'
import { useSelector , useDispatch } from 'react-redux'
import { setToken } from './redux/tokenSlice'

function App() {

  const { selectedTokens } = useSelector((state: any) => state.token);
  const dispatch = useDispatch()
  const [openAddToken, setOpen] = useState(false);
  const [ addTokenShimmer , setAddTokenShimmer] = useState(false)

  const [tokenList , setTokenList ] = useState([])
  const [trendingToken , setTrendingToken] = useState({})

  const handleAddToken = async () =>{
    setOpen(true) // open modal 

    setAddTokenShimmer(true)
    //call token and trending tokens
    const res: { [key: string]: any } = await listData('https://api.coingecko.com/api/v3/coins/markets')
    console.log("res",res)
    setTokenList(res.data)
    let trendingTokenRes: { [key: string]: any } = await listData('https://api.coingecko.com/api/v3/search/trending')
    setTrendingToken(trendingTokenRes.data)
    console.log("trendingTokenRes",trendingTokenRes)
    setAddTokenShimmer(false)
  }

  useEffect(()=>{
    console.log(openAddToken)
  },[openAddToken])


  const handleClose = () => setOpen(false);

  const refreshWatchList = async () =>{
    const idsParam = selectedTokens.map((token: any) => token.id).filter(Boolean).join(",")

    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${'usd'}&ids=${idsParam}`;
    const res: { [key: string]: any } = await listData(url , false)
    // console.log(res)
    if(res.data){
      let tempArray = JSON.parse(JSON.stringify(selectedTokens || []))
      let newArray = []
      tempArray.map((token : any )=>{
        const updatedToken = res.data.find(o => o['id'] == token.id)
        let obj = {...updatedToken}
        obj.holding = token.holding
        obj.value = (toFixedFloat(updatedToken.current_price) * toFixedFloat(token.holding) ) || ( toFixedFloat(updatedToken?.data?.price) * toFixedFloat(token.holding) )
        obj.price_change_percentage_24h =typeof(updatedToken.price_change_percentage_24h) == 'number' ? toFixedFloat(updatedToken.price_change_percentage_24h , 2): toFixedFloat(updatedToken.data.price_change_percentage_24h.usd , 2)
        obj.current_price = updatedToken.current_price ? toFixedFloat(updatedToken.current_price) : toFixedFloat(updatedToken?.data?.price)
        newArray.push(obj)
      })
      setLocalData('watchList', newArray )
      dispatch(setToken(newArray))
    }

  }

  try {
    return (
      <>
        <div className='w-100'>
          <div className='flex justify-between'>
            <div>
              Token Portfolio
            </div>
            <div>
              Connect Wallet
            </div>
          </div>

          <PortfolioDonutChart/>
          <div className='flex justify-between'>
            <h5 className='w-1/6'>
              Watchlist
            </h5>
            <div className='flex w-1/6 justify-between'>
              <button onClick={()=>{refreshWatchList()}}>
                Refresh Price
              </button>
              <div onClick={()=>{handleAddToken()}}>
                Add Token
              </div>
            </div>
          </div>
          <Watchlistgrid 
            
          />
        </div>
        <CreateTokenModal 
          openAddToken={openAddToken}
          addTokenShimmer={addTokenShimmer}
          handleClose={handleClose}
          tokenList={tokenList}
          trendingToken={trendingToken}
        />
      </>
    )
  }
  catch (e) {
    console.log(e)
    return <></>
  }
}

export default App
