import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  ArrowLeftRight, 
  Gift, 
  ShoppingBag, 
  Calendar, 
  Send, 
  AlertTriangle,
  User,
  Star,
  ShieldAlert,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { CampusItem, CurrentUser, ItemStatus } from '../types.ts';

interface ItemDetailModalProps {
  item: CampusItem | null;
  onClose: () => void;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  currentUser: CurrentUser;
  onAddQnA: (itemId: string, content: string) => void;
  onOpenMeetup: (item: CampusItem) => void;
  onOpenReport: (item: CampusItem) => void;
  onUpdateStatus?: (id: string, status: ItemStatus) => void;
  onOpenChat: (item: CampusItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  isFavorited,
  onToggleFavorite,
  currentUser,
  onAddQnA,
  onOpenMeetup,
  onOpenReport,
  onUpdateStatus,
  onOpenChat,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [newQuestion, setNewQuestion] = useState('');
  const [qnaError, setQnaError] = useState('');

  if (!item) return null;

  const isOwner = currentUser.id === item.seller.id;
  const isAdmin = currentUser.role === 'admin';
  const isSold = item.status === 'sold';

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newQuestion.trim();
    if (!trimmed) return;

    const phonePattern = /(09\d{8}|09\d{2}-\d{3}-\d{3})/;
    if (phonePattern.test(trimmed)) {
      setQnaError('為保護個人隱私與防範詐騙，公開問答請勿直接留手機電話號碼！');
      return;
    }

    onAddQnA(item.id, trimmed);
    setNewQuestion('');
    setQnaError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white border border-stone-200 rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden z-10 max-h-[92vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-200 bg-stone-50/70">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
            <span className="text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
              {item.school}
            </span>
            <span>·</span>
            <span>{item.category}</span>
            <span>·</span>
            <span className="text-stone-400">刊登於 {item.createdAt}</span>

            {/* Status Badge in Header */}
            <span className={`ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${
              item.status === 'available'
                ? 'bg-emerald-100 text-emerald-800'
                : item.status === 'reserved'
                ? 'bg-amber-100 text-amber-900'
                : 'bg-stone-200 text-stone-700'
            }`}>
              {item.status === 'available' ? '🟢 上架中' : item.status === 'reserved' ? '🟡 預約中' : '⚪ 已售出'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Report Button */}
            <button
              onClick={() => onOpenReport(item)}
              className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 text-xs font-medium flex items-center gap-1 transition-colors"
              title="檢舉此商品"
            >
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline">檢舉</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 space-y-5">
          
          {/* Sold Alert Banner */}
          {isSold && (
            <div className="p-3 bg-stone-100 border border-stone-300 rounded-2xl flex items-center gap-2.5 text-stone-700 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 text-stone-500 shrink-0" />
              <span>此商品已完成面交或已售出，目前暫停預約。</span>
            </div>
          )}

          {/* Top Section: Gallery & Purchase Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Gallery Column */}
            <div className="space-y-3">
              <div className="aspect-4/3 w-full bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 relative">
                <img
                  src={item.images[selectedImageIndex] || item.images[0]}
                  alt={item.title}
                  className={`w-full h-full object-cover ${isSold ? 'grayscale-[50%]' : ''}`}
                />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {item.dealType === 'buy_sell' && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-800 text-white shadow-xs">
                      買賣
                    </span>
                  )}
                  {item.dealType === 'exchange' && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-700 text-white shadow-xs">
                      以物易物
                    </span>
                  )}
                  {item.dealType === 'free' && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-700 text-white shadow-xs">
                      免費贈送
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-stone-900/80 text-white">
                    {item.condition}
                  </span>
                </div>
              </div>

              {item.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {item.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-amber-600 scale-95 ring-2 ring-amber-500/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="縮圖" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Title, Price, Exchange details, Quick Action */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <h1 className={`text-xl font-bold text-stone-900 leading-snug ${isSold ? 'line-through text-stone-500' : ''}`}>
                  {item.title}
                </h1>

                {/* Price Display */}
                <div className="mt-3 p-3.5 bg-amber-50/60 border border-amber-200/60 rounded-2xl flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-amber-900/70 font-medium block">
                      {item.dealType === 'free' ? '贈送形式' : item.dealType === 'exchange' ? '交換方式' : '出清價格'}
                    </span>
                    <div className="mt-0.5">
                      {item.dealType === 'free' ? (
                        <span className="text-2xl font-black text-emerald-700">
                          免費贈送 $0
                        </span>
                      ) : item.dealType === 'exchange' ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-teal-800">
                            以物易物
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            item.allowDifferencePay ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {item.allowDifferencePay ? '✓ 可補差價' : '不補差價'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1 text-amber-800">
                          <span className="text-base font-bold">$</span>
                          <span className="text-3xl font-black tabular-nums">
                            {item.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-stone-500 ml-1">TWD</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                      isFavorited
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-rose-300 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
                    <span>{isFavorited ? '已收藏' : '收藏'}</span>
                  </button>
                </div>

                {/* Seller status switch box if owner or admin */}
                {(isOwner || isAdmin) && (
                  <div className="mt-3 p-3 bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-700">賣家管理此商品狀態：</span>
                    <select
                      value={item.status}
                      onChange={(e) => onUpdateStatus?.(item.id, e.target.value as ItemStatus)}
                      className="px-2.5 py-1 bg-white border border-stone-300 rounded-lg font-bold text-stone-800 cursor-pointer"
                    >
                      <option value="available">🟢 上架中</option>
                      <option value="reserved">🟡 預約中 (面交洽談中)</option>
                      <option value="sold">⚪ 已售出 / 已完成</option>
                    </select>
                  </div>
                )}

                {/* If Exchange: Detailed Exchange Requirement Box */}
                {item.dealType === 'exchange' && item.exchangeWish && (
                  <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-teal-900 flex items-center gap-1">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-teal-700" />
                      <span>賣家期望交換之物品：</span>
                    </div>
                    <p className="text-teal-800 font-medium pl-4">{item.exchangeWish}</p>
                    <p className="text-[11px] text-teal-600 pl-4">
                      {item.allowDifferencePay ? '💡 可接受雙方現金補貼差價' : '💡 以等值平換為主，不補差價'}
                    </p>
                  </div>
                )}

                {/* Seller Mini Card */}
                <div className="mt-4 p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-700/10 text-amber-800 flex items-center justify-center font-bold text-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-800 text-sm">{item.seller.name}</span>
                        {item.seller.isEduVerified && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" />
                            .edu已認證
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500">
                        {item.seller.school} · {item.seller.department}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="flex items-center gap-1 text-amber-700 font-bold justify-end">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{item.seller.rating}</span>
                    </div>
                    <span className="text-[11px] text-stone-400">
                      完成 {item.seller.dealCount} 筆交易
                    </span>
                  </div>
                </div>

                {/* Campus Meetup Spot */}
                <div className="mt-3 flex items-start gap-2 text-xs text-stone-600 px-1">
                  <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-800">面交建議地點：</span>
                    <span>{item.seller.meetupSpot}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Chat & Meetup */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => onOpenChat(item)}
                  disabled={isSold}
                  className={`w-full py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm font-bold ${
                    isSold
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-amber-700 hover:bg-amber-800 text-white hover:shadow-lg active:scale-99'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{isSold ? '此商品已售出或完成' : '聯絡賣家 / 提出私訊申請'}</span>
                </button>

                {!isSold && (
                  <button
                    onClick={() => onOpenMeetup(item)}
                    className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    <span>預約校園安全面交時間與地點</span>
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Description Section */}
          <div className="border-t border-stone-200 pt-5">
            <h3 className="font-bold text-stone-900 text-sm mb-2">商品詳情與使用現況說明</h3>
            <div className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80 text-stone-700 text-sm leading-relaxed whitespace-pre-line">
              {item.description}
            </div>
          </div>

          {/* Safety Notice Warning Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-amber-950">🛡️ 校園二手交易安全提醒：</p>
              <ul className="list-disc pl-4 space-y-0.5 text-stone-700 text-[11px]">
                <li>請盡量約在白天校內公開場所（如圖書館、大樓川堂、學餐門口）面交。</li>
                <li><strong>嚴防詐騙：</strong>切勿點擊賣家或買家私訊發送的不明超商貨到付款、簽署協議、或網銀第三方支付連結。</li>
                <li>當面檢驗物品無誤後，再交付款項或完成物品交換。</li>
              </ul>
            </div>
          </div>

          {/* Public Q&A Section */}
          <div className="border-t border-stone-200 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <span>公開問答留言板</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                    {item.qna.length} 則問答
                  </span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  所有提問對校內同學公開，協助大家快速了解物品細節
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {item.qna.length === 0 ? (
                <div className="bg-stone-50 border border-dashed border-stone-200 rounded-2xl p-6 text-center text-xs text-stone-500">
                  目前尚未有同學提問。對這項物品有任何疑問嗎？歡迎在下方發問！
                </div>
              ) : (
                item.qna.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                      msg.isSeller
                        ? 'bg-amber-50/70 border-amber-200 ml-4'
                        : 'bg-white border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <span className={msg.isSeller ? 'text-amber-900' : 'text-stone-800'}>
                          {msg.userName}
                        </span>
                        {msg.isSeller && (
                          <span className="text-[10px] bg-amber-800 text-white px-1.5 py-0.2 rounded font-bold">
                            賣家回覆
                          </span>
                        )}
                        <span className="text-[11px] text-stone-400 font-normal">
                          ({msg.userSchool})
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed">{msg.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendQuestion} className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => {
                    setNewQuestion(e.target.value);
                    if (qnaError) setQnaError('');
                  }}
                  placeholder={`以「${currentUser.name}」身分公開提問 (例如：書況、配件、面交時間)...`}
                  className="flex-1 px-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <button
                  type="submit"
                  disabled={!newQuestion.trim()}
                  className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs flex items-center gap-1.5 transition-all shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>送出提問</span>
                </button>
              </div>

              {qnaError && (
                <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{qnaError}</span>
                </p>
              )}

              <p className="text-[11px] text-stone-400">
                🔒 溫馨提醒：請勿在公開留言板留下手機電話、銀行帳戶或身分證號。
              </p>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
