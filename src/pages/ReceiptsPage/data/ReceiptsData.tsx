import { Table, Button} from 'antd';
import { useState, useEffect } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { InfoCircleOutlined } from '@ant-design/icons';
import { IReceipt } from '../../../types/interface';

interface ReceiptsDataProps {
  handleViewDetails: (record: IReceipt) => void;
}

const ReceiptsData: React.FC<ReceiptsDataProps> = ({handleViewDetails}) => {
  const [data, setData] = useState<IReceipt[]>([]);


  useEffect(() => {
    const sampleData: IReceipt[] = [
      {
        id: 1,
        receipt_no: 0,
        type: 'string',
        user_id: 0,
        branch: 0,
        date: 'string',
        payments: [
          {
            name: 'CASH',
            value: 10000,
          },
        ],
        amount: 89,
        items: [
          {
            product_id: 101,
            name: 'Paracetamol',
            quantity: 2,
            price: 5000,
          },
        ],
        created_at: '2025-05-03T11:10:53.990Z',
      },
      {
        id: 2,
        receipt_no: 0,
        type: 'string',
        user_id: 0,
        branch: 0,
        date: 'string',
        payments: [
          {
            name: 'CASH',
            value: 10000,
          },
        ],
        amount: 78,
        items: [
          {
            product_id: 101,
            name: 'Paracetamol',
            quantity: 2,
            price: 5000,
          },
        ],
        created_at: '2025-05-03T11:10:53.990Z',
      },
    ];
    setData(sampleData);
  }, []);


  const columns: ColumnsType<IReceipt> = [
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
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
    },
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id',
      align: 'center',
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      align: 'center',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
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
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
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

export default ReceiptsData;