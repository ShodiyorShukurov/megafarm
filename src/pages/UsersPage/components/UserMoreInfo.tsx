import { Button, Descriptions, Image, Modal, Tag } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import api from '../../../api';
import { useQuery } from '@tanstack/react-query';

interface UserMoreInfoProps {
  isUserMoreInfoOpen: boolean;
  selectedUserMoreInfo: number | null;
  handleCloseUserMoreInfo: () => void;
}

const UserMoreInfo: React.FC<UserMoreInfoProps> = ({
  isUserMoreInfoOpen,
  selectedUserMoreInfo,
  handleCloseUserMoreInfo,
}) => {
  const getUserMoreInfo = async () => {
    if (!selectedUserMoreInfo) return null;
    try {
      const res = await api.get(`/user/${selectedUserMoreInfo}`);
      return res.data.data;
    } catch (error) {
      console.error('Error fetching user more info:', error);
      throw new Error('Failed to fetch user more info');
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['userMoreInfo', selectedUserMoreInfo],
    queryFn: getUserMoreInfo,
    enabled: !!selectedUserMoreInfo,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching user more info</div>;
  }

  return (
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
      width={500}
      className="rounded-lg"
    >
      <Descriptions column={1} bordered>
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
    </Modal>
  );
};

export default UserMoreInfo;
