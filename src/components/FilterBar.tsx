import React from 'react';
import { 
  Building2, 
  RotateCcw, 
  ArrowUpDown, 
  AlertCircle,
  BookOpen,
  Laptop,
  Shirt,
  Armchair,
  Bike,
  Dumbbell,
  LayoutGrid
} from 'lucide-react';
import { Category, DealType, FilterState } from '../types.ts';
import { SCHOOL_LIST, CATEGORY_LIST } from '../mockData.ts';

interface FilterBarProps {
  filter: FilterState;
  onFilterChange: (update: Partial<FilterState>) => void;
  onResetFilter: () => void;
  totalCount: number;
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  '全部': <LayoutGrid className="w-4 h-4" />,
  '課本教材': <BookOpen className="w-4 h-4" />,
  '3C電子': <Laptop className="w-4 h-4" />,
  '服裝配件': <Shirt className="w-4 h-4" />,
  '家具生活': <Armchair className="w-4 h-4" />,
  '單車交通': <Bike className="w-4 h-4" />,
  '運動休閒': <Dumbbell className="w-4 h-4" />,
};

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  onResetFilter,
  totalCount,
}) => {
  const minNum = filter.minPrice !== '' ? Number(filter.minPrice) : null;
  const maxNum = filter.maxPrice !== '' ? Number(filter.maxPrice) : null;
  const isPriceInvalid = minNum !== null && maxNum !== null && minNum > maxNum;

  const handleSwapPrice = () => {
    onFilterChange({
      minPrice: filter.maxPrice,
      maxPrice: filter.minPrice,
    });
  };

  const isFiltered = Boolean(
    filter.searchQuery ||
    filter.school !== '全部學校' ||
    filter.category !== '全部' ||
    filter.dealType !== '全部' ||
    filter.minPrice ||
    filter.maxPrice ||
    filter.sortBy !== 'newest'
  );

  return (
    <section className="bg-white border-b border-stone-200/80 shadow-xs mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        
        {/* Row 1: Category Scrollable Segmented Bar */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
            {CATEGORY_LIST.map((cat) => {
              const active = filter.category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onFilterChange({ category: cat })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {CATEGORY_ICONS[cat]}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Reset Filters CTA if modified */}
          {isFiltered && (
            <button
              onClick={onResetFilter}
              className="flex items-center gap-1 text-xs font-medium text-amber-800 hover:text-amber-900 hover:bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 shrink-0 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置條件</span>
            </button>
          )}
        </div>

        {/* Row 2: Secondary Controls (School, Deal Type, Price, Sort) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs">
          
          {/* School Selector */}
          <div className="md:col-span-3 flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5">
            <Building2 className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={filter.school}
              onChange={(e) => onFilterChange({ school: e.target.value })}
              className="w-full bg-transparent text-stone-800 font-medium focus:outline-none cursor-pointer"
            >
              {SCHOOL_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Deal Type Segmented Filter */}
          <div className="md:col-span-4 flex items-center p-0.5 bg-stone-100 border border-stone-200 rounded-xl">
            {(
              [
                { label: '全部方式', value: '全部' },
                { label: '買賣', value: 'buy_sell' },
                { label: '以物交換', value: 'exchange' },
                { label: '免費贈送', value: 'free' },
              ] as const
            ).map((t) => {
              const active = filter.dealType === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => onFilterChange({ dealType: t.value as any })}
                  className={`flex-1 py-1.5 text-center font-medium rounded-lg transition-all ${
                    active
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Price Range with fool-proof guard */}
          <div className="md:col-span-3 flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-xl px-2 py-1 relative">
            <span className="text-stone-400 font-medium">$</span>
            <input
              type="number"
              min="0"
              value={filter.minPrice}
              onChange={(e) => onFilterChange({ minPrice: e.target.value })}
              placeholder="最低價"
              className="w-16 bg-transparent text-stone-800 font-medium focus:outline-none"
            />
            <span className="text-stone-300">~</span>
            <span className="text-stone-400 font-medium">$</span>
            <input
              type="number"
              min="0"
              value={filter.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
              placeholder="最高價"
              className="w-16 bg-transparent text-stone-800 font-medium focus:outline-none"
            />

            {/* Fool-proof Error Tooltip */}
            {isPriceInvalid && (
              <div className="absolute top-full left-0 mt-1 z-20 bg-rose-50 border border-rose-300 text-rose-700 px-2 py-1 rounded-lg text-[11px] flex items-center gap-1.5 shadow-md whitespace-nowrap">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>最低價不可高於最高價</span>
                <button
                  onClick={handleSwapPrice}
                  className="underline font-semibold ml-1 hover:text-rose-900"
                >
                  互換
                </button>
              </div>
            )}
          </div>

          {/* Sorting dropdown & Item Count */}
          <div className="md:col-span-2 flex items-center justify-end gap-2">
            <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-xl px-2 py-1.5 w-full">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <select
                value={filter.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
                className="w-full bg-transparent text-stone-800 font-medium focus:outline-none cursor-pointer"
              >
                <option value="newest">最新上架</option>
                <option value="price_asc">價格：由低到高</option>
                <option value="price_desc">價格：由高到低</option>
                <option value="popular">最多人收藏</option>
              </select>
            </div>
          </div>

        </div>

        {/* Status subline: Active condition note & Total found */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <span>
              已搜尋到 <strong className="font-semibold text-stone-900 tabular-nums">{totalCount}</strong> 件校園二手物件
            </span>
            {filter.school !== '全部學校' && (
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
                限定：{filter.school}
              </span>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-3 text-stone-400">
            <span>· 白天公開校園面交</span>
            <span>· 零手續費</span>
            <span>· 提倡環保永續</span>
          </div>
        </div>

      </div>
    </section>
  );
};
