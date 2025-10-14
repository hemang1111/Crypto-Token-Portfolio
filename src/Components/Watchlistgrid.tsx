import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../redux/tokenSlice';
import { pageLimit, getLocalData, safeParseInt, safeParseFloat, toFixedFloat, numberLocale } from '../config'
import NoData from './NoData';
import TokenSparkLine from './TokenSparkLine';
import EditHoldings from './EditHoldings';

function Watchlistgrid() {

  const { selectedTokens } = useSelector((state: any) => state.token);

  const [pageNo, setPageNo] = useState(1)
  const [editingHoldings, setEditingHoldings] = useState([])

  useEffect(() => {
    console.log("editingHoldings", editingHoldings)
  }, [editingHoldings])

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setToken(getLocalData('watchList')))
    console.log(selectedTokens)
  }, [])

  const pageWiseToken = useMemo(() => {
    return selectedTokens?.slice(((pageNo - 1) * pageLimit), selectedTokens?.length < pageNo * pageLimit ? selectedTokens?.length : (pageNo * pageLimit)) || []
  }, [selectedTokens, pageNo])

  try {
    return (
      <div className="overflow-x-auto rounded-[12px] ">
        <table className="min-w-full border-collapse table-auto">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 w-2/6 text-left">Token</th>
              <th className="px-4 py-2 w-1/6 text-left">Price</th>
              <th className="px-4 py-2 w-1/6 text-left">24h %</th>
              <th className="px-4 py-2 text-left">Sparkline (7d)</th>
              <th className="px-4 py-2 text-left w-1/6 ">Holdings</th>
              <th className="px-4 py-2 w-2/6 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            {
              !selectedTokens?.length ?
                <tr>
                  <td className='w-100 flex justify-center'>
                    <NoData />
                  </td>
                </tr>
                :

                pageWiseToken?.map((token: object, index: number) => {
                  console.log("token", token)
                  return (
                    <tr className="bg-gray-900 hover:bg-gray-700 transition-colors" key={`token-grid-${index}`}>
                      <td className="px-4 py-3 flex">
                        <div className='w-6 h-6'>
                          <img className="rounded-[4px]" src={token.thumb || token.image} />
                        </div>
                        <div className='ml-2 font-normal text-base'>
                          {`${token.name} (${token.symbol})`}
                        </div>
                      </td>
                      <td className="px-4 py-3">{`$ ${toFixedFloat(token.current_price).toLocaleString(numberLocale)}`}</td>
                      <td className="px-4 py-3 text-green-500">{`${toFixedFloat(token.price_change_percentage_24h, 2)} %`}</td>
                      <td className="p-1">
                        {/* Sparkline can be a small chart component */}
                        <div className="w-100 ">
                          {
                            <TokenSparkLine id={token.id} price_change_percentage_24h={token.price_change_percentage_24h} />
                          }
                        </div>
                      </td>
                      <td className="px-4 py-3" onDoubleClick={() => {
                        setEditingHoldings([...editingHoldings, token.id])
                      }}>
                        {
                          editingHoldings.indexOf(token.id) !== -1 ?
                            < EditHoldings setEditingHoldings={setEditingHoldings} editingHoldings={editingHoldings} token={token} index={index} />
                            :
                            <span>
                              {toFixedFloat(token.holding)}
                            </span>
                        }
                        <span>

                        </span>
                      </td>
                      <td className="px-4 py-3">{`$${token?.value?.toLocaleString(numberLocale)}`}</td>
                    </tr>
                  )
                })
            }
            {/* Example row */}
          </tbody>
        </table>
        <div className='flex justify-between'>
          {
            !selectedTokens?.length ?
              <></>
              :
              <div className='w-50'>
                {
                  ` ${((pageNo - 1) * pageLimit) + 1} - ${selectedTokens?.length < pageNo * pageLimit ? selectedTokens?.length : pageNo * pageLimit} of ${safeParseInt(selectedTokens?.length)} results`
                }
              </div>
          }
          {
            !selectedTokens?.length ?
              <></>
              :
              <div className='w-50 flex justify-evenly'>
                <div className='w-100'>
                  {`${pageNo} of ${Math.ceil(safeParseFloat(selectedTokens?.length / pageLimit))} pages`}
                </div>
                <div className='w-100 ml-2'
                  onClick={() => {
                    if (pageNo !== 1) {
                      setPageNo(pageNo - 1)
                    }
                  }}
                >
                  Prev
                </div>
                <div className='w-100 ml-2' 
                  onClick={() => {
                    if (pageNo < Math.ceil(safeParseFloat(selectedTokens?.length / pageLimit))) {
                      setPageNo(pageNo + 1)
                    }
                  }}
                >
                  Next
                </div>
              </div>

          }
        </div>
      </div>
    );
  } catch (e) {
    console.log(e);
    return <></>;
  }
}

export default Watchlistgrid;
