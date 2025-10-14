import React, { useEffect, useState } from 'react'
import { LineChart, Line , ResponsiveContainer } from 'recharts';
import { listData } from '../config'

function TokenSparkLine(props : any) {
    const [chartData, setChartData] = useState<{ time: number; price: number }[]>([]);

    useEffect(
        () => {
            async function fetchData() {

                try {
                    const res: any = await listData(
                        `https://api.coingecko.com/api/v3/coins/${props.id}/market_chart?vs_currency=usd&days=7`
                    );

                   const intervalMs = 1 * 60 * 60 * 1000; // 4 hours in milliseconds

                    const formatted = res.data.prices
                    .filter((item: [number, number], index: number, array: [number, number][]) => {
                        if (index === 0) return true; // always keep the first point
                        const prevTime = array[index - 1][0];
                        return item[0] - prevTime >= intervalMs;
                    })
                    .map((item: [number, number]) => ({
                        time: item[0],
                        price: item[1],
                    }));

                    console.log(formatted)
                    setChartData(formatted);
                } catch (err) {
                    console.error('Error fetching sparkline:', err);
                    setChartData(
                        Array.from({ length: 10 }, (_, i) => ({
                            time: i,
                            price: 0, // same value for all points — makes it a flat line
                        }))
                    );
                }
            }

            fetchData()
        }
        , [])

    return (
        <div className="flex justify-center items-center">
            <ResponsiveContainer width="100%" height={80}>
                <LineChart data={chartData}>
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke={ ( props.price_change_percentage_24h < 0 ) ? "red" : "#22c55e" }
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TokenSparkLine