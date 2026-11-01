import React from 'react';
import { X, Heart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { CampusItem } from '../types.ts';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoritedItems: CampusItem[];
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
  onSelectItem: (item: CampusItem) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favoritedItems,
  onRemoveFavorite,
  onClearAll,
  onSelectItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-stone-200">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
              <Heart className="w-4 h-4 fill-rose-600" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-sm">我的收藏清單</h2>
              <p className="text-[11px] text-stone-500">
                已收藏 {favoritedItems.length} 件心儀物品
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {favoritedItems.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] text-stone-400 hover:text-rose-600 px-2 py-1 transition-colors"
                title="清空全部收藏"
              >
                清空
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favoritedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-300">
                <Heart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-stone-700">目前尚無收藏物品</p>
                <p className="text-xs text-stone-400">
                  逛逛大廳，點擊物品卡片上的愛心圖示即可快速暫存追蹤！
                </p>
              </div>
            </div>
          ) : (
            favoritedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectItem(item);
                  onClose();
                }}
                className="group p-3 bg-stone-50 hover:bg-amber-50/50 border border-stone-200 hover:border-amber-400/60 rounded-2xl flex items-center gap-3 transition-all cursor-pointer relative"
              >
                <div className="w-16 h-16 rounded-xl bg-stone-200 overflow-hidden shrink-0 relative">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-500 mb-0.5">
                    <span className="font-medium text-amber-800">{item.school}</span>
                    <span>·</span>
                    <span>{item.condition}</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-800 truncate group-hover:text-amber-800">
                    {item.title}
                  </h4>
                  <div className="mt-1">
                    {item.dealType === 'free' ? (
                      <span className="text-xs font-bold text-emerald-700">免費贈送 $0</span>
                    ) : item.dealType === 'exchange' ? (
                      <span className="text-xs font-bold text-teal-800">以物交換</span>
                    ) : (
                      <span className="text-xs font-bold text-amber-800 tabular-nums">
                        ${item.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(item.id);
                  }}
                  className="absolute top-3 right-3 text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                  title="移除收藏"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        {favoritedItems.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 text-[11px] text-stone-500 text-center">
            💾 收藏紀錄已即時儲存於您的瀏覽器 localStorage
          </div>
        )}

      </div>

    </div>
  );
};
