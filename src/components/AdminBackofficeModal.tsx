import React from 'react';
import { X, ShieldCheck, ShieldAlert, Trash2, CheckCircle2, AlertOctagon, ExternalLink } from 'lucide-react';
import { ReportItem } from '../types.ts';

interface AdminBackofficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: ReportItem[];
  totalActiveItems: number;
  onForceTakeDown: (itemId: string, reportId: string) => void;
  onDismissReport: (reportId: string) => void;
  onViewItem: (itemId: string) => void;
}

export const AdminBackofficeModal: React.FC<AdminBackofficeModalProps> = ({
  isOpen,
  onClose,
  reports,
  totalActiveItems,
  onForceTakeDown,
  onDismissReport,
  onViewItem,
}) => {
  if (!isOpen) return null;

  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white border border-stone-200 rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden z-10 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">CampusTrade 平台管理員審查後台</h3>
              <p className="text-[11px] text-stone-400">商品安全維護、檢舉案件審查與違規下架處置</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Stats Strip */}
        <div className="grid grid-cols-3 gap-4 px-6 py-3.5 bg-stone-50 border-b border-stone-200 text-xs">
          <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center">
            <span className="text-[10px] text-stone-500 block font-medium">全站上架商品總數</span>
            <span className="text-lg font-bold text-stone-900 tabular-nums">{totalActiveItems}</span>
          </div>
          <div className="p-2.5 bg-rose-50/70 rounded-xl border border-rose-200 text-center">
            <span className="text-[10px] text-rose-800 block font-semibold">待審查檢舉案件</span>
            <span className="text-lg font-bold text-rose-700 tabular-nums">{pendingReports.length}</span>
          </div>
          <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-center">
            <span className="text-[10px] text-emerald-800 block font-semibold">系統健康狀態</span>
            <span className="text-lg font-bold text-emerald-700">良好正常</span>
          </div>
        </div>

        {/* Content Body: Reported Items List */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-stone-900 text-xs">檢舉待審清單 ({pendingReports.length})</h4>
            <span className="text-[11px] text-stone-400">依檢舉時間最新排序</span>
          </div>

          {pendingReports.length === 0 ? (
            <div className="py-14 text-center space-y-2 text-stone-400">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
              <p className="text-xs font-bold text-stone-700">目前全站無任何未處理之檢舉案件</p>
              <p className="text-[11px]">校園交易環境安全清潔，感謝同學與管理團隊維護！</p>
            </div>
          ) : (
            pendingReports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3 hover:border-amber-400 transition-all text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rep.itemImage}
                      alt={rep.itemTitle}
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <h5 className="font-bold text-stone-900 line-clamp-1">{rep.itemTitle}</h5>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                        <span>賣家：<strong className="text-stone-700">{rep.sellerName}</strong></span>
                        <span>·</span>
                        <span>檢舉人：<strong className="text-stone-700">{rep.reporterName}</strong></span>
                        <span>·</span>
                        <span>{rep.time}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewItem(rep.itemId)}
                    className="flex items-center gap-1 text-[11px] text-amber-800 font-semibold hover:underline shrink-0"
                  >
                    <span>檢視原商品</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Reason & Detail Box */}
                <div className="p-3 bg-white border border-rose-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-700">
                    <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                    <span>檢舉事由：{rep.reason}</span>
                  </div>
                  <p className="text-stone-600 text-[11px] pl-5">
                    <strong>說明：</strong>{rep.detail}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-stone-200">
                  <button
                    onClick={() => onDismissReport(rep.id)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 font-semibold text-xs transition-colors"
                  >
                    駁回檢舉 (保留商品)
                  </button>
                  <button
                    onClick={() => onForceTakeDown(rep.itemId, rep.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-xs flex items-center gap-1 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>強制下架商品</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 text-[11px] text-stone-500 flex justify-between items-center">
          <span>管理員處置將同步記錄於全站審查日誌</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border bg-white font-semibold text-stone-700"
          >
            關閉後台
          </button>
        </div>

      </div>
    </div>
  );
};
