import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';



const COLORS = ['#f59e0b', '#8b5cf6', '#06b6d4', '#10b981', '#ef4444'];

const PortfolioDonutChart = () => {

    const { selectedTokens } = useSelector((state: any) => state.token);
    // Calculate total for percentage
    const total = selectedTokens?.reduce((acc: number, item: any) => acc + item.value, 0);

    const data = useMemo(() => {
        let tempArray = JSON.parse(JSON.stringify(selectedTokens || []))

        tempArray.map((token: any) => {
            token.name = `${token.name} (${token.symbol})`
            token.value = token.value
        })
        tempArray.sort((a: any, b: any) => b.value - a.value);
        console.log(tempArray)
        return tempArray
    }, [selectedTokens])

    try {
        return (
            <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer >
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={2}
                            label={false}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend
                            height='100%'
                            layout="vertical"       // vertical legend
                            verticalAlign="middle"  // align center vertically
                            align="right"
                            wrapperStyle={{
                                maxHeight: '100%',
                                overflowY: 'auto',
                                fontSize: '12px',
                                paddingLeft: '10px',
                            }}       // place on right side
                            formatter={(value) => {
                                const item = data.find((d) => d.name === value);
                                const percent = ((item?.value / total) * 100).toFixed(1);
                                return `${value} (${percent}%)`;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        )
    }
    catch (e) {
        console.log(e)
        return <></>
    }
};

export default PortfolioDonutChart;
