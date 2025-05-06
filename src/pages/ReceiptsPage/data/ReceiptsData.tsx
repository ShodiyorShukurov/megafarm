import { Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { InfoCircleOutlined } from '@ant-design/icons';
import { IReceipt } from '../../../types/interface';

interface ReceiptsDataProps {
  handleViewDetails: (record: string) => void;
  data: IReceipt[];
  count: number;
  setCurrentPage: (page: number) => void;
  currentPage: number;  
}

const ReceiptsData: React.FC<ReceiptsDataProps> = ({
  handleViewDetails,
  data,
  setCurrentPage,
  currentPage,
  count
}) => {
console.log(data, 'data receipts');

  const columns: ColumnsType<IReceipt> = [
    {
      title: '№',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => Number(a.id) - Number(b.id),
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
      sorter: (a, b) => Number(a.amount) - Number(b.amount),
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
          current: currentPage,
          pageSize: 10,
          total: count,
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={{ x: 1000 }}
        className="shadow-lg rounded-lg"
      />
    </div>
  );
};

export default ReceiptsData;
