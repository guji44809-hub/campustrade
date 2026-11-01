import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Minus, 
  Maximize2, 
  Send, 
  ShieldAlert, 
  MessageSquare, 
  ShoppingBag, 
  ArrowLeftRight, 
  Gift, 
  ShieldCheck,
  User
} from 'lucide-react';
import { ChatSession, CurrentUser } from '../types.ts';

interface ChatBoxProps {
  session: ChatSession | null;
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onToggleMinimize: () => void;
  onSendMessage: (text: string) => void;
  currentUser: CurrentUser;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  session,
  isOpen,
  isMinimized,
  onClose,
  onToggleMinimize,
  onSendMessage,
  currentUser,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.messages, isOpen, isMinimized]);

  if (!isOpen || !session) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;
    onSendMessage(text);
    setInputText('');
  };

  // Minimized Floating Pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onToggleMinimize}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-2xl shadow-2xl border border-amber-600/40 text-xs font-bold transition-all hover:scale-105 active:scale-95 animate-in slide-in-from-bottom-2"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse" />
          </div>
          <span>與 {session.sellerName} 的對話</span>
          <span className="text-[10px] bg-amber-950/60 px-1.5 py-0.5 rounded font-normal text-amber-200">
            {session.messages.length} 則訊息
          </span>
          <Maximize2 className="w-3.5 h-3.5 text-amber-300 ml-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-88 sm:w-96 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[580px] h-[520px] animate-in slide-in-from-bottom-3 duration-200">
      
      {/* Header */}
      <div className="bg-stone-900 text-white p-3.5 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs truncate">{session.sellerName}</span>
              <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-1 py-0.2 rounded font-medium flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" />
                .edu認證
              </span>
            </div>
            <p className="text-[10px] text-stone-400 truncate">{session.sellerSchool}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-stone-400 shrink-0">
          <button
            onClick={onToggleMinimize}
            className="p-1.5 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            title="最小化"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            title="關閉聊天室"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pinned Target Item Mini Card */}
      <div className="p-2.5 bg-stone-50 border-b border-stone-200 flex items-center gap-2.5 shrink-0">
        <img
          src={session.itemImage}
          alt={session.itemTitle}
          className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h5 className="font-bold text-stone-900 text-[11px] truncate">{session.itemTitle}</h5>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-amber-800 font-extrabold text-xs">
              {session.dealType === 'free' ? '免費贈送 $0' : session.dealType === 'exchange' ? '以物易物' : `$${session.itemPrice.toLocaleString()}`}
            </span>
            <span className="text-[10px] text-stone-400">
              {session.dealType === 'buy_sell' ? '買賣' : session.dealType === 'exchange' ? '交換' : '贈送'}
            </span>
          </div>
        </div>
      </div>

      {/* Safety Micro Banner */}
      <div className="bg-amber-50 px-3 py-1.5 border-b border-amber-200/60 text-[10px] text-amber-900 flex items-center gap-1.5 shrink-0">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        <span className="leading-tight truncate">
          交易提醒：面交建議約在校內白天公共場所，切勿預先匯款。
        </span>
      </div>

      {/* Message List Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-stone-100/50">
        {session.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-end gap-1.5 max-w-[82%]">
              {!msg.isMe && (
                <span className="text-[9px] text-stone-400 mb-0.5 font-medium">{session.sellerName}</span>
              )}

              <div
                className={`p-2.5 text-xs rounded-2xl leading-relaxed shadow-2xs ${
                  msg.isMe
                    ? 'bg-amber-700 text-white rounded-tr-xs'
                    : 'bg-white border border-stone-200 text-stone-800 rounded-tl-xs'
                }`}
              >
                {msg.text}
              </div>

              <span className="text-[9px] text-stone-400 mb-0.5 shrink-0 tabular-nums">
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <form onSubmit={handleSubmit} className="p-2.5 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="輸入訊息 (例如：這週二下午方便在圖書館前驗貨嗎？)..."
          className="flex-1 px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-600 text-xs"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors shrink-0"
          title="發送訊息"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
