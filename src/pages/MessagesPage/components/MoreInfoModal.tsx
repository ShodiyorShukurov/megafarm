import { Button, Descriptions, Modal, Image, Tag } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React from 'react';
import api from '../../../api';
import { useQuery } from '@tanstack/react-query';

interface MoreInfoProps {
  isModalMessageOpen: boolean;
  selectedMessage: string | null;
  handleCloseModal: () => void;
}

const MoreInfo: React.FC<MoreInfoProps> = ({
  isModalMessageOpen,
  selectedMessage,
  handleCloseModal,
}) => {
  const getMessageDetails = async () => {
    if (!selectedMessage) return null;
    try {
      const res = await api.get(`/message/${selectedMessage}`);
      return res.data.data;
    } catch (error) {
      console.error('Error fetching message details:', error);
      throw new Error('Failed to fetch message details');
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['messageData', selectedMessage],
    queryFn: getMessageDetails,
  });

  if (isLoading)
    return (
      <Modal
        title={
          <div className="flex items-center">
            <InfoCircleOutlined className="text-blue-500 mr-2" />
            Message Details
          </div>
        }
        open={isModalMessageOpen}
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
            Message Details
          </div>
        }
        open={isModalMessageOpen}
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
          Message Details
        </div>
      }
      open={isModalMessageOpen}
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
            <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
            <Descriptions.Item label="Text">
              <div
                style={{
                  maxWidth: 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Language">
             <Tag color={'green'}>{data.bot_lang.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Balance From">
              {data.balance_from || 'No Data'}
            </Descriptions.Item>
            <Descriptions.Item label="Balance To">
              {data.balance_to || 'No Data'}
            </Descriptions.Item>
            <Descriptions.Item label="Image">
              {data.file_url ? (
                <Image
                  src={data.file_url}
                  alt="file"
                  width={100}
                  height={100}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                'No Image'
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  );
};

export default MoreInfo;