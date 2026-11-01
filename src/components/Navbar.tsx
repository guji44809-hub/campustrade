import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Heart, 
  PlusCircle, 
  UserCheck, 
  ShieldAlert, 
  User, 
  ChevronDown,
  X,
  Bell,
  CheckCheck,
  MessageCircle,
  MessageSquare,
  ArrowLeftRight,
  ShieldCheck,
  SlidersHorizontal
} from 'lucide-react';
import { CurrentUser, NotificationItem, UserRole } from '../types.ts';
import { CURRENT_USERS } from '../mockData.ts';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenPublish: () => void;
  currentUser: CurrentUser;
  onSwitchUser: (role: UserRole) => void;
  notifications: NotificationItem[];
  onMarkAllNotificationsRead: () => void;
  onOpenAdminBackoffice: () => void;
  pendingReportsCount: number;
  onOpenRecentChat?: () => void;
  hasActiveChat?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  favoritesCount,
  onOpenFavorites,
  onOpenPublish,
  currentUser,
  onSwitchUser,
  notifications,
  onMarkAllNotificationsRead,
  onOpenAdminBackoffice,
  pendingReportsCount,
  onOpenRecentChat,
  hasActiveChat,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Wordmark (Zone 1) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-amber-700 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-1.5">
                CampusTrade
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 hidden sm:inline-block">
                  校園二手交換
                </span>
              </span>
              <p className="text-[11px] text-stone-500 leading-tight hidden md:block">
                全國大專院校安全面交平台
              </p>
            </div>
          </div>

          {/* Global Search Bar (Zone 2) */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="搜尋課本、3C、宿舍家具、腳踏車..."
                className="w-full pl-10 pr-9 py-2 bg-stone-100/80 hover:bg-stone-100 focus:bg-white text-sm text-stone-900 placeholder:text-stone-400 rounded-xl border border-stone-200 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                  title="清除搜尋"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Tools, Notification & Role Switcher (Zone 3) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Notification Bell with Badge & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className="relative p-2 text-stone-700 hover:text-amber-800 hover:bg-stone-200/60 rounded-xl transition-colors"
                title="站內通知"
              >
                <Bell className="w-5 h-5 text-stone-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 px-1">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-amber-700" />
                      <span className="font-bold text-xs text-stone-800">站內即時通知</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-bold">
                          {unreadCount} 未讀
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={onMarkAllNotificationsRead}
                        className="text-[11px] text-amber-800 font-semibold hover:underline flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>全部標記為已讀</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 py-1">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-stone-400">目前暫無站內通知</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-2.5 rounded-xl text-xs transition-colors ${
                            !notif.read ? 'bg-amber-50/70 border border-amber-200/50' : 'hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-stone-900 flex items-center gap-1">
                              {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block" />}
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-stone-400">{notif.time}</span>
                          </div>
                          <p className="text-stone-600 leading-relaxed text-[11px]">{notif.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Private Messages Toggle */}
            <button
              onClick={onOpenRecentChat}
              className="relative p-2 text-stone-700 hover:text-amber-800 hover:bg-stone-200/60 rounded-xl transition-colors flex items-center gap-1.5 text-sm font-medium"
              title="買賣家私訊"
            >
              <MessageSquare className="w-5 h-5 text-stone-600" />
              {hasActiveChat && (
                <span className="w-2 h-2 rounded-full bg-amber-600 absolute top-2 right-2" />
              )}
            </button>

            {/* Favorites Drawer Toggle */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 text-stone-700 hover:text-amber-800 hover:bg-stone-200/60 rounded-xl transition-colors flex items-center gap-1.5 text-sm font-medium"
              title="我的收藏"
            >
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'text-rose-600 fill-rose-500' : 'text-stone-600'}`} />
              <span className="hidden sm:inline">收藏</span>
              {favoritesCount > 0 && (
                <span className="min-w-[20px] h-5 px-1 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Publish Item CTA */}
            <button
              onClick={onOpenPublish}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 active:scale-98 text-white text-sm font-semibold shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="whitespace-nowrap">刊登商品</span>
            </button>

            {/* Admin Backoffice Button (When Admin is selected) */}
            {currentUser.role === 'admin' && (
              <button
                onClick={onOpenAdminBackoffice}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-900 hover:bg-black text-rose-300 hover:text-rose-200 text-xs font-bold shadow-sm transition-colors relative"
                title="開啟管理員審查後台"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="hidden md:inline">管理員後台</span>
                {pendingReportsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                    {pendingReportsCount}
                  </span>
                )}
              </button>
            )}

            {/* Role Switcher Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 transition-colors">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-lg object-cover border border-stone-300"
                />
                <div className="text-left hidden lg:block leading-tight">
                  <div className="flex items-center gap-1 font-semibold text-stone-800">
                    <span>{currentUser.name}</span>
                    {currentUser.isEduVerified && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-medium">
                        edu驗證
                      </span>
                    )}
                    {currentUser.role === 'admin' && (
                      <span className="text-[10px] bg-red-100 text-red-800 px-1 py-0.2 rounded font-medium">
                        管理員
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-500">{currentUser.school}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 hidden group-hover:block hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-2 border-b border-stone-100">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">切換模擬身分</p>
                  <p className="text-xs text-stone-600">體驗不同身分的刊登與審查權限</p>
                </div>

                <div className="space-y-1 mt-1.5">
                  <button
                    onClick={() => onSwitchUser('guest')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      currentUser.role === 'guest'
                        ? 'bg-amber-50 text-amber-900 font-semibold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-stone-200 flex items-center justify-center text-stone-600">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-800">{CURRENT_USERS.guest.name}</p>
                      <p className="text-[11px] text-stone-500">純瀏覽與提問</p>
                    </div>
                  </button>

                  <button
                    onClick={() => onSwitchUser('student')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      currentUser.role === 'student'
                        ? 'bg-amber-50 text-amber-900 font-semibold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-stone-800">{CURRENT_USERS.student.name}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded">.edu驗證</span>
                      </div>
                      <p className="text-[11px] text-stone-500">{CURRENT_USERS.student.school}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => onSwitchUser('admin')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      currentUser.role === 'admin'
                        ? 'bg-amber-50 text-amber-900 font-semibold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-stone-800">{CURRENT_USERS.admin.name}</span>
                        <span className="text-[10px] bg-rose-100 text-rose-800 px-1 rounded">管理員</span>
                      </div>
                      <p className="text-[11px] text-stone-500">可進入管理員審查後台處置案件</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
