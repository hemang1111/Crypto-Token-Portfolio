import { useEffect, useState , useRef } from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { listData } from '../config'
import { useIntersection } from './intersectionObserver';
import blurimg from '../assets/images/blurimg.jpg';
import classnames from 'classnames';
import ErrorIcon from './ICONS/ErrorIcon'

function TokenSparkLine(props: any) {
    const [chartData, setChartData] = useState<{ time: number; price: number }[]>([]);
    const [ isLoading , setIsLoading ] = useState(false) 
    const [isError , setIsError] = useState(false)

    const [isInView, setIsInView] = useState(false);
    const graphRef = useRef();

    useIntersection(graphRef, () => setIsInView(true));

    useEffect(
        () => {
            async function fetchData() {

                try {
                    let formatted = []
                    setIsLoading(true)
                    setChartData([]);
                    const res:any = await listData(
                        `https://api.coingecko.com/api/v3/coins/${props.id}/market_chart?vs_currency=usd&days=7`
                    )
                    setIsLoading(false)
                    setIsError(false)

                    const intervalMs = 1 * 60 * 60 * 1000; // 4 hours in milliseconds

                    formatted = res.data.prices
                        .filter((item: [number, number], index: number, array: [number, number][]) => {
                            if (index === 0) return true; // always keep the first point
                            const prevTime = array[index - 1][0];
                            return item[0] - prevTime >= intervalMs;
                        })
                        .map((item: [number, number]) => ({
                            time: item[0],
                            price: item[1],
                        }));
                    setChartData(formatted);
                } catch (err) {
                    console.error('Error fetching sparkline:', err);
                    setTimeout(()=>{
                        setIsError(true)
                        setIsLoading(false)
                    },[100])
                    // if error then show linear spark line
                    setChartData(
                        Array.from({ length: 10 }, (_, i) => ({
                            time: i,
                            price: 0, // same value for all points — makes it a flat line
                        }))
                    );
                }
            }

            if(isInView){
                setTimeout(()=>{
                    fetchData()
                },100)
            }
        }
    , [isInView,props.id])

    return (
        <div className="flex justify-center items-center"  ref={graphRef} >
            {
                isLoading ?
                   <div className="flex gap-1">
                        <div className="w-2 h-2 bg-[var(--green-accent)] rounded-full animate-pulse [animation-duration:0.8s]"></div>
                        <div className="w-2 h-2 bg-[var(--green-accent)] rounded-full animate-pulse delay-150 [animation-duration:0.8s] "></div>
                        <div className="w-2 h-2 bg-[var(--green-accent)] rounded-full animate-pulse delay-300 [animation-duration:0.8s]"></div>
                    </div>
                :
                isError ?
                    <>
                        <div className="w-full  flex items-center justify-center text-gray-400">
                            <ErrorIcon class="mr-1"/>
                            <span className="text-[10px]">Unable to load chart</span>
                        </div>
                    </>
                :
                <div className="w-[50%]">
                    <ResponsiveContainer width="100%" height={45} >
                        <LineChart data={chartData}>
                            <Line
                                type="monotone"
                                dataKey="price"
                                // if price change is negetive then show in red color else in green
                                stroke={(props.price_change_percentage_24h < 0) ? "red" : "var(--green-accent-dark)"}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            }
        </div>
    )
}

export default TokenSparkLine