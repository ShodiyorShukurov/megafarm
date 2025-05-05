import { Button, Descriptions, Image, Modal, Tag } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import api from '../../../api';
import { useQuery } from '@tanstack/react-query';

interface BranchMoreInfoProps {
  isModalMoreInfo: boolean;
  handleCloseModal: () => void;
  selectedBranchMoreInfo: number | null;
}

const BranchMoreInfo: React.FC<BranchMoreInfoProps> = ({
  isModalMoreInfo,
  handleCloseModal,
  selectedBranchMoreInfo,
}) => {
  const getBranchDetails = async () => {
    if (!selectedBranchMoreInfo) return null;
    try {
      const res = await api.get(`/branch/${selectedBranchMoreInfo}`);

      return res.data.data;
    } catch (error) {}
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['branchData', selectedBranchMoreInfo],
    queryFn: getBranchDetails,
  });

  if (isLoading)
    return (
      <Modal
        title={
          <div className="flex items-center">
            <InfoCircleOutlined className="text-blue-500 mr-2" />
            Branch Details
          </div>
        }
        open={isModalMoreInfo}
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
            Branch Details
          </div>
        }
        open={isModalMoreInfo}
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
        Error loading branch details
      </Modal>
    );

  return (
    <Modal
      title={
        <div className="flex items-center">
          <InfoCircleOutlined className="text-blue-500 mr-2" />
          Branch Details
        </div>
      }
      open={isModalMoreInfo}
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
      <Descriptions column={1} bordered>
        <Descriptions.Item label="ID">{data?.id}</Descriptions.Item>
        <Descriptions.Item label="Branch ID">
          {data?.branch_id}
        </Descriptions.Item>
        <Descriptions.Item label="Name (UZ)">{data?.name_uz}</Descriptions.Item>
        <Descriptions.Item label="Name (RU)">{data?.name_ru}</Descriptions.Item>
        <Descriptions.Item label="Phone Number">
          {data?.phone_number.map((phone: string, index: number) => (
            <a href={'tel:' + phone}>
              <Tag key={index} color="blue" className="cursor-pointer">
                {phone}
              </Tag>
            </a>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="Schedule">{data?.schedule}</Descriptions.Item>
        <Descriptions.Item label="Address (UZ)">
          {data?.address_uz}
        </Descriptions.Item>
        <Descriptions.Item label="Address (RU)">
          {data?.address_ru}
        </Descriptions.Item>
        <Descriptions.Item label="Landmark (UZ)">
          {data?.landmark_uz}
        </Descriptions.Item>
        <Descriptions.Item label="Landmark (RU)">
          {data?.landmark_ru}
        </Descriptions.Item>
        <Descriptions.Item label="Address Link">
          <a
            href={data?.address_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Maps
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="Image">
          <Image
            src={data?.image_url}
            alt={data?.image_name}
            width={100}
            height={100}
            preview
          />
        </Descriptions.Item>
        <Descriptions.Item label="Latitude">{data?.latitude}</Descriptions.Item>
        <Descriptions.Item label="Longitude">
          {data?.longitude}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {new Date(data?.created_at).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default BranchMoreInfo;
