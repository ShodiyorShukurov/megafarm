import { Table, Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { InfoCircleOutlined } from '@ant-design/icons';
import { IBonunes } from '../../../types/interface';

interface ReceiptsDataProps {
  data: IBonunes[];
  handleViewDetails: (record: number) => void;
  count: number;
  currentPage: number;
  setCurrentPage: (page: number) => void; 
}

const BonunesData: React.FC<ReceiptsDataProps> = ({
  handleViewDetails,
  data,
  count,
  currentPage,
  setCurrentPage,
}) => {
  const columns: ColumnsType<IBonunes> = [
    {
      title: 'ID',
      dataIndex: 'index',
      key: 'index',
      sorter: (a, b) => a.id - b.id,
      align: 'center',
      render: (_, __, index) => index + 1,
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
        <Tag color={value ? 'green' : 'red'}>{value ? 'True' : 'False'}</Tag>
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
          onClick={() => handleViewDetails(record.id)}
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
        pagination={{
          total: count,
          pageSize: 10,
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={{ x: 1000 }}
        className="shadow-lg rounded-lg"
      />
    </div>
  );
};

export default BonunesData;
