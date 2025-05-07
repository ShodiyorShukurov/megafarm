import { Button, Descriptions, Image, Modal, Table, Tag } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import api from '../../../api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { IItem, IPayment, IReceipt } from '../../../types/interface';

interface UserMoreInfoProps {
  isUserMoreInfoOpen: boolean;
  selectedUserMoreInfo: { id: number; chat_id: number } | null;
  handleCloseUserMoreInfo: () => void;
}

const UserMoreInfo: React.FC<UserMoreInfoProps> = ({
  isUserMoreInfoOpen,
  selectedUserMoreInfo,
  handleCloseUserMoreInfo,
}) => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<IReceipt | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const getUserMoreInfo = async () => {
    if (!selectedUserMoreInfo?.id) return null;
    try {
      const res = await api.get(`/user/${selectedUserMoreInfo?.id}`);
      return res.data.data;
    } catch (error) {
      console.error('Error fetching user more info:', error);
      if (error instanceof Error && (error as any).response && (error as any).response.status === 404) {
        return []; 
      }
      return [];
    }
  };
  
  const getUserTransactions = async () => {
    if (!selectedUserMoreInfo?.chat_id) return null;
    try {
      const res = await api.get(
        `/receipts/list?limit=10&page=${currentPage}&user_id=${selectedUserMoreInfo?.chat_id}`
      );
      return res.data;
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      if (error instanceof Error && (error as any).response && (error as any).response.status === 404) {
        return []; 
      }
      return [];
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['userMoreInfo', selectedUserMoreInfo?.id],
    queryFn: getUserMoreInfo,
    enabled: !!selectedUserMoreInfo?.id,
  });

  const {
    data: userTransactionData,
    isLoading: userTransactionLoading,
    error: userTransactionError,
  } = useQuery({
    queryKey: ['userTransactionInfo', selectedUserMoreInfo?.chat_id, currentPage],
    queryFn: getUserTransactions,
    enabled: !!selectedUserMoreInfo?.chat_id,
  });

  const handleViewTransactionDetails = (record: IReceipt) => {
    setSelectedTransaction(record);
    setIsTransactionModalOpen(true);
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setSelectedTransaction(null);
  };

  const transactionColumns: ColumnsType<IReceipt> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Receipt No',
      dataIndex: 'receipt_no',
      key: 'receipt_no',
      align: 'center',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
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
      render: (date) => new Date(date).toLocaleString(),
      align: 'center',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (value) => `${parseFloat(value).toLocaleString()} UZS`,
      align: 'center',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleString(),
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
          onClick={() => handleViewTransactionDetails(record)}
        >
          More Info
        </Button>
      ),
    },
  ];

  const paymentColumns: ColumnsType<IPayment> = [
    {
      title: 'Payment Method',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value) => `${value.toLocaleString()} UZS`,
    },
  ];

  const itemColumns: ColumnsType<IItem> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (value) => `${value.toLocaleString()} UZS`,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (value) => `${value.toLocaleString()} UZS`,
    },
  ];

  if (isLoading || userTransactionLoading) {
    return <div>Loading...</div>;
  }

  if (error || userTransactionError) {
    return <div>Error fetching user more info</div>;
  }

  return (
    <>
      <Modal
        open={isUserMoreInfoOpen}
        onCancel={handleCloseUserMoreInfo}
        title={
          <div className="flex items-center">
            <InfoCircleOutlined className="text-blue-500 mr-2" />
            User Details
          </div>
        }
        footer={
          <div className="flex justify-end">
            <Button type="primary" onClick={handleCloseUserMoreInfo}>
              Close
            </Button>
          </div>
        }
        centered
        width={800}
        className="rounded-lg"
      >
        <Descriptions column={1} bordered className="mb-6">
          <Descriptions.Item label="ID">{data?.id}</Descriptions.Item>
          <Descriptions.Item label="Name">{data?.name}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">
            <a href={'tel:' + data?.phone_number}>{data?.phone_number}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Code">{data?.code}</Descriptions.Item>
          <Descriptions.Item label="Balance">{data?.balance}</Descriptions.Item>
          <Descriptions.Item label="QR Code">
            <Image
              src={data?.qrcode_image_url}
              alt="QR Code"
              width={100}
              height={100}
              preview
            />
          </Descriptions.Item>
          <Descriptions.Item label="Chat ID">{data?.chat_id}</Descriptions.Item>
          <Descriptions.Item label="Bot Language">
            <Tag color="green">{data?.bot_lang.toUpperCase()}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Bot Step">{data?.bot_step}</Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(data?.created_at).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
        <h3 className="text-lg font-semibold mb-4">Transactions</h3>
        <Table
          columns={transactionColumns}
          dataSource={userTransactionData?.data}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: userTransactionData?.count,
            onChange: (page) => setCurrentPage(page),
          }}
          scroll={{ x: 1000 }}
          className="shadow-lg rounded-lg"
        />
      </Modal>
      <Modal
        title={
          <div className="flex items-center">
            <InfoCircleOutlined className="text-blue-500 mr-2" />
            Transaction Details
          </div>
        }
        open={isTransactionModalOpen}
        onCancel={handleCloseTransactionModal}
        footer={
          <div className="flex justify-end">
            <Button type="primary" onClick={handleCloseTransactionModal}>
              Close
            </Button>
          </div>
        }
        centered
        width={600}
        className="rounded-lg"
      >
        {selectedTransaction && (
          <div>
            <Descriptions column={1} bordered className="mb-6">
              <Descriptions.Item label="ID">{selectedTransaction.id}</Descriptions.Item>
              <Descriptions.Item label="Receipt No">{selectedTransaction.receipt_no}</Descriptions.Item>
              <Descriptions.Item label="Type">{selectedTransaction.type}</Descriptions.Item>
              <Descriptions.Item label="User ID">{selectedTransaction.user_id}</Descriptions.Item>
              <Descriptions.Item label="Branch">{selectedTransaction.branch}</Descriptions.Item>
              <Descriptions.Item label="Date">
                {new Date(selectedTransaction.date).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Amount">
                {parseFloat(selectedTransaction.amount).toLocaleString()} UZS
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(selectedTransaction.created_at).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
            <h3 className="text-lg font-semibold mb-4">Payments</h3>
            <Table
              columns={paymentColumns}
              dataSource={selectedTransaction.payments}
              rowKey="name"
              pagination={false}
              size="small"
            />
            <h3 className="text-lg font-semibold mb-4 mt-6">Items</h3>
            <Table
              columns={itemColumns}
              dataSource={selectedTransaction.items}
              rowKey="name"
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default UserMoreInfo;