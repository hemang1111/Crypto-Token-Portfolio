import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import { CHART_COLORS } from "../config";

const PortfolioDonutChart = () => {
  const { selectedTokens } = useSelector((state: any) => state.token);

  const total = selectedTokens?.reduce(
    (acc: number, item: any) => acc + item.value,
    0
  ) || 0;

  const data = useMemo(() => {
    const tempArray = JSON.parse(JSON.stringify(selectedTokens || []));
    tempArray.forEach((token: any) => {
      token.name = `${token.name} (${token.symbol})`;
    });
    tempArray.sort((a: any, b: any) => b.value - a.value);
    return tempArray;
  }, [selectedTokens]);

  const legendItems = useMemo(
    () =>
      data.map((d: any, i: number) => ({
        name: d.name,
        value: d.value,
        color: CHART_COLORS[i % CHART_COLORS.length],
      })),
    [data]
  );

  return (
    <div
      className="
        flex flex-col md:flex-row 
        items-center md:items-start 
        justify-center md:justify-between 
        gap-3 w-full h-auto md:h-[150px]
      "
    >
      {/* Chart Section */}
      <div
        className="
          w-[190px] h-[190px] md:h-full 
          flex items-center justify-center
        "
      >
        <ResponsiveContainer width="90%" height="100%">
          <PieChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={70}
              paddingAngle={2}
              label={false}
            >
              {data.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Section */}
      <div
        className="
          flex-1 w-full md:w-auto 
          h-auto md:h-full 
          overflow-hidden
        "
      >
        <div
          className="
            overflow-y-auto pl-2 scrollbar-hide 
            max-h-[250px] md:max-h-full
          "
        >
          <ul className="list-none m-0 p-0 text-xs">
            {legendItems.map((item: any) => {
              const percent = total
                ? ((item.value / total) * 100).toFixed(1)
                : "0.0";
              return (
                <li
                  key={item.name}
                  className="flex justify-between items-center mb-3"
                >
                  <span style={{ color: item.color }}>{item.name}</span>
                  <span className="text-[var(--gray-100)]">{`${percent}%`}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDonutChart;




// import { useMemo } from 'react';
// import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
// import { useSelector } from 'react-redux';
// import {CHART_COLORS} from '../config'



// const PortfolioDonutChart = () => {
//   const { selectedTokens } = useSelector((state: any) => state.token);

//   // Calculate total for percentage
//   const total = selectedTokens?.reduce((acc: number, item: any) => acc + item.value, 0);

//   const data = useMemo(() => {
//     let tempArray = JSON.parse(JSON.stringify(selectedTokens || []));
//     tempArray.map((token: any) => {
//       token.name = `${token.name} (${token.symbol})`;
//       token.value = token.value;
//     });
//     tempArray.sort((a: any, b: any) => b.value - a.value);
//     return tempArray;
//   }, [selectedTokens]);

//   // Custom Legend (without color indicators)
//   const renderCustomLegend = (props: any) => {
//     const { payload } = props;
//     payload.sort((a: any, b: any) => b.payload.value - a.payload.value);
//     return (
//         <ul style={{ listStyle: "none", margin: 0, padding: 0, fontSize: "12px" }}>
//         {payload.map((entry: any, index: number) => {
//           const item = data.find((d) => d.name === entry.value);
//           const percent = ((item?.value / total) * 100).toFixed(1);
//           return (
//             <li key={`item-${index}`} style={{ marginBottom: "4px"  }} className='flex justify-between items-center'>
//                 <span style={{color : entry.color }}>{`${entry.value}`}</span>
//                 <span style={{color : 'var(--gray-100)'}}>{` ${percent}%`}</span>
//             </li>
//           );
//         })}
//       </ul>
//     );
//   };

//   try {
//     return (
//       <div style={{ width: '100%', height: 170 }}>
//         <ResponsiveContainer width="100%" height="100%" >
//           <PieChart margin={{ left: 0, right: 0, top: 0, bottom: 0  }} style={{ border: '1px dashed red' }}> 
//             <Pie
//             style={{ border: '1px dashed green' }}
//               data={data}
//               dataKey="value"
//               nameKey="name"
//               innerRadius={45}
//               outerRadius={70}
//               paddingAngle={2}
//               label={false}
//               cx="50%"
//               cy="50%"
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
//               ))}
//             </Pie>

//             {/* Custom Legend replaces the default one */}
//             <Legend
//               content={renderCustomLegend}
//               layout="vertical"
//               verticalAlign="middle"
//               align="right"
//               wrapperStyle={{
//                 maxHeight: '100%',
//                 overflowY: 'auto',
//                 paddingLeft: '10px',
//                 border: '1px dashed blue'
//               }}
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     );
//   } catch (e) {
//     console.log(e);
//     return <></>;
//   }
// };

// export default PortfolioDonutChart;

