import { Button, Input, InputNumber, Modal, Form, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import api from '../../../api';
import { useQueryClient } from '@tanstack/react-query';

interface UserEditModalProps {
  selectedUser: { name: string; balance: number; id: number } | null;
  isEditModalOpen: boolean;
  handleCloseEditModal: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  selectedUser,
  isEditModalOpen,
  handleCloseEditModal,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedUser) {
      form.setFieldsValue({
        name: selectedUser.name,
        balance: selectedUser.balance,
      });
    } else {
      form.resetFields();
    }
  }, [selectedUser, form]);

  const queryClient = useQueryClient();

  const handleFinish = async (values: { name: string; balance: number }) => {
    try {
      const res = await api.put(`/user/edit`, {
        id: selectedUser?.id,
        name: values.name,
        balance: values.balance,
      });
      if (res.status === 200) {
        message.success('User updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['userData'] });
      } else {
        message.error('Failed to update user!');
      }
    } catch (error) {
      message.error('Failed to update user!');
    }

    handleCloseEditModal();
  };

  return (
    <Modal
      open={isEditModalOpen}
      onCancel={handleCloseEditModal}
      title={
        <div className="flex items-center">
          <EditOutlined className="text-blue-500 mr-2" />
          Edit User
        </div>
      }
      footer={
        <div className="flex justify-end space-x-2">
          <Button onClick={handleCloseEditModal}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => form.submit()}
          >
            Save
          </Button>
        </div>
      }
      centered
      width={400}
      className="rounded-lg"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the name!' }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item
          label="Balance"
          name="balance"
          rules={[{ required: true, message: 'Please enter the balance!' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            formatter={(value) => `${value} `}
            parser={(value) => value?.replace(' UZS', '') as any}
            placeholder="Enter balance"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserEditModal;
