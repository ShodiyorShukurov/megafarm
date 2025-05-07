// import { Column } from '@ant-design/plots';
// import { Card } from 'antd';
// import { useEffect, useRef } from 'react';

// const rawData = [
//   { letter: 'A', frequency1: 8167, frequency2: 7167, frequency3: 6167 },
//   { letter: 'B', frequency1: 1492, frequency2: 1392, frequency3: 1292 },
//   { letter: 'C', frequency1: 2782, frequency2: 2682, frequency3: 2582 },
//   { letter: 'D', frequency1: 4253, frequency2: 4153, frequency3: 4053 },
//   { letter: 'E', frequency1: 12702, frequency2: 12602, frequency3: 12502 },
//   { letter: 'F', frequency1: 2288, frequency2: 2188, frequency3: 2088 },
// ];

// const chartData = rawData.flatMap(({ letter, frequency1, frequency2, frequency3 }) => [
//   { letter, frequency: frequency1, category: 'Frequency 1' },
//   { letter, frequency: frequency2, category: 'Frequency 2' },
//   { letter, frequency: frequency3, category: 'Frequency 3' },
// ]);

// const DemoSixCharts = () => {
//   const chartRef = useRef<any>(null);

//   const config = {
//     data: chartData,
//     xField: 'letter',
//     yField: 'frequency',
//     seriesField: 'category',
//     isGroup: true,
//     height: 400,
//     columnStyle: {
//       radius: [4, 4, 0, 0],
//     },
//     color: ['#1f77b4', '#ff7f0e', '#2ca02c'],
//     legend: {
//       position: 'top' as const,
//     },
//     tooltip: {
//       formatter: (datum: any) => ({
//         name: datum.category,
//         value: datum.frequency,
//       }),
//     },
//   };

//   // Tooltipni grafikdan so‘ng ko‘rsatish
//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current;
//       const tooltipItem = chartData[0]; // Istalgan nuqta

//       const point = chart.getXY(tooltipItem); // x/y koordinatalarini olamiz
//       if (point) {
//         chart.showTooltip(point);
//       }
//     }
//   }, []);

//   return (
//     <Card title="Manga Letter Frequencies">
//       <Column {...config} onReady={(chart) => (chartRef.current = chart)} />
//     </Card>
//   );
// };

// export default DemoSixCharts;

import React from 'react';
import { Line } from '@ant-design/charts';
import Admin from '../../components/Admin';

const Page: React.FC = () => {
  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];

  const config = {
    data,
    height: 400,
    xField: 'year',
    yField: 'value',
  };
  return (
    <Admin>
      <Line {...config} />
    </Admin>
  );
};
export default Page;
