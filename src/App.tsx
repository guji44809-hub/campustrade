/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Heart, 
  RotateCcw, 
  Download, 
  Info, 
  GraduationCap,
  PackageOpen,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { 
  CampusItem, 
  CurrentUser, 
  FilterState, 
  ItemStatus, 
  NotificationItem, 
  ReportItem, 
  UserRole,
  ChatSession,
  ChatMessage 
} from './types.ts';
import { INITIAL_ITEMS, CURRENT_USERS, INITIAL_NOTIFICATIONS, INITIAL_REPORTS } from './mockData.ts';
import { Navbar } from './components/Navbar.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { ItemCard } from './components/ItemCard.tsx';
import { ItemDetailModal } from './components/ItemDetailModal.tsx';
import { PublishModal } from './components/PublishModal.tsx';
import { FavoritesDrawer } from './components/FavoritesDrawer.tsx';
import { MeetupModal } from './components/MeetupModal.tsx';
import { ReportModal } from './components/ReportModal.tsx';
import { AdminBackofficeModal } from './components/AdminBackofficeModal.tsx';
import { ChatBox } from './components/ChatBox.tsx';
import { downloadStandaloneHtmlFile } from './utils/exportHtml.ts';

const LOCAL_STORAGE_ITEMS_KEY = 'campustrade_items_v3';
const LOCAL_STORAGE_FAVS_KEY = 'campustrade_favorites_v3';
const LOCAL_STORAGE_ROLE_KEY = 'campustrade_role_v3';
const LOCAL_STORAGE_NOTIFS_KEY = 'campustrade_notifs_v3';
const LOCAL_STORAGE_REPORTS_KEY = 'campustrade_reports_v3';
const LOCAL_STORAGE_CHATS_KEY = 'campustrade_chats_v3';

const CANNED_REPLIES = [
  '同學你好！目前商品還在喔，平日中午在校內圖書館門口方便面交嗎？',
  '可以的！書況與配件都保存得很完整，請問你這週哪一天方便在學餐前驗貨？',
  '你好！請問想約在哪棟大樓交誼廳呢？我下課後隨時都可以配合喔！',
  '沒問題！現場看過滿意再交付款項就好，請問你想約什麼時候呢？',
  '太好了！剛好這週都在學校做實驗，雲起樓或宿舍中庭都可以面交喔！'
];

