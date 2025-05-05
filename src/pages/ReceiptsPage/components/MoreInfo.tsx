import { Button, Descriptions, Modal, Table } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { IItem, IPayment, IReceipt } from '../../../types/interface';

interface MoreInfoProps {
  isModalOpen: boolean;
  selectedReceipt: IReceipt | null;
  handleCloseModal: () => void;
}

const MoreInfo: React.FC<MoreInfoProps> = ({
  isModalOpen,
  selectedReceipt,
  handleCloseModal,
}) => {
    
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
      title: 'Product ID',
      dataIndex: 'product_id',
      key: 'product_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (value) => `${value.toLocaleString()} UZS`,
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center">
          <InfoCircleOutlined className="text-blue-500 mr-2" />
          Receipt Details
        </div>
      }
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer={
        <div className="flex justify-end">
          <Button type="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </div>
      }
      centered
      width={600}
      className="rounded-lg"
    >
      {selectedReceipt && (
        <div>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">
              {selectedReceipt.id}
            </Descriptions.Item>
            <Descriptions.Item label="Receipt No">
              {selectedReceipt.receipt_no}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              {selectedReceipt.type}
            </Descriptions.Item>
            <Descriptions.Item label="User ID">
              {selectedReceipt.user_id}
            </Descriptions.Item>
            <Descriptions.Item label="Branch">
              {selectedReceipt.branch}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {selectedReceipt.date}
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              {selectedReceipt.amount.toLocaleString()} UZS
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(selectedReceipt.created_at).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
          <h3 className="text-lg font-semibold mt-6 mb-4">Payments</h3>
          <Table
            columns={paymentColumns}
            dataSource={selectedReceipt.payments}
            rowKey="name"
            pagination={false}
            size="small"
          />
          <h3 className="text-lg font-semibold mt-6 mb-4">Items</h3>
          <Table
            columns={itemColumns}
            dataSource={selectedReceipt.items}
            rowKey="product_id"
            pagination={false}
            size="small"
          />
        </div>
      )}
    </Modal>
  );
};

export default MoreInfo;
