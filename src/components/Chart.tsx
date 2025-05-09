import React, { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface MonthlyAmount {
  month: string;
  total_amount: number;
}

interface ChartProps {
  data: {
    monthly_amount: MonthlyAmount[];
  };
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  const monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formattedData: MonthlyAmount[] = useMemo(() => {
    return (data?.monthly_amount || [])
      .map((item: any) => ({
        month: item.month?.trim() || 'Unknown',
        total_amount: Number(item.total_amount) || 0,
      }))
      .filter((item) => !isNaN(item.total_amount) && item.month !== 'Unknown')
      .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
  }, [data]);

  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[];
    options: ApexCharts.ApexOptions;
  }>({
    series: [{ name: 'Total Amount', data: [] }],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: { enabled: false },
        animations: {
          enabled: true,
        //   easing: 'easeinout',
          speed: 800,
        },
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      title: {
        text: 'Monthly Transaction Trends',
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#263238',
        },
      },
      grid: {
        row: {
          colors: ['#f5f5f5', 'transparent'],
          opacity: 0.5,
        },
        borderColor: '#e0e0e0',
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#595959',
            fontSize: '12px',
          },
        },
        axisBorder: { show: true, color: '#d9d9d9' },
        axisTicks: { show: true, color: '#d9d9d9' },
      },
      yaxis: {
        labels: {
          formatter: (val: number) => `${val.toLocaleString()} UZS`,
          style: {
            colors: '#595959',
            fontSize: '12px',
          },
        },
      },
      tooltip: {
        enabled: true,
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: (val: number) => {
            console.log(val, 'tooltip value');
            return `${val.toLocaleString()} UZS`;
          },
        },
        x: {
          formatter: (_: number, { dataPointIndex }) => {
            return formattedData[dataPointIndex]?.month || '';
          },
        },
      },
      colors: ['#5B8FF9'],
      markers: {
        size: 5,
        colors: ['#fff'],
        strokeColors: '#5B8FF9',
        strokeWidth: 2,
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
            name: 'Total Amount',
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
  }, [formattedData]);


  if (!formattedData.length) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#595959' }}>
        No data available for the chart.
      </div>
    );
  }

  return (
    <div id="chart" style={{ width: '100%', padding: '16px', position: 'relative', zIndex: 1, overflow: 'visible' }}>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={350}
        style={{ minHeight: 350 }}
      />
    </div>
  );
};

export default Chart;