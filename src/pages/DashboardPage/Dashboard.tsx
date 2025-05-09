import React from 'react';
import Admin from '../../components/Admin';

import UseDashboard from '../../hooks/UseDashboard';
import { Card, Col, Row, Statistic } from 'antd';
import {
  DollarOutlined,
  GiftOutlined,
  UserOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import Chart from '../../components/Chart';
import ApexChartData from '../../components/ApexChart';

const ApexChart: React.FC = () => {
  const { data, isLoading, error } = UseDashboard();




  if (isLoading) return <Admin>Loading...</Admin>;
  if (error) return <Admin>Error: {error.message}</Admin>;

  return (
    <Admin>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Amount"
              value={Number(data?.total_amount || 0)}
              precision={0}
              formatter={(value) => `${value.toLocaleString()} UZS`}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Bonus"
              value={Number(data?.total_bonus || 0)}
              precision={2}
              formatter={(value) => `${value.toLocaleString()} UZS`}
              prefix={<GiftOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={Number(data?.total_user || 0)}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Receipts"
              value={Number(data?.total_receipt || 0)}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

     <Chart data={data}/>

     <ApexChartData data={data}/>
    </Admin>
  );
};

export default ApexChart;
