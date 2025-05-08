export interface IPayment {
  name: string;
  value: number;
}

export interface IItem {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface IReceipt {
  id: string;
  receipt_no: number;
  type: string;
  user_id: number;
  branch: number;
  date: string;
  payments: IPayment[];
  amount: string;
  items: IItem[];
  created_at: string;
}

export interface IUser {
  id: number;
  name: string;
  phone_number: string;
  code: string;
  balance: number;
  qrcode_image: string;
  qrcode_image_url: string;
  chat_id: number;
  bot_lang: string;
  bot_step: string;
  created_at: string;
}

export interface IBonunes {
  id: number;
  receipt_no: number;
  user_id: number;
  amount: number;
  income: boolean;
  created_at: string;
}

export interface IBranch {
  id: number;
  branch_id: number;
  name_uz: string;
  name_ru: string;
  phone_number: string[];
  schedule: string;
  address_uz: string;
  address_ru: string;
  landmark_uz: string;
  landmark_ru: string;
  address_link: string;
  image_url: string;
  image_name: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface IMessage {
  id: string;
  text: string;
  balance_from: string;
  balance_to: string;
  bot_lang: string;
  file_url: string;
  file_name: string;
  file_type: string;
  created_at: string;
}
