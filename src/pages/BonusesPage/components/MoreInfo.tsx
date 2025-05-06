import { Button, Descriptions, Modal, Tag } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import api from '../../../api';
import { useQuery } from '@tanstack/react-query';

interface MoreInfoProps {
  isModalOpen: boolean;
  selectedBonus: number | null;
  handleCloseModal: () => void;
}

const MoreInfo: React.FC<MoreInfoProps> = ({
  isModalOpen,
  selectedBonus,
  handleCloseModal,
}) => {
    

  const getBonusDetails = async () => {
    if (!selectedBonus) return null;
    try {
      const res = await api.get(`/bonus/${selectedBonus}`);

      return res.data.data;
    } catch (error) {}
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['bonusData', selectedBonus],
    queryFn: getBonusDetails,
  });

  if (isLoading)
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
        Loading...
      </Modal>
    );

    if (error)
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
        Error: {error.message}
      </Modal>
    );

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
      {data && (
        <div>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">
              {data.id}
            </Descriptions.Item>
            <Descriptions.Item label="Receipt No">
              {data.receipt_no}
            </Descriptions.Item>
            <Descriptions.Item label="User ID">
              {data.user_id}
            </Descriptions.Item>
            <Descriptions.Item label="Income">
            <Tag color={data.income ? 'green' : 'red'}>
            {data.income ? 'True' : 'False'}
          </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              {data?.amount} UZS
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(data.created_at).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  );
};

export default MoreInfo;
