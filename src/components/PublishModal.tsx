import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  AlertCircle,
  Sparkles,
  ShoppingBag,
  ArrowLeftRight,
  Gift
} from 'lucide-react';
import { CampusItem, Category, CurrentUser, DealType, ItemCondition } from '../types.ts';
import { CATEGORY_LIST, SCHOOL_LIST, PRESET_IMAGES } from '../mockData.ts';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onSubmit: (item: CampusItem) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Exclude<Category, '全部'>>('課本教材');
  const [school, setSchool] = useState(currentUser.school !== '未設定學校' ? currentUser.school : '佛光大學');
  const [dealType, setDealType] = useState<DealType>('buy_sell');
  const [condition, setCondition] = useState<ItemCondition>('9成新');
  const [price, setPrice] = useState('300');
  const [exchangeWish, setExchangeWish] = useState('');
  const [allowDifferencePay, setAllowDifferencePay] = useState(true);
  const [meetupSpot, setMeetupSpot] = useState(
    currentUser.school === '佛光大學' ? '佛光大學 雲起樓1F大廳 / 懷恩館前' : '學校總圖書館大門口'
  );
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([PRESET_IMAGES[0].url]);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Handle local file selection with URL.createObjectURL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newUrls: string[] = [];
      Array.from(e.target.files).forEach((file) => {
        const objectUrl = URL.createObjectURL(file);
        newUrls.push(objectUrl);
      });
      setImages((prev) => [...prev, ...newUrls]);
    }
  };

  const handleSelectPreset = (url: string) => {
    setImages((prev) => (prev.includes(url) ? prev : [url, ...prev]));
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('請輸入商品名稱');
      return;
    }
    if (dealType === 'buy_sell' && (!price || Number(price) < 0)) {
      setErrorMessage('請填寫正確的出清售價');
      return;
    }
    if (dealType === 'exchange' && !exchangeWish.trim()) {
      setErrorMessage('以物交換形式請註明「期望交換物品」');
      return;
    }
    if (images.length === 0) {
      setErrorMessage('請至少上傳一張照片或選取預設圖庫');
      return;
    }

    const newItem: CampusItem = {
      id: `item-${Date.now()}`,
      title: title.trim(),
      category,
      school,
      price: dealType === 'free' ? 0 : Number(price) || 0,
      dealType,
      status: 'available',
      condition,
      images,
      description: description.trim() || '賣家未填寫詳細說明，歡迎透過問答進一步詢問。',
      seller: {
        id: currentUser.id,
        name: currentUser.name,
        school: currentUser.school !== '未設定學校' ? currentUser.school : school,
        department: currentUser.department,
        isEduVerified: currentUser.isEduVerified,
        rating: 5.0,
        dealCount: 1,
        meetupSpot: meetupSpot.trim() || `${school} 校園正門口`,
      },
      exchangeWish: dealType === 'exchange' ? exchangeWish.trim() : undefined,
      allowDifferencePay: dealType === 'exchange' ? allowDifferencePay : undefined,
      createdAt: '剛剛',
      views: 1,
      likes: 0,
      qna: [],
    };

    onSubmit(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white border border-stone-200 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden z-10 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
              <span>刊登校園二手物品</span>
            </h2>
            <p className="text-xs text-stone-500">免任何刊登費與抽成，100% 同學直接面交</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 text-xs text-stone-700">
          
          {/* Transaction Type Choice */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-800 block text-xs">
              交易模式 <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setDealType('buy_sell');
                  if (price === '0') setPrice('300');
                }}
                className={`py-2.5 px-3 rounded-xl border flex flex-col items-center gap-1 font-semibold transition-all ${
                  dealType === 'buy_sell'
                    ? 'bg-amber-50 border-amber-600 text-amber-900 shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-amber-700" />
                <span>二手買賣</span>
              </button>

              <button
                type="button"
                onClick={() => setDealType('exchange')}
                className={`py-2.5 px-3 rounded-xl border flex flex-col items-center gap-1 font-semibold transition-all ${
                  dealType === 'exchange'
                    ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4 text-teal-700" />
                <span>以物交換</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDealType('free');
                  setPrice('0');
                }}
                className={`py-2.5 px-3 rounded-xl border flex flex-col items-center gap-1 font-semibold transition-all ${
                  dealType === 'free'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Gift className="w-4 h-4 text-emerald-700" />
                <span>免費贈送 ($0)</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="font-bold text-stone-800 block">
              商品名稱 / 書名 / 型號 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：Stewart Calculus 第九版中譯本、IKEA 扶手椅、GIANT 腳踏車..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs"
            />
          </div>

          {/* Category & School & Condition (3 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div className="space-y-1">
              <label className="font-bold text-stone-800 block">所屬分類</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
              >
                {CATEGORY_LIST.filter((c) => c !== '全部').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-800 block">所在學校</label>
              <select
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
              >
                {SCHOOL_LIST.filter((s) => s !== '全部學校').map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-800 block">新舊成色</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
              >
                <option value="全新未拆">全新未拆</option>
                <option value="95成新">95成新 (極少使用)</option>
                <option value="9成新">9成新 (良好完整)</option>
                <option value="85成新">85成新 (輕微劃記/痕跡)</option>
                <option value="8成新">8成新 (正常使用痕跡)</option>
                <option value="7成新">7成新 (外觀明顯痕跡)</option>
                <option value="功能正常痕跡多">功能正常痕跡多</option>
              </select>
            </div>

          </div>

          {/* Price or Exchange specifics */}
          {dealType === 'buy_sell' ? (
            <div className="space-y-1">
              <label className="font-bold text-stone-800 block">
                出清價格 (新台幣 TWD) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">$</span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="300"
                  className="w-full pl-8 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-600 focus:outline-none text-xs tabular-nums font-semibold"
                />
              </div>
            </div>
          ) : dealType === 'exchange' ? (
            <div className="space-y-2 p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl">
              <div className="space-y-1">
                <label className="font-bold text-teal-900 block">
                  期望交換之物品 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={exchangeWish}
                  onChange={(e) => setExchangeWish(e.target.value)}
                  placeholder="例如：想換微積分課本、電磁爐、或等值3C周邊..."
                  className="w-full px-3 py-2 bg-white border border-teal-300 rounded-xl focus:outline-none text-xs"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={allowDifferencePay}
                  onChange={(e) => setAllowDifferencePay(e.target.checked)}
                  className="rounded text-teal-700 focus:ring-teal-500"
                />
                <span className="text-teal-900 font-medium">若價值有落差，願意雙方協商以現金補貼差價</span>
              </label>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
              🎁 <strong>善心結緣：</strong>此物品標示為免費贈送，價格自動設為 $0。
            </div>
          )}

          {/* Campus Meetup Spot */}
          <div className="space-y-1">
            <label className="font-bold text-stone-800 block">
              建議校內面交地點
            </label>
            <input
              type="text"
              value={meetupSpot}
              onChange={(e) => setMeetupSpot(e.target.value)}
              placeholder="例如：雲起樓一樓大廳、總圖書館前、學餐旁..."
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none text-xs"
            />
          </div>

          {/* Native Image Upload with URL.createObjectURL */}
          <div className="space-y-2">
            <label className="font-bold text-stone-800 block">
              物品照片 (支援本地免上傳預覽) <span className="text-rose-500">*</span>
            </label>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* Upload Button & Preview Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-stone-300 hover:border-amber-600 bg-stone-50 hover:bg-amber-50/50 flex flex-col items-center justify-center gap-1 text-stone-500 hover:text-amber-800 transition-colors p-2 text-center"
              >
                <Upload className="w-5 h-5 text-stone-400" />
                <span className="text-[11px] font-semibold">選擇本地圖片</span>
                <span className="text-[9px] text-stone-400">免伺服器即時預覽</span>
              </button>

              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-stone-200 group">
                  <img src={img} alt="預覽" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-stone-900/70 text-white hover:bg-rose-600 transition-colors"
                    title="移除此圖片"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-amber-700 text-white text-[9px] font-semibold">
                      主圖
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Preset Library */}
            <div className="pt-2">
              <span className="text-[11px] text-stone-500 font-medium block mb-1">
                手邊沒照片？點擊快速選用校園情境預設圖：
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {PRESET_IMAGES.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(p.url)}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-[10px] text-stone-700 whitespace-nowrap shrink-0 transition-colors"
                  >
                    + {p.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-stone-800 block">
              詳細描述 (使用頻率、有無劃記、附贈配件等)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="說明物品的實際使用狀況、買入時間、配件是否齊全，或特別的面交時段要求..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none text-xs leading-relaxed"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 font-semibold"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 active:scale-98 text-white font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>確認免費刊登</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
