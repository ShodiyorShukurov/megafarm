import { Modal, Form, Input, Button, message, Select } from 'antd';
import { PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import api from '../../../api';
import { IAdmin } from '../../../types/interface';
import { useQueryClient } from '@tanstack/react-query';

interface BranchModalProps {
  isModalOpen: boolean;
  handleCloseFormModal: () => void;
  selectedAdmin: null | IAdmin;
  handleOpenFormModal: (record: IAdmin | null) => void;
}

const AdminModal: React.FC<BranchModalProps> = ({
  isModalOpen,
  handleCloseFormModal,
  selectedAdmin,
  handleOpenFormModal,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedAdmin) {
      form.setFieldsValue({
        admin_email: selectedAdmin.admin_email,
        role: selectedAdmin.role,
      });
    } else {
      form.resetFields();
    }
  }, [selectedAdmin, form]);

  const queryClient = useQueryClient();

  const handleFinish = async (values: IAdmin) => {
    try {
      const data: {
        admin_email: string;
        role: string;
        admin_password: string;
        admin_id?: string;
      } = {
        admin_email: values.admin_email,
        role: values.role,
        admin_password: values.admin_password,
      };

      if (selectedAdmin?.admin_id) {
        data.admin_id = selectedAdmin.admin_id;
        const res = await api.put('/admin/edit', data);

        if (res.data.status === 200) {
          message.success('Admin updated successfully!');
        }
        if (res.data.status === 400) {
          message.error('Failed to update admin!');
        }
        if (res.data.status === 500) {
          message.error('Server error!');
        }
      } else {
        const res = await api.post('/admin/register', data);

        if (res.data.status === 200) {
          message.success('Admin created successfully!');
        }
        if (res.data.status === 400) {
          message.error('Failed to create admin!');
        }
        if (res.data.status === 500) {
          message.error('Server error!');
        }
      }
      queryClient.invalidateQueries({ queryKey: ['adminData'] });
      handleCloseFormModal();
      form.resetFields();
    } catch (error) {
      console.error('Error creating branch:', error);
      message.error('Failed to create branch!');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Admins</h1>
      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={() => handleOpenFormModal(null)}
        className="mb-4"
      >
        Add New Admin
      </Button>
      <Modal
        title={
          <div className="flex items-center">
            {selectedAdmin?.id ? (
              <EditOutlined className="text-blue-500 mr-2" />
            ) : (
              <PlusCircleOutlined className="text-blue-500 mr-2" />
            )}
            {selectedAdmin?.id ? 'Edit Admin' : 'Add New Admin'}
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseFormModal}
        footer={null}
        className="rounded-lg"
      >
        <Form
          form={form}
          onFinish={handleFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Admin Email"
            name="admin_email"
            rules={[
              { required: true, message: 'Please enter the admin email!' },
            ]}
            className="mb-4"
          >
            <Input placeholder="Enter admin email" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select the role!' }]}
            className="mb-4"
          >
            <Select placeholder="Select role" style={{ width: '100%' }}>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="superadmin">Superadmin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Password"
            name="admin_password"
            rules={
              !selectedAdmin?.admin_password
                ? [
                    {
                      required: true,
                      message: 'Please enter the admin password!',
                    },
                  ]
                : []
            }
            className="mb-4"
          >
            <Input.Password
              placeholder="Enter admin password"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item className="col-span-2">
            <div className="flex justify-end space-x-2">
              <Button onClick={handleCloseFormModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminModal;
