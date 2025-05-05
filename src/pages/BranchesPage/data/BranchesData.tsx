import { Table, Button, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { IBranch } from '../../../types/interface';

interface BranchesDataProps {
  data: IBranch[];
  handleViewDetails: (id: number) => void;
  handleOpenFormModal: (record: IBranch) => void;
  handleDeleteModal: (id: number | null) => void;
}

const BranchesData: React.FC<BranchesDataProps> = ({
  data,
  handleViewDetails,
  handleOpenFormModal,
  handleDeleteModal,
}) => {
  const columns: ColumnsType<IBranch> = [
    {
      title: '№',
      dataIndex: 'id',
      key: 'id',
      render: (_, __, index) => index + 1,
      align: 'center',
    },
    {
      title: 'Name (UZ)',
      dataIndex: 'name_uz',
      key: 'name_uz',
      sorter: (a, b) => a.name_uz.localeCompare(b.name_uz),
      align: 'center',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      render: (phones: string[]) => phones.map((phone) => (
        <a href={'tel:' + phone} key={phone}>
          {phone} <br />
        </a>)),
      align: 'center',
    },
    {
      title: 'Address (UZ)',
      dataIndex: 'address_uz',
      key: 'address_uz',
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
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleOpenFormModal(record)}
          />
          <Popconfirm
            title="Are you sure to delete this branch?"
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
            onClick={() => handleViewDetails(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Branches</h1>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
        className="shadow-lg rounded-lg"
      />
    </div>
  );
};

export default BranchesData;
