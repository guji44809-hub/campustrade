import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Send,
  AlertTriangle
} from 'lucide-react';
import { CampusItem, CurrentUser } from '../types.ts';

interface MeetupModalProps {
  item: CampusItem | null;
  currentUser: CurrentUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const MeetupModal: React.FC<MeetupModalProps> = ({
  item,
  currentUser,
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  if (!isOpen || !item) return null;

  const [location, setLocation] = useState(item.seller.meetupSpot);
  const [preferredSlot, setPreferredSlot] = useState('週三 中午 12:10 ~ 13:00');
  const [note, setNote] = useState('您好！我是同校同學，對這件物品很有興趣，想預約這個時段在校內面交檢查實體，謝謝！');
  const [checkedSafety, setCheckedSafety] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkedSafety) return;

    setIsSubmitted(true);
    setTimeout(() => {
      onSuccessToast(`已成功向賣家「${item.seller.name}」發送校園面交邀請！`);
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white border border-stone-200 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">預約校園安全面交</h3>
              <p className="text-[11px] text-stone-500">直接與本校同學約定時間地點，現場驗收</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-stone-700">
          
          {/* Item Brief */}
          <div className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-2xl">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-semibold text-amber-800">{item.school}</span>
              <h4 className="text-xs font-bold text-stone-900 truncate">{item.title}</h4>
              <p className="text-xs font-black text-amber-800 mt-0.5">
                {item.dealType === 'free' ? '免費贈送 $0' : item.dealType === 'exchange' ? '以物易物' : `$${item.price.toLocaleString()}`}
              </p>
            </div>
          </div>

          {/* Location Choice */}
          <div className="space-y-1">
            <label className="font-bold text-stone-800 block flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <span>建議面交地點</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none text-xs"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['校內圖書館大廳', '學餐全家便利商店前', '大樓中庭川堂', '行政大樓郵局前'].map((spot) => (
                <button
                  key={spot}
                  type="button"
                  onClick={() => setLocation(`${item.school} ${spot}`)}
                  className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-[10px] text-stone-600 transition-colors"
                >
                  {spot}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Choice */}
          <div className="space-y-1">
            <label className="font-bold text-stone-800 block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>希望面交時間區間</span>
            </label>
            <select
              value={preferredSlot}
              onChange={(e) => setPreferredSlot(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none text-xs"
            >
              <option value="週一 中午 12:10 ~ 13:00">週一 中午 12:10 ~ 13:00</option>
              <option value="週二 放學 17:30 ~ 18:30">週二 放學 17:30 ~ 18:30</option>
              <option value="週三 中午 12:10 ~ 13:00">週三 中午 12:10 ~ 13:00</option>
              <option value="週四 放學 17:30 ~ 18:30">週四 放學 17:30 ~ 18:30</option>
              <option value="週五 中午 12:10 ~ 13:00">週五 中午 12:10 ~ 13:00</option>
              <option value="週末或假日彈性協調">週末或假日彈性協調</option>
            </select>
          </div>

          {/* Private Message Note */}
          <div className="space-y-1">
            <label className="font-bold text-stone-800 block">給賣家同學的留言備註</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none text-xs"
            />
          </div>

          {/* Safety Checkbox */}
          <label className="flex items-start gap-2 p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={checkedSafety}
              onChange={(e) => setCheckedSafety(e.target.checked)}
              className="mt-0.5 rounded text-amber-700 focus:ring-amber-500"
            />
            <span className="text-[11px] text-amber-900 leading-snug">
              我承諾面交於白天校內公開場所進行，並當面檢驗物品無誤後再付款，絕不點擊任何非官方之不明付款協議連結。
            </span>
          </label>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 font-semibold text-xs"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!checkedSafety || isSubmitted}
              className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 animate-spin" />
                  <span>送出中...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>確認送出預約邀請</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
