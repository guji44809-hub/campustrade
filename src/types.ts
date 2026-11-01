export type DealType = 'buy_sell' | 'exchange' | 'free';

export type ItemStatus = 'available' | 'reserved' | 'sold';

export type ItemCondition = 
  | '全新未拆'
  | '95成新'
  | '9成新'
  | '85成新'
  | '8成新'
  | '7成新'
  | '功能正常痕跡多';

export type Category = 
  | '全部'
  | '課本教材'
  | '3C電子'
  | '服裝配件'
  | '家具生活'
  | '單車交通'
  | '運動休閒';

export interface QnAMessage {
  id: string;
  userId: string;
  userName: string;
  userSchool: string;
  isSeller: boolean;
  content: string;
  timestamp: string;
}

export interface SellerInfo {
  id: string;
  name: string;
  school: string;
  department: string;
  isEduVerified: boolean;
  rating: number; // e.g., 4.9
  dealCount: number; // e.g., 23
  meetupSpot: string; // e.g. "佛光大學 雲起樓1F中庭"
}

export interface CampusItem {
  id: string;
  title: string;
  category: Exclude<Category, '全部'>;
  school: string;
  price: number; // 0 for free
  dealType: DealType;
  status: ItemStatus; // 'available' | 'reserved' | 'sold'
  condition: ItemCondition;
  images: string[];
  description: string;
  seller: SellerInfo;
  exchangeWish?: string; // e.g. "想換微積分課本、電磁爐或等值3C"
  allowDifferencePay?: boolean; // 可否補差價
  createdAt: string;
  views: number;
  likes: number;
  qna: QnAMessage[];
}

export type UserRole = 'guest' | 'student' | 'admin';

export interface CurrentUser {
  id: string;
  name: string;
  school: string;
  department: string;
  role: UserRole;
  isEduVerified: boolean;
  avatar: string;
}

export interface FilterState {
  searchQuery: string;
  school: string;
  category: Category;
  dealType: '全部' | DealType;
  minPrice: string;
  maxPrice: string;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'popular';
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'qna' | 'exchange' | 'report' | 'system';
  itemId?: string;
}

export interface ReportItem {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  sellerName: string;
  reporterName: string;
  reason: string;
  detail: string;
  time: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface ChatMessage {
  id: string;
  senderName: string;
  isMe: boolean;
  text: string;
  time: string;
}

export interface ChatSession {
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemPrice: number;
  dealType: DealType;
  sellerName: string;
  sellerSchool: string;
  messages: ChatMessage[];
  lastUpdated: string;
}

