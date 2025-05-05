import { Button, Descriptions, Modal, Tag } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { IBonunes } from '../../../types/interface';

interface MoreInfoProps {
  isModalOpen: boolean;
  selectedBonus: IBonunes | null;
  handleCloseModal: () => void;
}

const MoreInfo: React.FC<MoreInfoProps> = ({
  isModalOpen,
  selectedBonus,
  handleCloseModal,
}) => {
    

  return (
    <Modal
      title={
        <div className="flex items-center">
          <InfoCircleOutlined className="text-blue-500 mr-2" />
          Bonus Details
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
      {selectedBonus && (
        <div>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">
              {selectedBonus.id}
            </Descriptions.Item>
            <Descriptions.Item label="Receipt No">
              {selectedBonus.receipt_no}
            </Descriptions.Item>
            <Descriptions.Item label="User ID">
              {selectedBonus.user_id}
            </Descriptions.Item>
            <Descriptions.Item label="Income">
            <Tag color={selectedBonus.income ? 'green' : 'red'}>
            {selectedBonus.income ? 'True' : 'False'}
          </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              {selectedBonus.amount.toLocaleString()} UZS
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(selectedBonus.created_at).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  );
};

export default MoreInfo;
