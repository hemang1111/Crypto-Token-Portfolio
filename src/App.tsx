import { useState, useEffect, useMemo } from 'react'
import './App.css'
import CreateTokenModal from './Components/CreateTokenModal'
import Watchlistgrid from './Components/Watchlistgrid'
import { formatTime12Hour, getLocalData, listData, numberLocale, safeParseFloat, setLocalData, toFixedFloat } from './config'
import PortfolioDonutChart from './Components/PortfolioDonutChart'
import { Button } from 'rsuite'
import { useSelector, useDispatch } from 'react-redux'
import { setToken } from './redux/tokenSlice'
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { WalletProvider } from "./Components/WalletProvider";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {

  const { selectedTokens } = useSelector((state: any) => state.token);
  const dispatch = useDispatch()
  const [openAddToken, setOpen] = useState(false);
  const [addTokenShimmer, setAddTokenShimmer] = useState(false)

  const [tokenList, setTokenList] = useState([])
  const [trendingToken, setTrendingToken] = useState({})
  const [lastUpdated, SetLastUpdated] = useState(getLocalData("lastUpdated"))

  const handleAddToken = async () => {
    setOpen(true) // open modal 

    setAddTokenShimmer(true)
    //call token and trending tokens
    const res: { [key: string]: any } = await listData('https://api.coingecko.com/api/v3/coins/markets')
    console.log("res", res)
    setTokenList(res.data)
    let trendingTokenRes: { [key: string]: any } = await listData('https://api.coingecko.com/api/v3/search/trending')
    setTrendingToken(trendingTokenRes.data)
    console.log("trendingTokenRes", trendingTokenRes)
    setAddTokenShimmer(false)
  }

  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    console.log(openAddToken)
  }, [openAddToken])
  console.log("connectors", connectors)

  const handleClose = () => setOpen(false);

  const refreshWatchList = async () => {
    const idsParam = selectedTokens.map((token: any) => token.id).filter(Boolean).join(",")

    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${'usd'}&ids=${idsParam}`;
    const res: any = await listData(url, false)
    // console.log(res)
    if (res.data) {
      SetLastUpdated(new Date())
      let tempArray = JSON.parse(JSON.stringify(selectedTokens || []))
      let newArray: any = []
      tempArray.map((token: any) => {
        const updatedToken = res.data.find(o => o['id'] == token.id)
        let obj = { ...updatedToken }
        obj.holding = token.holding
        obj.value = (toFixedFloat(updatedToken.current_price) * toFixedFloat(token.holding)) || (toFixedFloat(updatedToken?.data?.price) * toFixedFloat(token.holding))
        obj.price_change_percentage_24h = typeof (updatedToken.price_change_percentage_24h) == 'number' ? toFixedFloat(updatedToken.price_change_percentage_24h, 2) : toFixedFloat(updatedToken.data.price_change_percentage_24h.usd, 2)
        obj.current_price = updatedToken.current_price ? toFixedFloat(updatedToken.current_price) : toFixedFloat(updatedToken?.data?.price)
        newArray.push(obj)
      })
      setLocalData('watchList', newArray)
      setLocalData('lastUpdated', new Date())
      dispatch(setToken(newArray))
    }

  }

  const totalportfolio = useMemo(() => {

    return selectedTokens?.reduce((acc: number, item: any) => acc + item.value, 0);
  }, [selectedTokens])

  try {
    return (
      <>
        <div className='w-100'>
          <div className='flex justify-between'>
            <div>
              Token Portfolio
            </div>
            <WalletProvider>
            <div >
              {/* className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" */}
              <ConnectButton showBalance={false} chainStatus="icon" 
              style={{ fontWeight: 'bold', fontSize: '16px'  }}
              />
            </div>
          </WalletProvider>
          </div>
          <div style={{ padding: 20 }}>
          </div>
          
          <div className='flex justify-startw-[100%]'>
            <div className='flex flex-col w-[100%] justify-between'>
              <div>
                <div>Portfolio Total</div>
                <div className='text-4xl font-medium leading-[110%] text-[var(--white-text)]'>{`$ ${toFixedFloat(totalportfolio).toLocaleString(numberLocale)}`}</div>
              </div>
              <div>
                {`Last updated : ${formatTime12Hour(lastUpdated)}`}
              </div>
            </div>
            <PortfolioDonutChart />
          </div>
          <div className='flex justify-between'>
            <h5 className='w-1/6'>
              Watchlist
            </h5>
            <div className='flex w-1/6 justify-between'>
              <button onClick={() => { refreshWatchList() }}>
                Refresh Price
              </button>
              <div onClick={() => { handleAddToken() }}>
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
          SetLastUpdated={SetLastUpdated}
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
