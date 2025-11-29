import {
  Modal,
  Form,
  InputNumber,
  Button,
  Upload,
  message,
  Select,
} from 'antd';
import { PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import api from '../../../api';
import { useQueryClient } from '@tanstack/react-query';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useState } from 'react';

interface MessageFormValues {
  text: string;
  balance_from: number;
  balance_to: number;
  bot_lang: string;
  file: { originFileObj: File }[] | null;
}

interface MessageModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  
}

const MessageModal: React.FC<MessageModalProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const [form] = Form.useForm();
  const [textValue, setTextValue] = useState('<p></p>');
  const queryClient = useQueryClient();

  const handleFinish = async (values: MessageFormValues) => {
    try {
      const formData = new FormData();
      formData.append('text', values.text.trim());
      if (values.balance_from) {
        formData.append('balance_from', String(values.balance_from));
      }
      if (values.balance_to) {
        formData.append('balance_to', String(values.balance_to));
      }
      formData.append('bot_lang', values.bot_lang.trim());
      if (values.file && values.file[0]?.originFileObj) {
        formData.append('file', values.file[0].originFileObj); 
      }

      const res = await api.post('/message/send', formData);

      if (res.data.status === 200) {
        message.success('Xabar muvaffaqiyatli yuborildi!');
      } else if (res.data.status === 400) {
        message.error('Xabarni yuborishda xato!');
      } else if (res.data.status === 500) {
        message.error('Server xatosi!');
      }

      queryClient.invalidateQueries({ queryKey: ['messageData'] });
      setIsModalOpen(false);
      form.resetFields();
      setTextValue('<p></p>'); 
    } catch (error) {
      console.error('Xabarini yuborishda xato:', error);
      message.error('Xabarni yuborishda xato!');
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList.slice(-1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Xabarlar</h1>
      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={() => setIsModalOpen(true)}
        className="mb-4"
      >
        Xabar yuborish
      </Button>
      <Modal
        title={
          <div className="flex items-center">
            <PlusCircleOutlined className="text-blue-500 mr-2" />
            Xabar yuborish
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={700}
        className="rounded-lg"
      >
        <Form
          form={form}
          onFinish={handleFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Matn"
            name="text"
            className="mb-4"
            style={{ width: '100%' }}
            rules={[
              {
                required: true,
                message: "Iltimos, matnni kiriting",
              },
            ]}
          >
            <CKEditor
              editor={
                ClassicEditor as unknown as {
                  create(...args: any): Promise<any>;
                  EditorWatchdog: any;
                  ContextWatchdog: any;
                }
              }
              config={{
                toolbar: [
                  'heading',
                  '|',
                  'bold',
                  'italic',
                  'underline',
                  'strikethrough',
                  'code',
                  'subscript',
                  'superscript',
                  '|',
                  'link',
                  'bulletedList',
                  'numberedList',
                  'blockQuote',
                  'codeBlock',
                  '|',
                  'outdent',
                  'indent',
                  'alignment',
                  '|',
                  'undo',
                  'redo',
                  'removeFormat',
                  '|',
                  'fontSize',
                  'fontColor',
                  'fontBackgroundColor',
                ],
              }}
              data={textValue}
              onReady={(editor) => {
                console.log('Editor is ready to use!', editor);
              }}
              onChange={(_, editor) => {
                const data = editor.getData();
                setTextValue(data);
                form.setFieldsValue({ text: data });
              }}
            />
          </Form.Item>

          <Form.Item
            label="Balansdan"
            name="balance_from"
            className="mb-4"
            style={{ width: '100%' }}
          >
            <InputNumber
              placeholder="Balansdan"
              className="w-full"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>

          <Form.Item
            label="Balansgacha"
            name="balance_to"
            className="mb-4"
            style={{ width: '100%' }}
          >
            <InputNumber
              placeholder="Balansgacha"
              className="w-full"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>

          <Form.Item
            label="Bot tili"
            name="bot_lang"
            className="mb-4"
            style={{ width: '100%' }}
            rules={[
              {
                required: true,
                message: "Iltimos, bot tilini tanlang",
              },
            ]}
          >
            <Select placeholder="Bot tilini tanlang" className="w-full">
              <Select.Option value="uz">O'zbekcha</Select.Option>
              <Select.Option value="ru">Ruscha</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Rasm"
            name="file"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            className="mb-4"
            style={{ width: '100%' }}
          >
            <Upload
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
              beforeUpload={() => false}
              maxCount={1}
              listType="picture"
              className="w-full"
              style={{ width: '100%' }}
            >
              <Button icon={<UploadOutlined />} block>
                Rasmni yuklash
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item className="col-span-2">
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setIsModalOpen(false)}>Bekor qilish</Button>
              <Button type="primary" htmlType="submit">
                Saqlash
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MessageModal;
