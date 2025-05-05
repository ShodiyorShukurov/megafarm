import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  Space,
  message,
} from 'antd';
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useEffect } from 'react';
import api from '../../../api';
import { IBranch } from '../../../types/interface';
import { useQueryClient } from '@tanstack/react-query';

interface BranchFormValues {
  branch_id: number;
  id?: number;
  name_uz: string;
  name_ru: string;
  phone_number: string[];
  schedule: string;
  address_uz: string;
  address_ru: string;
  landmark_uz: string;
  landmark_ru: string;
  address_link: string;
  latitude: number;
  longitude: number;
  image: { originFileObj: File }[] | null;
  image_url: string;
  image_name: string;
}

interface BranchModalProps {
  isModalOpen: boolean;
  handleCloseFormModal: () => void;
  selectedBranch: BranchFormValues | null | IBranch;
  handleOpenFormModal: (record: IBranch | null) => void;
}

const BranchModal: React.FC<BranchModalProps> = ({
  isModalOpen,
  handleCloseFormModal,
  selectedBranch,
  handleOpenFormModal,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedBranch) {
      form.setFieldsValue({
        branch_id: selectedBranch.branch_id,
        name_uz: selectedBranch.name_uz,
        name_ru: selectedBranch.name_ru,
        schedule: selectedBranch.schedule,
        address_uz: selectedBranch.address_uz,
        address_ru: selectedBranch.address_ru,
        landmark_uz: selectedBranch.landmark_uz,
        landmark_ru: selectedBranch.landmark_ru,
        address_link: selectedBranch.address_link,
        longitude: selectedBranch.longitude,
        latitude: selectedBranch.latitude,
        phone_number: selectedBranch.phone_number,
      });
    } else {
      form.resetFields();
    }
  }, [selectedBranch, form]);

  const queryClient = useQueryClient();

  const handleFinish = async (values: BranchFormValues) => {
    try {
      const formData = new FormData();
      formData.append('name_uz', values.name_uz);
      formData.append('branch_id', values.branch_id.toString());
      formData.append('name_ru', values.name_ru);
      if (Array.isArray(values.phone_number)) {
        if (values.phone_number.length === 1) {
          formData.append(
            'phone_number',
            JSON.stringify([values.phone_number[0]])
          );
        } else {
          values.phone_number.forEach((phone) => {
            formData.append('phone_number', phone);
          });
        }
      }
      formData.append('schedule', values.schedule);
      formData.append('address_uz', values.address_uz);
      formData.append('address_ru', values.address_ru);
      formData.append('landmark_uz', values.landmark_uz || '');
      formData.append('landmark_ru', values.landmark_ru || '');
      formData.append('address_link', values.address_link || '');
      formData.append('latitude', values.latitude.toString());
      formData.append('longitude', values.longitude.toString());
      formData.append(
        'image',
        values.image && values.image[0]?.originFileObj
          ? values.image[0].originFileObj
          : ''
      );

      if (selectedBranch?.id) {
        formData.append('id', selectedBranch.id.toString());
        const res = await api.put('/branch/edit', formData);
        
        if (res.data.status === 200) {
          message.success('Branch updated successfully!');
        }
        if (res.data.status === 400) {
          message.error('Failed to update branch!');
        }
        if (res.data.status === 500) {
          message.error('Server error!');
        }
      } else {
        const res = await api.post('/branch/add', formData);

        if (res.data.status === 200) {
          message.success('Branch created successfully!');
        }
        if (res.data.status === 400) {
          message.error('Failed to create branch!');
        }
        if (res.data.status === 500) {
          message.error('Server error!');
        }
      }
      queryClient.invalidateQueries({ queryKey: ['branchesData'] });
      handleCloseFormModal();
    } catch (error) {
      console.error('Error creating branch:', error);
      message.error('Failed to create branch!');
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList.slice(-1);
  };

  return (
    <div className="p-6">
      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={() => handleOpenFormModal(null)}
        className="mb-4"
      >
        Add New Branch
      </Button>
      <Modal
        title={
          <div className="flex items-center">
            <PlusCircleOutlined className="text-blue-500 mr-2" />
            Add New Branch
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseFormModal}
        footer={null}
        centered
        width={700}
        className="rounded-lg"
      >
        <Form
          form={form}
          onFinish={handleFinish}
          autoComplete="off"
          className="grid grid-cols-2 gap-4"
          layout="vertical"
        >
          <Form.Item
            label="Branch Id"
            name="branch_id"
            rules={[{ required: true, message: 'Please enter the branch id!' }]}
            className="mb-4"
          >
            <InputNumber
              placeholder="Enter branch id"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label="Name (UZ)"
            name="name_uz"
            rules={[
              { required: true, message: 'Please enter the name in Uzbek!' },
            ]}
            className="mb-4"
          >
            <Input placeholder="Enter name in Uzbek" />
          </Form.Item>
          <Form.Item
            label="Name (RU)"
            name="name_ru"
            rules={[
              { required: true, message: 'Please enter the name in Russian!' },
            ]}
            className="mb-4"
          >
            <Input placeholder="Enter name in Russian" />
          </Form.Item>
          <Form.Item
            label="Schedule"
            name="schedule"
            rules={[{ required: true, message: 'Please enter the schedule!' }]}
            className="mb-4"
          >
            <Input placeholder="Enter schedule (e.g., Mon-Sat, 9:00-18:00)" />
          </Form.Item>
          <Form.Item
            label="Address (UZ)"
            name="address_uz"
            rules={[
              { required: true, message: 'Please enter the address in Uzbek!' },
            ]}
            className="mb-4"
          >
            <Input placeholder="Enter address in Uzbek" />
          </Form.Item>
          <Form.Item
            label="Address (RU)"
            name="address_ru"
            rules={[
              {
                required: true,
                message: 'Please enter the address in Russian!',
              },
            ]}
            className="mb-4"
          >
            <Input placeholder="Enter address in Russian" />
          </Form.Item>
          <Form.Item label="Landmark (UZ)" name="landmark_uz" className="mb-4">
            <Input placeholder="Enter landmark in Uzbek" />
          </Form.Item>
          <Form.Item label="Landmark (RU)" name="landmark_ru" className="mb-4">
            <Input placeholder="Enter landmark in Russian" />
          </Form.Item>

          <Form.Item label="Address Link" name="address_link" className="mb-4">
            <Input placeholder="Enter map link (e.g., https://maps.google.com)" />
          </Form.Item>

          <Form.Item
            label="Latitude"
            name="latitude"
            rules={[{ required: true, message: 'Please enter the latitude!' }]}
            className="mb-4"
          >
            <InputNumber
              // step={0.0001}
              className="w-full"
              style={{ width: '100%' }}
              placeholder="Enter latitude (e.g., 41.2995)"
            />
          </Form.Item>

          <Form.Item
            label="Longitude"
            name="longitude"
            rules={[{ required: true, message: 'Please enter the longitude!' }]}
            className="mb-4"
          >
            <InputNumber
              // step={0.0001}
              className="w-full"
              style={{ width: '100%' }}
              placeholder="Enter longitude (e.g., 69.2401)"
            />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={
              !selectedBranch?.image_url
                ? [{ required: true, message: 'Please upload an image!' }]
                : undefined
            }
            className="mb-4 "
            style={{ width: '100%' }}
          >
            <Upload
              accept="image/png,image/jpeg, image/jpg, image/webp, image/gif"
              beforeUpload={() => false}
              maxCount={1}
              listType="picture"
              className="w-full"
              style={{ width: '100%' }}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Phone Number"
            className="col-span-2 mb-4"
            rules={[
              {
                required: true,
                message: 'Please add at least one phone number!',
              },
            ]}
          >
            <Form.List name="phone_number">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      align="start"
                      className="flex justify-between mb-2 mr-2"
                    >
                      <Form.Item
                        {...restField}
                        name={[name]}
                        rules={[
                          {
                            required: true,
                            message: 'Please enter a phone number!',
                          },
                          {
                            pattern: /^\+998\d{9}$/,
                            message:
                              'Please enter a valid phone number (+998...)',
                          },
                        ]}
                        style={{ width: '100%' }}
                      >
                        <Input placeholder="Enter phone number (+998...)" />
                      </Form.Item>
                      <Button
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusCircleOutlined />}
                      block
                    >
                      Add Phone Number
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
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

export default BranchModal;
