import React, { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface CurrentMonth {
  branch_id: number;
  name_uz: string;
  total_amount: string;
  total_bonus: string;
  unique_users: string;
}

interface ChartProps {
  data: {
    current_month: CurrentMonth[];
  };
}

const ApexChartData: React.FC<ChartProps> = ({ data }) => {
  console.log('ApexChartData input:', data);

  // Memoize formatted data to prevent recomputation
  const formattedData = useMemo(() => {
    return (data?.current_month || []).map((item) => ({
      name_uz: item.name_uz?.trim() || 'Unknown',
      total_amount: Number(item.total_amount) || 0,
      total_bonus: Number(item.total_bonus) || 0,
      unique_users: Number(item.unique_users) || 0,
    }));
  }, [data]);

  console.log('formattedData:', formattedData);

  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[];
    options: ApexCharts.ApexOptions;
  }>({
    series: [
      { name: 'Total Amount', data: [] },
      { name: 'Total Bonus', data: [] },
      { name: 'Unique Users', data: [] },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        animations: {
          enabled: true,
        //   easing: 'easeinout',
          speed: 800,
        },
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
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 5,
          borderRadiusApplication: 'end',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#595959',
            fontSize: '12px',
          },
          rotate: -45,
          rotateAlways: true,
        },
        axisBorder: { show: true, color: '#d9d9d9' },
        axisTicks: { show: true, color: '#d9d9d9' },
      },
      yaxis: {
        labels: {
          formatter: (val: number) => val.toLocaleString(),
          style: {
            colors: '#595959',
            fontSize: '12px',
          },
        },
      },
      fill: {
        opacity: 1,
      },
      colors: ['#5B8FF9', '#FF6B6B', '#FFD700'],
      tooltip: {
        enabled: true,
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: (val: number, { seriesIndex }) => {
            console.log(val, `tooltip value for series ${seriesIndex}`);
            if (seriesIndex === 0) return `${val.toLocaleString()} UZS`; // Total Amount
            if (seriesIndex === 1) return `${val.toLocaleString(undefined, { minimumFractionDigits: 2 })} UZS`; // Total Bonus
            return `${val} users`; // Unique Users
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        fontSize: '12px',
      },
    },
  });

  useEffect(() => {
    if (formattedData.length) {
      const names = formattedData.map((item) => item.name_uz);
      const totalAmounts = formattedData.map((item) => item.total_amount);
      const totalBonuses = formattedData.map((item) => item.total_bonus);
      const uniqueUsers = formattedData.map((item) => item.unique_users);

      setChartData((prevState) => ({
        ...prevState,
        series: [
          { name: 'Total Amount', data: totalAmounts },
          { name: 'Total Bonus', data: totalBonuses },
          { name: 'Unique Users', data: uniqueUsers },
        ],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: names,
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
    <div style={{ width: '100%', padding: '16px', position: 'relative', zIndex: 1, overflow: 'visible' }}>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
        style={{ minHeight: 350 }}
      />
    </div>
  );
};

export default ApexChartData;