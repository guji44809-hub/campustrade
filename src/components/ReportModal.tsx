import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, Check } from 'lucide-react';
import { CampusItem, CurrentUser, ReportItem } from '../types.ts';

interface ReportModalProps {
  item: CampusItem | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onSubmitReport: (report: ReportItem) => void;
}

const REPORT_REASONS = [
  '疑似詐騙行為或要求私下加 LINE / 網銀轉帳',
  '違禁品、盜版教材或違反校規之物品',
  '刊登資訊不實或已售出卻未更新下架',
  '惡意重複洗版、騷擾或言語不當',
  '其他違反校園二手守則之情事',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  item,
  isOpen,
  onClose,
  currentUser,
  onSubmitReport,
}) => {
  if (!isOpen || !item) return null;

  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [detail, setDetail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemImage: item.images[0] || '',
      sellerName: item.seller.name,
      reporterName: currentUser.name,
      reason: selectedReason,
      detail: detail.trim() || '檢舉人未填寫補充說明。',
      time: new Date().toLocaleString('zh-TW', { hour12: false }),
      status: 'pending',
    };
    onSubmitReport(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative bg-white border border-stone-200 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-rose-50/50">
          <div className="flex items-center gap-2 text-rose-800">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-sm">檢舉此商品</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-stone-700">
          
          {/* Target Item summary */}
          <div className="flex items-center gap-3 p-2.5 bg-stone-50 border border-stone-200 rounded-xl">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-amber-800 font-semibold">{item.school}</span>
              <h4 className="font-bold text-stone-900 truncate">{item.title}</h4>
              <p className="text-[11px] text-stone-500">賣家：{item.seller.name}</p>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-800 block">請選擇檢舉原因：</label>
            <div className="space-y-1.5">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedReason === reason
                      ? 'bg-rose-50/70 border-rose-300 text-rose-950 font-semibold'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="leading-tight">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-1">
            <label className="font-bold text-stone-800 block">補充說明（選填）：</label>
            <textarea
              rows={2}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="請簡述發現的問題，例如對話截圖線索或違規情事..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none text-xs"
            />
          </div>

          {/* Caution text */}
          <p className="text-[11px] text-stone-400">
            平台管理員將會仔細審核您的檢舉。若查證屬實將予以強制下架並限制該帳號權限。
          </p>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>確認送出檢舉</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
