import { Table, Button, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { IAdmin } from '../../../types/interface';

interface ReceiptsDataProps {
  data: IAdmin[];
  count: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  handleDeleteModal: (id: string | null) => void;
  handleOpenFormModal: (admin: IAdmin | null) => void;
}

const AdminAddData: React.FC<ReceiptsDataProps> = ({
  data,
  count,
  currentPage,
  setCurrentPage,
  handleDeleteModal,
  handleOpenFormModal,
}) => {
  const columns: ColumnsType<IAdmin> = [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      sorter: (a, b) => Number(a.id) - Number(b.id),
      render: (_, __, index) => index + 1,
      align: 'center',
    },
    {
      title: 'Admin Email',
      dataIndex: 'admin_email',
      key: 'admin_email',
      sorter: (a, b) => a.admin_email.localeCompare(b.admin_email),
      align: 'center',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleOpenFormModal(record)}
          />
          <Popconfirm
            title="Are you sure to delete this branch?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteModal(record.admin_id)}
            onCancel={() => handleDeleteModal(null)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
            icon={<ExclamationCircleOutlined className="text-red-500" />}
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="admin_id"
        pagination={{
          total: count,
          pageSize: 10,
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={{ x: 1000 }}
        className="shadow-lg rounded-lg"
      />
    </div>
  );
};

export default AdminAddData;
