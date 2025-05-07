import { Table, Image, Tag, Button, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { IUser } from '../../../types/interface';

interface UserDataProps {
  data:IUser[];
  count:number;
  handleOpenEditModal: (record: IUser) => void;
  handleOpenUserMoreInfo: (userId: number, chat_id:number) => void;
  handleDeleteModal: (id: number | null) => void;
  setCurrentPage: (page: number) => void;
  currentPage: number;
}

const UserData: React.FC<UserDataProps> = ({
  data,
  handleOpenEditModal,
  handleOpenUserMoreInfo,
  handleDeleteModal,
  setCurrentPage,
  currentPage,
  count
}) => {
  const columns: ColumnsType<IUser> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      align: 'center',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'center',
      render: (phone_number) => (
        <a href={'tel:' + phone_number}>{phone_number}</a>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (value) => `${value.toLocaleString()} UZS`,
      sorter: (a, b) => a.balance - b.balance,
      align: 'center',
    },
    {
      title: 'QR Code',
      dataIndex: 'qrcode_image_url',
      key: 'qrcode_image_url',
      render: (url) => (
        <Image src={url} alt="QR Code" width={50} height={50} preview />
      ),
      align: 'center',
    },
    {
      title: 'Chat ID',
      dataIndex: 'chat_id',
      key: 'chat_id',
      align: 'center',
    },
    {
      title: 'Bot Language',
      dataIndex: 'bot_lang',
      key: 'bot_lang',
      align: 'center',
      render: (lang) => (
        <Tag color={'green'}>{lang.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteModal(record.id)}
            onCancel={() => handleDeleteModal(null)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
            icon={<ExclamationCircleOutlined className="text-red-500" />}
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button
            type="default"
            icon={<InfoCircleOutlined />}
            onClick={() => handleOpenUserMoreInfo(record.id, record.chat_id)}
          />
        </Space>
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
        scroll={{ x: 1200 }}
        className="shadow-lg rounded-lg"
      />
    </div>
  );
};

export default UserData;
