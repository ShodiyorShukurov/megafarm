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

import React, { useEffect, useState } from 'react';
import Admin from '../../components/Admin';
import ReactApexChart from 'react-apexcharts';
import UseDashboard from '../../hooks/UseDashboard';

interface MonthlyAmount {
  month: string;
  total_amount: number;
}

const ApexChart: React.FC = () => {
  const { data, isLoading, error } = UseDashboard();

  const formattedData: MonthlyAmount[] =
    data?.monthly_amount?.map((item: any) => ({
      month: item.month.trim(),
      total_amount: parseInt(item.total_amount, 10),
    })) || [];

  const branchName = data?.monthly_amount?.[0]?.name_uz || 'Filial';

  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[];
    options: ApexCharts.ApexOptions;
  }>({
    series: [
      {
        name: branchName,
        data: [],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: { enabled: false },
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'straight' },
      title: {
        text: 'Product Trends by Month',
        align: 'left',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [],
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        x: {
          show: true,
        },
        y: {
          formatter: (val: number) => `${val.toLocaleString()} so'm`,
        },
      },
    },
  });

  useEffect(() => {
    if (formattedData.length) {
      const months = formattedData.map((item) => item.month);
      const totalAmounts = formattedData.map((item) => item.total_amount);

      setChartData((prevState) => ({
        ...prevState,
        series: [
          {
            name: branchName,
            data: totalAmounts,
          },
        ],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: months,
          },
        },
      }));
    }
  }, [formattedData, branchName]);

  if (isLoading) return <Admin>Loading...</Admin>;
  if (error) return <Admin>Error: {error.message}</Admin>;

  return (
    <Admin>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={350}
      />
    </Admin>
  );
};

export default ApexChart;
