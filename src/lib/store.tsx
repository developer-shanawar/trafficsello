import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';
import {
  UserProfile, Campaign, PaymentDeposit, WalletTransaction,
  SupportTicket, AppNotification, PlatformSettings, CampaignStatus, UserRole, Testimonial
} from '../types';
import {
  DEFAULT_SETTINGS, INITIAL_USERS, INITIAL_CAMPAIGNS,
  INITIAL_PAYMENTS, INITIAL_TRANSACTIONS, INITIAL_TICKETS, INITIAL_NOTIFICATIONS, INITIAL_TESTIMONIALS
} from './initialData';
import { sendNativeNotification } from './notifications';

interface StoreContextType {
  user: UserProfile | null;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: { fullName: string; email: string; password?: string; telegram?: string; whatsApp?: string }) => Promise<boolean>;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  
  // Campaigns
  campaigns: Campaign[];
  addCampaign: (data: Omit<Campaign, 'id' | 'userId' | 'userName' | 'visitorsDelivered' | 'status' | 'createdAt'>) => Promise<{ success: boolean; message?: string }>;
  updateCampaignStatus: (id: string, status: CampaignStatus) => void;
  deleteCampaign: (id: string) => void;

  // Payments & Wallet
  walletDeposits: PaymentDeposit[];
  requestDeposit: (data: Omit<PaymentDeposit, 'id' | 'userId' | 'userName' | 'userEmail' | 'status' | 'createdAt'>) => Promise<void>;
  approveDeposit: (depositId: string, adminNote?: string) => void;
  rejectDeposit: (depositId: string, adminNote?: string) => void;
  transactions: WalletTransaction[];

  // Support
  supportTickets: SupportTicket[];
  createTicket: (data: { subject: string; category: SupportTicket['category']; priority: SupportTicket['priority']; message: string }) => void;
  createTicketForUser: (userId: string, data: { subject: string; category: SupportTicket['category']; priority: SupportTicket['priority']; message: string }) => void;
  addTicketMessage: (ticketId: string, text: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  sendAdminNotification: (data: { userId: string; title: string; message: string; type?: AppNotification['type'] }) => void;

  // Platform Settings & Pages Content
  platformSettings: PlatformSettings;
  updatePlatformSettings: (settings: PlatformSettings) => void;

  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (data: Omit<Testimonial, 'id' | 'createdAt'>) => void;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // Profile & User Stats
  updateProfile: (data: Partial<UserProfile>) => void;
  allUsers: UserProfile[];
  updateUserBalanceByAdmin: (userId: string, newBalance: number) => void;
  toggleUserSuspension: (userId: string, isSuspended: boolean, reason?: string) => void;
  getUserStats: (userId: string) => {
    todayHits: number;
    yesterdayHits: number;
    activeCampaignsCount: number;
    totalSpent: number;
    currentBalance: number;
  };
  resetToInitialData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('trafficsell_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  // Load state from localStorage or initial fallback
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('trafficsell_users');
    let usersList: UserProfile[] = saved ? JSON.parse(saved) : [];
    
    // Merge INITIAL_USERS to ensure all sample users exist
    const merged = [...usersList];
    for (const seedUser of INITIAL_USERS) {
      if (!merged.some(u => u.id === seedUser.id || u.email.toLowerCase() === seedUser.email.toLowerCase())) {
        merged.push(seedUser);
      }
    }
    return merged.length > 0 ? merged : INITIAL_USERS;
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedActive = localStorage.getItem('trafficsell_active_user');
    if (savedActive) {
      try {
        return JSON.parse(savedActive);
      } catch (e) {
        // fallback
      }
    }
    return null; // Visitor mode by default
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('trafficsell_campaigns');
    let list: Campaign[] = saved ? JSON.parse(saved) : [];
    const merged = [...list];
    for (const seedCmp of INITIAL_CAMPAIGNS) {
      if (!merged.some(c => c.id === seedCmp.id)) {
        merged.push(seedCmp);
      }
    }
    return merged.length > 0 ? merged : INITIAL_CAMPAIGNS;
  });

  const [walletDeposits, setWalletDeposits] = useState<PaymentDeposit[]>(() => {
    const saved = localStorage.getItem('trafficsell_payments');
    let list: PaymentDeposit[] = saved ? JSON.parse(saved) : [];
    const merged = [...list];
    for (const seedDep of INITIAL_PAYMENTS) {
      if (!merged.some(p => p.id === seedDep.id)) {
        merged.push(seedDep);
      }
    }
    return merged.length > 0 ? merged : INITIAL_PAYMENTS;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('trafficsell_transactions');
    let list: WalletTransaction[] = saved ? JSON.parse(saved) : [];
    const merged = [...list];
    for (const seedTx of INITIAL_TRANSACTIONS) {
      if (!merged.some(t => t.id === seedTx.id)) {
        merged.push(seedTx);
      }
    }
    return merged.length > 0 ? merged : INITIAL_TRANSACTIONS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('trafficsell_tickets');
    let list: SupportTicket[] = saved ? JSON.parse(saved) : [];
    const merged = [...list];
    for (const seedTkt of INITIAL_TICKETS) {
      if (!merged.some(t => t.id === seedTkt.id)) {
        merged.push(seedTkt);
      }
    }
    return merged.length > 0 ? merged : INITIAL_TICKETS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('trafficsell_notifications');
    let list: AppNotification[] = saved ? JSON.parse(saved) : [];
    const merged = [...list];
    for (const seedNtf of INITIAL_NOTIFICATIONS) {
      if (!merged.some(n => n.id === seedNtf.id)) {
        merged.push(seedNtf);
      }
    }
    return merged.length > 0 ? merged : INITIAL_NOTIFICATIONS;
  });

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('trafficsell_settings');
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.pageContent) {
          parsed.pageContent = DEFAULT_SETTINGS.pageContent;
        }
        if (!parsed.siteIconUrl || parsed.siteIconUrl.includes('unsplash.com') || parsed.siteIconUrl.includes('/src/assets/images')) {
          parsed.siteIconUrl = '/logo.png';
        }
        return parsed;
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('trafficsell_testimonials');
    return saved !== null ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  useEffect(() => {
    localStorage.setItem('trafficsell_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  // Sync site title and favicon icon tab from platformSettings
  useEffect(() => {
    if (platformSettings?.siteName) {
      document.title = `${platformSettings.siteName} - Website Traffic Marketplace & Ad Network`;
    }
    const iconUrl = platformSettings?.siteIconUrl || '/logo.png';
    const relTypes = ['icon', 'shortcut icon', 'apple-touch-icon'];
    relTypes.forEach((rel) => {
      let link: HTMLLinkElement | null = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = iconUrl;
    });
  }, [platformSettings?.siteName, platformSettings?.siteIconUrl]);

  // Sync theme to localStorage and DOM
  useEffect(() => {
    localStorage.setItem('trafficsell_theme', theme);
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('trafficsell_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('trafficsell_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('trafficsell_active_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('trafficsell_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('trafficsell_payments', JSON.stringify(walletDeposits));
  }, [walletDeposits]);

  useEffect(() => {
    localStorage.setItem('trafficsell_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('trafficsell_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem('trafficsell_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('trafficsell_settings', JSON.stringify(platformSettings));
  }, [platformSettings]);

  // Real-time Traffic Simulator Tick
  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(prevCampaigns => {
        let updated = false;
        const newCampaigns = prevCampaigns.map(cmp => {
          if (cmp.status === 'running' && cmp.visitorsDelivered < cmp.visitorsTarget) {
            updated = true;
            const increment = Math.floor(Math.random() * 85) + 35; // deliver 35 - 120 visitors per tick
            const nextDelivered = Math.min(cmp.visitorsTarget, cmp.visitorsDelivered + increment);
            const isFinished = nextDelivered >= cmp.visitorsTarget;

            if (isFinished) {
              // Add completed notification
              const newNotification: AppNotification = {
                id: `ntf_${Date.now()}`,
                userId: cmp.userId,
                title: 'Campaign Complete 🎉',
                message: `Your campaign "${cmp.name}" has successfully reached its target of ${cmp.visitorsTarget.toLocaleString()} visitors!`,
                type: 'campaign',
                read: false,
                createdAt: new Date().toISOString()
              };
              setNotifications(prev => [newNotification, ...prev]);

              sendNativeNotification('TrafficSell Campaign Complete 🎉', `Your campaign "${cmp.name}" reached target ${cmp.visitorsTarget.toLocaleString()} visitors!`);
            }

            return {
              ...cmp,
              visitorsDelivered: nextDelivered,
              status: isFinished ? ('completed' as CampaignStatus) : cmp.status
            };
          }
          return cmp;
        });

        return updated ? newCampaigns : prevCampaigns;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Client IP state
  const [clientIp, setClientIp] = useState<string>('182.185.120.44');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        if (data && data.ip) {
          setClientIp(data.ip);
          if (user) {
            setUser(prev => prev ? { ...prev, ipAddress: data.ip } : null);
            setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, ipAddress: data.ip } : u));
          }
        }
      })
      .catch(() => {
        // Fallback IP if external IP service is unreachable
      });
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    const isMasterAdmin = email.toLowerCase() === 'developershanawar@gmail.com';
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!found) {
      throw new Error(`No account found registered with email "${email}". Please register an account first.`);
    }

    if (found.password && password && found.password !== password) {
      throw new Error('Invalid password. Please check your credentials and try again.');
    }

    const updatedFound: UserProfile = {
      ...found,
      role: isMasterAdmin ? 'admin' : found.role,
      password: found.password || password || '',
      ipAddress: clientIp,
      lastLoginIp: clientIp,
    };

    setAllUsers(prev => prev.map(u => u.id === found.id ? updatedFound : u));
    setUser(updatedFound);
    return true;
  };

  const register = async (data: { fullName: string; email: string; password?: string; telegram?: string; whatsApp?: string }): Promise<boolean> => {
    const isMasterAdmin = data.email.toLowerCase() === 'developershanawar@gmail.com';
    const existing = allUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    
    if (existing) {
      throw new Error(`An account with email "${data.email}" already exists. Please sign in instead.`);
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: data.email,
      password: data.password || '',
      fullName: data.fullName,
      telegram: data.telegram,
      whatsApp: data.whatsApp,
      walletBalance: 0.00,
      role: isMasterAdmin ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      ipAddress: clientIp,
      registrationIp: clientIp,
      lastLoginIp: clientIp,
    };

    setAllUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchUserRole = (role: UserRole) => {
    if (!user) return;
    const updatedUser = { ...user, role };
    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const addCampaign = async (data: Omit<Campaign, 'id' | 'userId' | 'userName' | 'visitorsDelivered' | 'status' | 'createdAt'>) => {
    if (!user) return { success: false, message: 'User not authenticated' };
    
    if (user.walletBalance < data.budget) {
      return {
        success: false,
        message: `Insufficient wallet balance (${user.walletBalance.toFixed(2)}). Required budget is ${data.budget.toFixed(2)}. Please deposit funds first.`
      };
    }

    // Deduct budget from user wallet balance
    const newBalance = user.walletBalance - data.budget;
    const updatedUser = { ...user, walletBalance: newBalance };
    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));

    // Update user balance in Supabase
    supabase.from('users').update({ wallet_balance: newBalance }).eq('id', user.id).then();

    // Create campaign - default status is pending admin approval (max 12 hours)
    const newCampaign: Campaign = {
      ...data,
      id: `cmp_${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      visitorsDelivered: 0,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setCampaigns(prev => [newCampaign, ...prev]);

    // Insert campaign to Supabase
    supabase.from('campaigns').insert([{
      id: newCampaign.id,
      user_id: newCampaign.userId,
      user_name: newCampaign.userName,
      name: newCampaign.name,
      url: newCampaign.url,
      keywords: newCampaign.keywords,
      format: newCampaign.format,
      country: newCampaign.country,
      device_type: newCampaign.deviceType,
      visitors_target: newCampaign.visitorsTarget,
      visitors_delivered: newCampaign.visitorsDelivered,
      cpm: newCampaign.cpm,
      budget: newCampaign.budget,
      status: newCampaign.status,
      estimated_delivery_hours: newCampaign.estimatedDeliveryHours,
      created_at: newCampaign.createdAt
    }]).then(({ error }) => {
      if (error) console.error('Error inserting campaign into Supabase:', error);
    });

    // Add spend transaction log
    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'spend',
      amount: data.budget,
      description: `Campaign Order: ${data.name} (${data.visitorsTarget.toLocaleString()} visitors - Pending Review)`,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    setTransactions(prev => [newTx, ...prev]);

    // Insert transaction to Supabase
    supabase.from('transactions').insert([{
      id: newTx.id,
      user_id: newTx.userId,
      type: newTx.type,
      amount: newTx.amount,
      description: newTx.description,
      status: newTx.status,
      created_at: newTx.createdAt
    }]).then();

    // Add notification
    const newNotif: AppNotification = {
      id: `ntf_${Date.now()}`,
      userId: user.id,
      title: 'Campaign Order Submitted ⏳',
      message: `Your campaign "${data.name}" was created and submitted for admin review (Max approval time: 12 Hours).`,
      type: 'campaign',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);

    supabase.from('notifications').insert([{
      id: newNotif.id,
      user_id: newNotif.userId,
      title: newNotif.title,
      message: newNotif.message,
      type: newNotif.type,
      read: false,
      created_at: newNotif.createdAt
    }]).then();

    return { success: true };
  };

  const updateCampaignStatus = (id: string, status: CampaignStatus) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    supabase.from('campaigns').update({ status }).eq('id', id).then();
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    supabase.from('campaigns').delete().eq('id', id).then();
  };

  const requestDeposit = async (data: Omit<PaymentDeposit, 'id' | 'userId' | 'userName' | 'userEmail' | 'status' | 'createdAt'>) => {
    if (!user) return;
    const newDeposit: PaymentDeposit = {
      ...data,
      id: `pay_${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setWalletDeposits(prev => [newDeposit, ...prev]);

    // Insert deposit to Supabase
    supabase.from('deposits').insert([{
      id: newDeposit.id,
      user_id: newDeposit.userId,
      user_name: newDeposit.userName,
      user_email: newDeposit.userEmail,
      method: newDeposit.method,
      amount: newDeposit.amount,
      trx_ref: newDeposit.trxRef,
      screenshot_url: newDeposit.screenshotUrl,
      status: newDeposit.status,
      created_at: newDeposit.createdAt
    }]).then(({ error }) => {
      if (error) console.error('Error inserting deposit to Supabase:', error);
    });

    // Notification
    const notif: AppNotification = {
      id: `ntf_${Date.now()}`,
      userId: user.id,
      title: 'Deposit Submitted 💳',
      message: `Your ${data.method} deposit request of $${data.amount.toFixed(2)} was submitted and is pending verification.`,
      type: 'payment',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    supabase.from('notifications').insert([{
      id: notif.id,
      user_id: notif.userId,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      read: false,
      created_at: notif.createdAt
    }]).then();

    sendNativeNotification('TrafficSell Deposit Submitted 💳', `Your ${data.method} deposit request of $${data.amount.toFixed(2)} was submitted and is pending verification.`);
  };

  const approveDeposit = (depositId: string, adminNote?: string) => {
    const deposit = walletDeposits.find(p => p.id === depositId);
    if (!deposit || deposit.status !== 'pending') return;

    // 20% extra balance bonus calculation
    const bonusAmount = deposit.amount * 0.20;
    const totalCredited = deposit.amount + bonusAmount;

    // Update deposit status
    setWalletDeposits(prev => prev.map(p => p.id === depositId ? { ...p, status: 'approved', adminNote } : p));

    supabase.from('deposits').update({ status: 'approved', admin_note: adminNote }).eq('id', depositId).then();

    // Update user balance with total credited amount (deposit + 20% bonus)
    let newBal = 0;
    setAllUsers(prev => prev.map(u => {
      if (u.id === deposit.userId) {
        newBal = u.walletBalance + totalCredited;
        return { ...u, walletBalance: newBal };
      }
      return u;
    }));

    if (user && user.id === deposit.userId) {
      setUser(prev => prev ? { ...prev, walletBalance: prev.walletBalance + totalCredited } : null);
    }

    if (newBal > 0) {
      supabase.from('users').update({ wallet_balance: newBal }).eq('id', deposit.userId).then();
    }

    // Add completion transaction log
    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: deposit.userId,
      type: 'deposit',
      amount: totalCredited,
      description: `${deposit.method} Deposit Approved: ${deposit.amount.toFixed(2)} + ${bonusAmount.toFixed(2)} (20% Extra Bonus)`,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [tx, ...prev]);

    supabase.from('transactions').insert([{
      id: tx.id,
      user_id: tx.userId,
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      status: tx.status,
      created_at: tx.createdAt
    }]).then();

    // Send notification
    const notif: AppNotification = {
      id: `ntf_${Date.now()}`,
      userId: deposit.userId,
      title: 'Deposit Approved! 🎉 (+20% Bonus Added)',
      message: `${deposit.amount.toFixed(2)} deposit + ${bonusAmount.toFixed(2)} (20% Extra Bonus) = ${totalCredited.toFixed(2)} has been credited to your TrafficSell wallet!`,
      type: 'payment',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    supabase.from('notifications').insert([{
      id: notif.id,
      user_id: notif.userId,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      read: false,
      created_at: notif.createdAt
    }]).then();

    sendNativeNotification('TrafficSell Deposit Approved! 🎉', `$${deposit.amount.toFixed(2)} deposit + ${bonusAmount.toFixed(2)} bonus credited to your TrafficSell wallet!`);
  };

  const rejectDeposit = (depositId: string, adminNote?: string) => {
    const deposit = walletDeposits.find(p => p.id === depositId);
    if (!deposit) return;

    setWalletDeposits(prev => prev.map(p => p.id === depositId ? { ...p, status: 'rejected', adminNote } : p));

    supabase.from('deposits').update({ status: 'rejected', admin_note: adminNote }).eq('id', depositId).then();

    const notif: AppNotification = {
      id: `ntf_${Date.now()}`,
      userId: deposit.userId,
      title: 'Deposit Declined ⚠️',
      message: `Your deposit request of $${deposit.amount.toFixed(2)} was declined. Reason: ${adminNote || 'Transaction verification failed'}`,
      type: 'payment',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    supabase.from('notifications').insert([{
      id: notif.id,
      user_id: notif.userId,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      read: false,
      created_at: notif.createdAt
    }]).then();

    sendNativeNotification('TrafficSell Deposit Declined ⚠️', `Deposit request of $${deposit.amount.toFixed(2)} was declined. ${adminNote ? 'Reason: ' + adminNote : ''}`);
  };

  const createTicket = (data: { subject: string; category: SupportTicket['category']; priority: SupportTicket['priority']; message: string }) => {
    if (!user) return;
    const newTicket: SupportTicket = {
      id: `tkt_${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'user',
          senderName: user.fullName,
          text: data.message,
          createdAt: new Date().toISOString()
        }
      ]
    };

    setSupportTickets(prev => [newTicket, ...prev]);

    supabase.from('tickets').insert([{
      id: newTicket.id,
      user_id: newTicket.userId,
      user_name: newTicket.userName,
      user_email: newTicket.userEmail,
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      status: newTicket.status,
      created_at: newTicket.createdAt,
      messages: newTicket.messages
    }]).then(({ error }) => {
      if (error) console.error('Error inserting ticket to Supabase:', error);
    });
  };

  const createTicketForUser = (targetUserId: string, data: { subject: string; category: SupportTicket['category']; priority: SupportTicket['priority']; message: string }) => {
    const targetUser = allUsers.find(u => u.id === targetUserId);
    if (!targetUser) return;

    const newTicket: SupportTicket = {
      id: `tkt_${Date.now()}`,
      userId: targetUser.id,
      userName: targetUser.fullName,
      userEmail: targetUser.email,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'admin',
          senderName: user?.fullName || 'Support Desk',
          text: data.message,
          createdAt: new Date().toISOString()
        }
      ]
    };

    setSupportTickets(prev => [newTicket, ...prev]);

    supabase.from('tickets').insert([{
      id: newTicket.id,
      user_id: newTicket.userId,
      user_name: newTicket.userName,
      user_email: newTicket.userEmail,
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      status: newTicket.status,
      created_at: newTicket.createdAt,
      messages: newTicket.messages
    }]).then(({ error }) => {
      if (error) console.error('Error inserting ticket to Supabase:', error);
    });
  };

  const addTicketMessage = (ticketId: string, text: string) => {
    if (!user) return;
    const isUserAdmin = user.role === 'admin';
    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: isUserAdmin ? ('admin' as const) : ('user' as const),
      senderName: user.fullName,
      text,
      createdAt: new Date().toISOString()
    };

    let updatedTicket: SupportTicket | null = null;

    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        updatedTicket = {
          ...t,
          status: isUserAdmin ? 'in_progress' : t.status,
          messages: [...t.messages, newMessage]
        };
        return updatedTicket;
      }
      return t;
    }));

    setTimeout(() => {
      const ticketToSave = supportTickets.find(t => t.id === ticketId);
      const msgs = ticketToSave ? [...ticketToSave.messages, newMessage] : [newMessage];
      supabase.from('tickets').update({
        status: isUserAdmin ? 'in_progress' : undefined,
        messages: msgs
      }).eq('id', ticketId).then();
    }, 100);
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
    supabase.from('tickets').update({ status }).eq('id', ticketId).then();
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const sendAdminNotification = (dataOrUserId: any, titleArg?: string, messageArg?: string, typeArg?: AppNotification['type']) => {
    let targetUserId: string;
    let notifTitle: string;
    let notifMessage: string;
    let notifType: AppNotification['type'];

    if (typeof dataOrUserId === 'object' && dataOrUserId !== null) {
      targetUserId = dataOrUserId.userId;
      notifTitle = dataOrUserId.title;
      notifMessage = dataOrUserId.message;
      notifType = dataOrUserId.type || 'system';
    } else {
      targetUserId = dataOrUserId;
      notifTitle = titleArg || 'Notification';
      notifMessage = messageArg || '';
      notifType = typeArg || 'system';
    }

    if (targetUserId === 'all') {
      const newNotifs: AppNotification[] = allUsers.map(u => ({
        id: `ntf_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        userId: u.id,
        title: notifTitle,
        message: notifMessage,
        type: notifType,
        read: false,
        createdAt: new Date().toISOString()
      }));
      setNotifications(prev => [...newNotifs, ...prev]);
      sendNativeNotification(notifTitle, notifMessage);

      // Persist broadcast to Supabase
      const dbRows = newNotifs.map(n => ({
        id: n.id,
        user_id: n.userId,
        title: n.title,
        message: n.message,
        type: n.type,
        read: false,
        created_at: n.createdAt
      }));
      supabase.from('notifications').insert(dbRows).then(({ error }) => {
        if (error) console.error('Error inserting broadcast notifications to Supabase:', error);
      });
    } else {
      const newNotif: AppNotification = {
        id: `ntf_${Date.now()}`,
        userId: targetUserId,
        title: notifTitle,
        message: notifMessage,
        type: notifType,
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
      sendNativeNotification(notifTitle, notifMessage);

      // Persist to Supabase
      supabase.from('notifications').insert([{
        id: newNotif.id,
        user_id: newNotif.userId,
        title: newNotif.title,
        message: newNotif.message,
        type: newNotif.type,
        read: false,
        created_at: newNotif.createdAt
      }]).then(({ error }) => {
        if (error) console.error('Error inserting notification to Supabase:', error);
      });
    }
  };

  const updatePlatformSettings = (settings: PlatformSettings) => {
    setPlatformSettings(settings);
  };

  const addTestimonial = (data: Omit<Testimonial, 'id' | 'createdAt'>) => {
    const newT: Testimonial = {
      ...data,
      id: 'tstm_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setTestimonials(prev => [newT, ...prev]);
  };

  const updateTestimonial = (id: string, data: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const getUserStats = (userId: string) => {
    const userCampaigns = campaigns.filter(c => c.userId === userId);
    const activeCampaignsCount = userCampaigns.filter(c => c.status === 'running').length;
    
    const userSpends = transactions.filter(t => t.userId === userId && t.type === 'spend');
    const totalSpent = userSpends.reduce((acc, t) => acc + t.amount, 0);

    const totalDelivered = userCampaigns.reduce((acc, c) => acc + c.visitorsDelivered, 0);
    const todayHits = Math.round(totalDelivered * 0.45);
    const yesterdayHits = Math.round(totalDelivered * 0.35);

    const targetUser = allUsers.find(u => u.id === userId);
    const currentBalance = targetUser ? targetUser.walletBalance : 0;

    return {
      todayHits,
      yesterdayHits,
      activeCampaignsCount,
      totalSpent,
      currentBalance
    };
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const merged = { ...user, ...data };
    
    // Profile is verified when name, email, country, city, postal code, and at least one contact method exist
    const hasName = Boolean(merged.fullName && merged.fullName.trim().length > 1);
    const hasEmail = Boolean(merged.email && merged.email.includes('@'));
    const hasContact = Boolean((merged.telegram && merged.telegram.trim().length > 0) || (merged.whatsApp && merged.whatsApp.trim().length > 0) || (merged.username && merged.username.trim().length > 0));
    const hasLocation = Boolean(merged.country && merged.city && merged.postalCode);

    const isVerified = hasName && hasEmail && hasContact && hasLocation;
    const updated = { ...merged, isVerified };

    setUser(updated);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updated : u));
  };

  const updateUserBalanceByAdmin = (userId: string, newBalance: number) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, walletBalance: newBalance } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, walletBalance: newBalance } : null);
    }
  };

  const toggleUserSuspension = (userId: string, isSuspended: boolean, reason?: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended, suspendedReason: reason } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, isSuspended, suspendedReason: reason } : null);
    }
  };

  const resetToInitialData = () => {
    setAllUsers(INITIAL_USERS);
    setCampaigns(INITIAL_CAMPAIGNS);
    setWalletDeposits(INITIAL_PAYMENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setSupportTickets(INITIAL_TICKETS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setTestimonials(INITIAL_TESTIMONIALS);
    setPlatformSettings(DEFAULT_SETTINGS);
    localStorage.setItem('trafficsell_users', JSON.stringify(INITIAL_USERS));
    localStorage.setItem('trafficsell_campaigns', JSON.stringify(INITIAL_CAMPAIGNS));
    localStorage.setItem('trafficsell_payments', JSON.stringify(INITIAL_PAYMENTS));
    localStorage.setItem('trafficsell_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem('trafficsell_tickets', JSON.stringify(INITIAL_TICKETS));
    localStorage.setItem('trafficsell_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem('trafficsell_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
    localStorage.setItem('trafficsell_settings', JSON.stringify(DEFAULT_SETTINGS));
  };

  return (
    <StoreContext.Provider value={{
      user, theme, toggleTheme, login, register, logout, switchUserRole,
      campaigns, addCampaign, updateCampaignStatus, deleteCampaign,
      walletDeposits, requestDeposit, approveDeposit, rejectDeposit, transactions,
      supportTickets, createTicket, createTicketForUser, addTicketMessage, updateTicketStatus,
      notifications, markNotificationRead, sendAdminNotification,
      platformSettings, updatePlatformSettings,
      testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
      updateProfile, allUsers, updateUserBalanceByAdmin, toggleUserSuspension, getUserStats, resetToInitialData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
