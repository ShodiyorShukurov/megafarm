import { Table, Button, Tag } from 'antd';
import { useState, useEffect } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { InfoCircleOutlined } from '@ant-design/icons';
import { IBonunes } from '../../../types/interface';

interface ReceiptsDataProps {
  handleViewDetails: (record: IBonunes) => void;
}

const BonunesData: React.FC<ReceiptsDataProps> = ({ handleViewDetails }) => {
  const [data, setData] = useState<IBonunes[]>([]);

  useEffect(() => {
    const sampleData: IBonunes[] = [
      {
        id: 1,
        receipt_no: 0,
        user_id: 0,
        amount: 89,
        income: true,
        created_at: '2025-05-03T11:10:53.990Z',
      },
    ];
    setData(sampleData);
  }, []);

  const columns: ColumnsType<IBonunes> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      align: 'center',
    },
    {
      title: 'Receipt No',
      dataIndex: 'receipt_no',
      key: 'receipt_no',
      sorter: (a, b) => a.receipt_no - b.receipt_no,
      align: 'center',
    },
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id',
      align: 'center',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (value) => `${value.toLocaleString()} UZS`,
      sorter: (a, b) => a.amount - b.amount,
      align: 'center',
    },
    {
        title: 'Income',
        dataIndex: 'income',
        key: 'income',
        render: (value: boolean) => (
          <Tag color={value ? 'green' : 'red'}>
            {value ? 'True' : 'False'}
          </Tag>
        ),
        sorter: (a, b) => Number(a.income) - Number(b.income),
        align: 'center',
      },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<InfoCircleOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
        className="shadow-lg rounded-lg"
      />
    </div>
  );
};

export default BonunesData;