export default function App() {
  // Load persistent state from localStorage
  const [items, setItems] = useState<CampusItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ITEMS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved items from localStorage', e);
    }
    return INITIAL_ITEMS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FAVS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['item-1', 'item-4'];
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ROLE_KEY) as UserRole;
      if (saved && CURRENT_USERS[saved]) return saved;
    } catch (e) {}
    return 'student';
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_NOTIFS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_NOTIFICATIONS;
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_REPORTS;
  });

  const [chatSessions, setChatSessions] = useState<Record<string, ChatSession>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CHATS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      'item-1': {
        itemId: 'item-1',
        itemTitle: '《微積分 第九版 Stewart Calculus》繁體中譯本',
        itemImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        itemPrice: 450,
        dealType: 'buy_sell',
        sellerName: '陳同學 (大二資工)',
        sellerSchool: '佛光大學',
        lastUpdated: '10/30 14:30',
        messages: [
          {
            id: 'm1',
            senderName: '佛光王同學',
            isMe: true,
            text: '您好，我對您的【微積分 第九版】很感興趣，請問目前還可以面交嗎？',
            time: '14:20'
          },
          {
            id: 'm2',
            senderName: '陳同學 (大二資工)',
            isMe: false,
            text: '同學你好！目前商品還在喔，平日中午在校內圖書館門口方便面交嗎？',
            time: '14:22'
          }
        ]
      }
    };
  });

  const [activeChatId, setActiveChatId] = useState<string | null>('item-1');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const currentUser: CurrentUser = CURRENT_USERS[currentRole] || CURRENT_USERS.student;

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FAVS_KEY, JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ROLE_KEY, currentRole);
    } catch (e) {}
  }, [currentRole]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reports));
    } catch (e) {}
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CHATS_KEY, JSON.stringify(chatSessions));
    } catch (e) {}
  }, [chatSessions]);

  // Filter state
  const [filter, setFilter] = useState<FilterState>({
    searchQuery: '',
    school: '全部學校',
    category: '全部',
    dealType: '全部',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
  });

  // Modals state
  const [selectedItem, setSelectedItem] = useState<CampusItem | null>(null);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [meetupTargetItem, setMeetupTargetItem] = useState<CampusItem | null>(null);
  const [reportTargetItem, setReportTargetItem] = useState<CampusItem | null>(null);
  const [isAdminBackofficeOpen, setIsAdminBackofficeOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? '已從收藏清單中移除' : '❤️ 已加入我的收藏');
      return updated;
    });
  };

  // Switch User
  const handleSwitchUser = (role: UserRole) => {
    setCurrentRole(role);
    showToast(`已切換模擬身分為：${CURRENT_USERS[role].name}`);
  };

  // Add Item
  const handleAddItem = (newItem: CampusItem) => {
    setItems((prev) => [newItem, ...prev]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: '商品刊登成功',
      description: `您的「${newItem.title}」已成功發佈至校園二手交換平台！`,
      time: '剛剛',
      read: false,
      type: 'system',
      itemId: newItem.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`🎉 成功刊登「${newItem.title}」！`);
  };

  // Update Item Status (available, reserved, sold)
  const handleUpdateStatus = (id: string, newStatus: ItemStatus) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: newStatus } : it))
    );
    if (selectedItem?.id === id) {
      setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    const labelMap: Record<ItemStatus, string> = {
      available: '上架中',
      reserved: '預約中 (面交洽談中)',
      sold: '已售出 / 結緣完成',
    };
    showToast(`狀態已更新為：${labelMap[newStatus]}`);
  };

  // Delete Item (by owner or admin)
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setFavorites((prev) => prev.filter((favId) => favId !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
    showToast('該商品已成功下架');
  };

  // Submit Report
  const handleSubmitReport = (newReport: ReportItem) => {
    setReports((prev) => [newReport, ...prev]);
    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: '🚨 收到新檢舉案件',
      description: `${newReport.reporterName} 檢舉了「${newReport.itemTitle}」：${newReport.reason}`,
      time: '剛剛',
      read: false,
      type: 'report',
      itemId: newReport.itemId,
    };
    setNotifications((prev) => [adminNotif, ...prev]);
    showToast('已送出檢舉，感謝您協助維護校園交易安全！');
  };

  // Admin Force Take Down
  const handleForceTakeDown = (itemId: string, reportId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
    setFavorites((prev) => prev.filter((favId) => favId !== itemId));
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
    );
    if (selectedItem?.id === itemId) {
      setSelectedItem(null);
    }
    showToast('管理員已強制下架違規商品！');
  };

  // Admin Dismiss Report
  const handleDismissReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'dismissed' } : r))
    );
    showToast('已駁回該項檢舉，商品保留正常上架。');
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('已將所有站內通知標記為已讀');
  };

  // Add Q&A
  const handleAddQnA = (itemId: string, content: string) => {
    const isSeller = selectedItem?.seller.id === currentUser.id;
    const now = new Date();
    const timeStr = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg = {
      id: `qna-${Date.now()}`,
      userId: currentUser.id,
      userName: isSeller ? `${currentUser.name} (賣家)` : currentUser.name,
      userSchool: currentUser.school !== '未設定學校' ? currentUser.school : '校內同學',
      isSeller,
      content,
      timestamp: timeStr,
    };

    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          const updatedQna = [...it.qna, newMsg];
          const updatedItem = { ...it, qna: updatedQna };
          if (selectedItem?.id === itemId) {
            setSelectedItem(updatedItem);
          }
          return updatedItem;
        }
        return it;
      })
    );

    if (!isSeller) {
      const sellerNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: '商品收到新提問',
        description: `${currentUser.name} 對您的商品提出了問題：「${content.slice(0, 30)}...」`,
        time: '剛剛',
        read: false,
        type: 'qna',
        itemId,
      };
      setNotifications((prev) => [sellerNotif, ...prev]);
    }

    showToast('提問已成功發佈於公開問答板！');
  };

  // Open Chat from Product Modal
  const handleOpenChat = (item: CampusItem) => {
    if (currentUser.role === 'guest') {
      showToast('⚠️ 請先於右上角切換為登入身分（如：佛光王同學）才能發起私訊交流喔！');
      return;
    }

    setSelectedItem(null); // Close product detail modal

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setChatSessions((prev) => {
      if (!prev[item.id]) {
        const initialSession: ChatSession = {
          itemId: item.id,
          itemTitle: item.title,
          itemImage: item.images[0] || '',
          itemPrice: item.price,
          dealType: item.dealType,
          sellerName: item.seller.name,
          sellerSchool: item.seller.school,
          lastUpdated: timeStr,
          messages: [
            {
              id: `m-${Date.now()}`,
              senderName: currentUser.name,
              isMe: true,
              text: `您好，我對您的【${item.title}】很感興趣，請問目前還可以面交/交易嗎？`,
              time: timeStr,
            },
          ],
        };

        // Notify
        const notif: NotificationItem = {
          id: `notif-${Date.now()}`,
          title: '已發起買賣私訊',
          description: `已向 ${item.seller.name} 發送關於「${item.title}」的交易諮詢訊息。`,
          time: '剛剛',
          read: false,
          type: 'exchange',
          itemId: item.id,
        };
        setNotifications((n) => [notif, ...n]);

        return { ...prev, [item.id]: initialSession };
      }
      return prev;
    });

    setActiveChatId(item.id);
    setIsChatOpen(true);
    setIsChatMinimized(false);
  };

  // Send message inside ChatBox
  const handleSendMessage = (text: string) => {
    if (!activeChatId || !chatSessions[activeChatId]) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderName: currentUser.name,
      isMe: true,
      text,
      time: timeStr,
    };

    setChatSessions((prev) => {
      const cur = prev[activeChatId];
      if (!cur) return prev;
      return {
        ...prev,
        [activeChatId]: {
          ...cur,
          messages: [...cur.messages, userMsg],
          lastUpdated: timeStr,
        },
      };
    });

    // Simulated auto-reply after 1.5s
    const targetSession = chatSessions[activeChatId];
    setTimeout(() => {
      const replyNow = new Date();
      const replyTime = `${String(replyNow.getHours()).padStart(2, '0')}:${String(replyNow.getMinutes()).padStart(2, '0')}`;
      const randomReply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];

      const sellerMsg: ChatMessage = {
        id: `m-reply-${Date.now()}`,
        senderName: targetSession.sellerName,
        isMe: false,
        text: randomReply,
        time: replyTime,
      };

      setChatSessions((prev) => {
        const cur = prev[activeChatId];
        if (!cur) return prev;
        return {
          ...prev,
          [activeChatId]: {
            ...cur,
            messages: [...cur.messages, sellerMsg],
            lastUpdated: replyTime,
          },
        };
      });

      // Push notification
      const replyNotif: NotificationItem = {
        id: `notif-chat-${Date.now()}`,
        title: '收到私訊新回覆',
        description: `${targetSession.sellerName} 回覆了您：「${randomReply.slice(0, 24)}...」`,
        time: '剛剛',
        read: false,
        type: 'qna',
        itemId: targetSession.itemId,
      };
      setNotifications((prev) => [replyNotif, ...prev]);
    }, 1500);
  };

  // Filter & Search Logic
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.description.toLowerCase().includes(q) ||
          it.school.toLowerCase().includes(q) ||
          (it.exchangeWish && it.exchangeWish.toLowerCase().includes(q))
      );
    }

    if (filter.school !== '全部學校') {
      result = result.filter((it) => it.school === filter.school);
    }

    if (filter.category !== '全部') {
      result = result.filter((it) => it.category === filter.category);
    }

    if (filter.dealType !== '全部') {
      result = result.filter((it) => it.dealType === filter.dealType);
    }

    const minVal = filter.minPrice !== '' ? Number(filter.minPrice) : null;
    const maxVal = filter.maxPrice !== '' ? Number(filter.maxPrice) : null;

    if (minVal !== null && !isNaN(minVal)) {
      result = result.filter((it) => it.price >= minVal);
    }
    if (maxVal !== null && !isNaN(maxVal)) {
      result = result.filter((it) => it.price <= maxVal);
    }

    if (filter.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filter.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filter.sortBy === 'popular') {
      result.sort((a, b) => b.likes - a.likes);
    }

    return result;
  }, [items, filter]);

  const favoritedItemsList = useMemo(() => {
    return items.filter((it) => favorites.includes(it.id));
  }, [items, favorites]);

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;
  const currentChatSession = activeChatId ? chatSessions[activeChatId] : null;

  const handleResetFilters = () => {
    setFilter({
      searchQuery: '',
      school: '全部學校',
      category: '全部',
      dealType: '全部',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-800">
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-70 bg-stone-900/90 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md border border-stone-700 flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        searchQuery={filter.searchQuery}
        onSearchChange={(q) => setFilter((prev) => ({ ...prev, searchQuery: q }))}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenPublish={() => setIsPublishOpen(true)}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        notifications={notifications}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onOpenAdminBackoffice={() => setIsAdminBackofficeOpen(true)}
        pendingReportsCount={pendingReportsCount}
        hasActiveChat={Boolean(activeChatId)}
        onOpenRecentChat={() => {
          if (activeChatId) {
            setIsChatOpen(true);
            setIsChatMinimized(false);
          } else {
            showToast('請先由商品詳細頁點擊「聯絡賣家」發起私訊');
          }
        }}
      />

      {/* Campus Trust Banner */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-amber-100 py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span>
              全國大學生二手交流區 · 佛光大學、台大、政大、淡江等跨校直聯 · 推薦白天於校園公共場所安全面交
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-amber-200/90 text-[11px]">
            <span>✓ 支援以物易物補差價</span>
            <span>✓ 學長姐宿舍出清免費贈送</span>
            <span>✓ 買賣雙方校內即時私訊</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <FilterBar
        filter={filter}
        onFilterChange={(update) => setFilter((prev) => ({ ...prev, ...update }))}
        onResetFilter={handleResetFilters}
        totalCount={filteredItems.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {filter.searchQuery && (
          <div className="mb-4 flex items-center gap-2 text-xs text-stone-600 bg-stone-100 p-2.5 rounded-xl border border-stone-200">
            <Search className="w-3.5 h-3.5 text-stone-400" />
            <span>搜尋關鍵字：「<strong>{filter.searchQuery}</strong>」的相關結果</span>
            <button
              onClick={() => setFilter((prev) => ({ ...prev, searchQuery: '' }))}
              className="text-amber-800 font-semibold underline ml-auto text-xs"
            >
              清除關鍵字
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shadow-xs">
              <PackageOpen className="w-10 h-10" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-stone-900">沒有找到符合條件的商品</h2>
              <p className="text-xs text-stone-500 leading-relaxed">
                可能是篩選價格範圍過窄、此分類目前尚無刊登，或關鍵字拼寫有誤。試試放寬篩選條件或重新搜尋。
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="mt-2 flex items-center gap-2 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置所有篩選條件</span>
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isFavorited={favorites.includes(item.id)}
                onToggleFavorite={handleToggleFavorite}
                onClick={(it) => setSelectedItem(it)}
                currentUser={currentUser}
                onDeleteItem={handleDeleteItem}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white text-stone-600 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-700 flex items-center justify-center text-white font-bold text-xs">
                CT
              </div>
              <div>
                <p className="font-bold text-stone-900">CampusTrade 校園二手交換平台</p>
                <p className="text-[11px] text-stone-400">大專院校學生二手物品交流 · 提倡惜物減廢與循環再利用</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={downloadStandaloneHtmlFile}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-stone-800 text-xs font-semibold shadow-xs transition-colors"
                title="下載完全獨立的單一 HTML 檔案，離線可開"
              >
                <Download className="w-3.5 h-3.5 text-amber-700" />
                <span>匯出單一獨立 HTML 檔 (無依賴隨點即開)</span>
              </button>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400">
            <p>© 2026 CampusTrade. 嚴格遵守教育部與各校校園安全守則，請務必選擇白天公共場所面交驗貨。</p>
            <div className="flex items-center gap-4">
              <span>支援全台各大專院校</span>
              <span>·</span>
              <span>純前端離線持久化 (localStorage)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isFavorited={selectedItem ? favorites.includes(selectedItem.id) : false}
        onToggleFavorite={handleToggleFavorite}
        currentUser={currentUser}
        onAddQnA={handleAddQnA}
        onOpenMeetup={(it) => setMeetupTargetItem(it)}
        onOpenReport={(it) => setReportTargetItem(it)}
        onUpdateStatus={handleUpdateStatus}
        onOpenChat={handleOpenChat}
      />

      {/* Publish Listing Modal */}
      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        currentUser={currentUser}
        onSubmit={handleAddItem}
      />

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoritedItems={favoritedItemsList}
        onRemoveFavorite={handleToggleFavorite}
        onClearAll={() => {
          setFavorites([]);
          showToast('已清空所有收藏');
        }}
        onSelectItem={(it) => setSelectedItem(it)}
      />

      {/* Campus Meetup Appointment Modal */}
      <MeetupModal
        item={meetupTargetItem}
        currentUser={currentUser}
        isOpen={Boolean(meetupTargetItem)}
        onClose={() => setMeetupTargetItem(null)}
        onSuccessToast={showToast}
      />

      {/* Report Modal */}
      <ReportModal
        item={reportTargetItem}
        isOpen={Boolean(reportTargetItem)}
        onClose={() => setReportTargetItem(null)}
        currentUser={currentUser}
        onSubmitReport={handleSubmitReport}
      />

      {/* Admin Backoffice Modal */}
      <AdminBackofficeModal
        isOpen={isAdminBackofficeOpen}
        onClose={() => setIsAdminBackofficeOpen(false)}
        reports={reports}
        totalActiveItems={items.length}
        onForceTakeDown={handleForceTakeDown}
        onDismissReport={handleDismissReport}
        onViewItem={(id) => {
          const it = items.find((x) => x.id === id);
          if (it) {
            setSelectedItem(it);
            setIsAdminBackofficeOpen(false);
          } else {
            showToast('該商品已被下架');
          }
        }}
      />

      {/* Private Chat Box */}
      <ChatBox
        session={currentChatSession}
        isOpen={isChatOpen}
        isMinimized={isChatMinimized}
        onClose={() => setIsChatOpen(false)}
        onToggleMinimize={() => setIsChatMinimized((prev) => !prev)}
        onSendMessage={handleSendMessage}
        currentUser={currentUser}
      />

    </div>
  );
}
