import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  ArrowLeftRight, 
  Gift, 
  ShoppingBag, 
  ShieldCheck, 
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CampusItem, CurrentUser, ItemStatus } from '../types.ts';

interface ItemCardProps {
  item: CampusItem;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (item: CampusItem) => void;
  currentUser: CurrentUser;
  onDeleteItem?: (id: string) => void;
  onUpdateStatus?: (id: string, status: ItemStatus) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isFavorited,
  onToggleFavorite,
  onClick,
  currentUser,
  onDeleteItem,
  onUpdateStatus,
}) => {
  const [imageError, setImageError] = useState(false);

  const isOwner = currentUser.id === item.seller.id;
  const isAdmin = currentUser.role === 'admin';
  const isSold = item.status === 'sold';
  const isReserved = item.status === 'reserved';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(item.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`確定要下架刪除「${item.title}」嗎？此操作無法復原。`)) {
      onDeleteItem?.(item.id);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    onUpdateStatus?.(item.id, e.target.value as ItemStatus);
  };

  return (
    <div
      onClick={() => onClick(item)}
      className={`group relative bg-white border border-stone-200/90 rounded-2xl overflow-hidden hover:shadow-lg hover:border-amber-400/60 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isSold ? 'grayscale-[60%] opacity-85 bg-stone-100/80' : ''
      }`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {!imageError && item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 text-center">
            <ShoppingBag className="w-10 h-10 mb-1 text-stone-300" />
            <span className="text-xs font-medium">{item.category}</span>
          </div>
        )}

        {/* SOLD Watermark Stamp Overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] flex items-center justify-center z-20">
            <div className="px-4 py-1.5 border-2 border-white text-white font-black text-sm uppercase tracking-widest rounded-lg transform -rotate-12 shadow-xl bg-rose-700/85">
              已售出 / 結緣完成
            </div>
          </div>
        )}

        {/* RESERVED Badge */}
        {!isSold && isReserved && (
          <div className="absolute top-10 left-2.5 z-20">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-stone-900 shadow-md flex items-center gap-1">
              <Clock className="w-3 h-3" />
              預約洽談中
            </span>
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-xs hover:bg-white hover:scale-110 active:scale-95 transition-all text-stone-600 hover:text-rose-600 z-10"
          title={isFavorited ? '取消收藏' : '加入收藏'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'text-rose-600 fill-rose-600' : 'text-stone-600'
            }`}
          />
        </button>

        {/* Deal Type Badge Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 z-10">
          {item.dealType === 'buy_sell' && (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-800/90 backdrop-blur-xs text-white shadow-xs flex items-center gap-1">
              <ShoppingBag className="w-3 h-3" />
              買賣
            </span>
          )}
          {item.dealType === 'exchange' && (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-700/90 backdrop-blur-xs text-white shadow-xs flex items-center gap-1">
              <ArrowLeftRight className="w-3 h-3" />
              以物易物
            </span>
          )}
          {item.dealType === 'free' && (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-700/90 backdrop-blur-xs text-white shadow-xs flex items-center gap-1">
              <Gift className="w-3 h-3" />
              免費贈送
            </span>
          )}

          {/* Condition Tag */}
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-900/70 backdrop-blur-xs text-white">
            {item.condition}
          </span>
        </div>

        {/* School Tag Pill */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] font-medium bg-white/90 backdrop-blur-xs text-stone-800 px-2 py-0.5 rounded-md shadow-xs">
          <MapPin className="w-3 h-3 text-amber-700 shrink-0" />
          <span className="truncate max-w-[120px]">{item.school}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        
        {/* Title and Category */}
        <div>
          <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1">
            <span>{item.category}</span>
            <span aria-hidden="true">·</span>
            <span>{item.createdAt}</span>
            {isOwner && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded">
                  我的刊登
                </span>
              </>
            )}
          </div>

          <h3 className={`font-bold text-stone-900 text-sm line-clamp-2 leading-snug ${isSold ? 'line-through text-stone-500' : 'group-hover:text-amber-800'} transition-colors`}>
            {item.title}
          </h3>

          {item.dealType === 'exchange' && item.exchangeWish && (
            <div className="mt-1.5 text-xs text-teal-800 bg-teal-50/80 border border-teal-100 rounded-lg p-1.5 line-clamp-1">
              <span className="font-semibold">想換：</span>{item.exchangeWish}
            </div>
          )}
        </div>

        {/* Price & Meta Footer */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            {item.dealType === 'free' ? (
              <span className="text-base font-extrabold text-emerald-700">
                免費贈送 $0
              </span>
            ) : item.dealType === 'exchange' ? (
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-teal-800">
                  純交換
                </span>
                {item.allowDifferencePay && (
                  <span className="text-[10px] text-stone-500 font-medium">(可補差價)</span>
                )}
              </div>
            ) : (
              <div className="flex items-baseline gap-0.5 text-amber-800">
                <span className="text-xs font-semibold">$</span>
                <span className="text-lg font-extrabold tabular-nums tracking-tight">
                  {item.price.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
            <span className="truncate max-w-[75px]">{item.seller.name}</span>
            {item.seller.isEduVerified && (
              <span title="已通過.edu信箱驗證">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              </span>
            )}
          </div>
        </div>

        {/* Seller/Admin Status Tracker & Moderation Row */}
        {(isOwner || isAdmin) && (
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1 text-[11px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1">
              <span className="text-stone-400 font-medium">狀態：</span>
              <select
                value={item.status}
                onChange={handleStatusChange}
                className={`font-bold px-1.5 py-0.5 rounded-lg border text-[11px] cursor-pointer focus:outline-none ${
                  item.status === 'available'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : item.status === 'reserved'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-stone-200 text-stone-700 border-stone-300'
                }`}
              >
                <option value="available">🟢 上架中</option>
                <option value="reserved">🟡 預約中 (洽談中)</option>
                <option value="sold">⚪ 已售出 / 已完成</option>
              </select>
            </div>

            <button
              onClick={handleDeleteClick}
              className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors"
              title="下架刪除此商品"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
