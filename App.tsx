import React, { useState, useEffect, useRef } from 'react';
import { Screen, AppState, UserAccount, AccountStatus, TransactionType } from './types';
import { getStoredData, saveData, createTransaction, generateAccountId } from './store';
import { Button, Input, Card, Badge } from './components/UI';
import {
  ShieldCheck,
  History,
  User,
  ChevronRight,
  Lock,
  LogOut,
  Moon,
  Sun,
  Plus,
  Minus,
  CheckCircle2,
  LayoutDashboard,
  ShieldAlert,
  Sparkles,
  CreditCard,
  Activity,
  ExternalLink,
  Settings,
  AlertCircle,
  Smartphone,
  Mail,
  Fingerprint,
  Eye,
  EyeOff,
  Play,
  Pause
} from 'lucide-react';
import { getFinancialAdvice } from './services/geminiService';

const DAILY_WITHDRAWAL_LIMIT = 5000;

// --- Sub-components ---

const Breadcrumbs: React.FC<{ items: string[], onAction?: (s: Screen) => void }> = ({ items, onAction }) => (
  <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-2">
    {items.map((item, idx) => (
      <React.Fragment key={item}>
        {idx > 0 && <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />}
        <span
          className={idx === items.length - 1 ? "text-slate-900 dark:text-white" : "hover:text-blue-600 dark:hover:text-red-500 cursor-pointer transition-colors"}
          onClick={() => idx === 0 && onAction && onAction('DASHBOARD')}
        >
          {item}
        </span>
      </React.Fragment>
    ))}
  </div>
);

// --- Screen Components ---

const SettingsScreen: React.FC<{
  user: UserAccount,
  isDarkMode: boolean,
  onToggleTheme: () => void,
  onChangePin: (current: string, next: string) => Promise<{ success: boolean, error?: string }>,
  onFreeze: () => void,
  onBack: () => void
}> = ({ user, isDarkMode, onToggleTheme, onChangePin, onFreeze, onBack }) => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [pinMessage, setPinMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handlePinChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      setPinMessage({ type: 'error', text: 'New PINs do not match.' });
      return;
    }
    if (newPin.length < 4) {
      setPinMessage({ type: 'error', text: 'PIN must be 4 digits.' });
      return;
    }

    setIsChangingPin(true);
    setPinMessage(null);

    const result = await onChangePin(currentPin, newPin);

    setIsChangingPin(false);
    if (result.success) {
      setPinMessage({ type: 'success', text: 'Security PIN updated successfully.' });
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    } else {
      setPinMessage({ type: 'error', text: result.error || 'Failed to update PIN.' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <Breadcrumbs items={['Dashboard', 'Settings']} onAction={() => onBack()} />
      <h2 className="text-2xl font-black dark:text-white tracking-tight">Account Settings</h2>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 dark:bg-red-600 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-sm">
                {user.fullName[0]}
              </div>
              <div>
                <h3 className="font-bold dark:text-white">{user.fullName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Client since {new Date(user.createdAt).getFullYear()}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Mail size={16} />
                <span className="text-xs font-medium">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Smartphone size={16} />
                <span className="text-xs font-medium">{user.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Fingerprint size={16} />
                <span className="text-xs font-medium font-mono">ID: {user.id}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Status</span>
              <Badge status={user.status} />
            </div>
          </Card>

          <Card>
            <h4 className="font-bold dark:text-white text-sm mb-4 flex items-center gap-2">
              <Activity size={16} className="text-blue-600 dark:text-red-500" />
              Appearance Preference
            </h4>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon size={16} className="text-blue-400 dark:text-red-400" /> : <Sun size={16} className="text-amber-500" />}
                <span className="text-xs font-medium dark:text-slate-200">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <button
                onClick={onToggleTheme}
                className={`w-10 h-5 rounded-full transition-all duration-300 relative ${isDarkMode ? 'bg-red-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isDarkMode ? 'translate-x-5 shadow-sm' : 'translate-x-0.5 shadow-sm'}`} />
              </button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold dark:text-white text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Lock size={18} className="text-blue-600 dark:text-red-500" />
                Security Management
              </h4>
              <button onClick={() => setShowPins(!showPins)} className="text-slate-400 hover:text-blue-600 dark:hover:text-red-500">
                {showPins ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <form onSubmit={handlePinChange} className="space-y-6">
              {pinMessage && (
                <div className={`p-4 rounded-lg text-xs font-bold flex items-center gap-3 border ${pinMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                  }`}>
                  {pinMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {pinMessage.text}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Current Security PIN"
                  type={showPins ? "text" : "password"}
                  maxLength={4}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                />
                <div className="hidden md:block"></div>
                <Input
                  label="New Security PIN"
                  type={showPins ? "text" : "password"}
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                />
                <Input
                  label="Confirm New PIN"
                  type={showPins ? "text" : "password"}
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" loading={isChangingPin} disabled={!currentPin || !newPin || !confirmPin}>Update PIN</Button>
              </div>
            </form>
          </Card>

          <Card className="p-8 border-rose-100 dark:border-rose-900/30">
            <h4 className="font-bold text-rose-600 text-lg mb-6 flex items-center gap-2">
              <ShieldAlert size={18} />
              Danger Zone
            </h4>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/20">
              <div className="space-y-1">
                <h5 className="font-bold text-rose-900 dark:text-rose-300">Freeze Account</h5>
                <p className="text-[11px] text-rose-800 dark:text-rose-400 leading-relaxed max-w-sm">
                  Temporarily disable all access. You will be logged out immediately.
                </p>
              </div>
              <Button variant="danger" onClick={() => window.confirm('Freeze account now?') && onFreeze()}>
                Freeze Access
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Navbar: React.FC<{ onAuth: (s: Screen) => void, isPlaying: boolean, onToggleMusic: () => void }> = ({ onAuth, isPlaying, onToggleMusic }) => (
  <nav className="fixed top-0 w-full z-50 glass px-6 py-4 flex justify-between items-center transition-all">
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-10 bg-blue-600 dark:bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 dark:shadow-red-600/20">
        <ShieldCheck size={22} />
      </div>
      <span className="text-[19px] font-black tracking-tight dark:text-white">Arafath<span className="text-blue-600 dark:text-red-600"> Assignment</span></span>
    </div>
    <div className="flex items-center gap-4">
      <button
        onClick={onToggleMusic}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
        title={isPlaying ? "Pause Music" : "Play Music"}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <Button variant="ghost" className="hidden sm:flex" onClick={() => onAuth('LOGIN')}>Sign In</Button>
      <Button onClick={() => onAuth('REGISTER')}>Open Account</Button>
    </div>
  </nav>
);

const LandingPage: React.FC<{ onStart: (s: Screen) => void }> = ({ onStart }) => (
  <div className="min-h-screen pt-24 bg-white dark:bg-slate-950 transition-colors duration-500">
    <section className="px-6 py-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
      <div className="space-y-10 animate-in slide-in-from-left duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-red-900/20 text-blue-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider border border-blue-100 dark:border-red-800">
          <Sparkles size={14} /> New Era of Banking
        </div>
        <h1 className="text-6xl lg:text-7xl font-black leading-tight dark:text-white tracking-tighter">
          Secure. Fast. <br />
          <span className="text-blue-600 dark:text-red-600">Enterprise Ready.</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
          The ultimate platform for modern asset management. Engineered for reliability and high-speed financial operations.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <Button onClick={() => onStart('REGISTER')} className="px-10 py-4 text-base">Get Started</Button>
          <Button variant="secondary" onClick={() => onStart('LOGIN')} className="px-10 py-4 text-base">Client Login</Button>
        </div>
      </div>
      <div className="relative animate-in slide-in-from-right duration-1000">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-blue-600/10 dark:bg-red-500/5 rounded-full blur-[100px]"></div>
        <div className="relative z-10 glass p-3 rounded-[32px] shadow-2xl border border-white/10">
          <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop"
            className="rounded-[24px] w-full object-cover aspect-[4/3] grayscale-[0.3] dark:grayscale-[0.6]"
            alt="Enterprise Dashboard" />
        </div>
      </div>
    </section>
  </div>
);

const Sidebar: React.FC<{ current: Screen, onNav: (s: Screen) => void, user: UserAccount, onLogout: () => void, isPlaying: boolean, onToggleMusic: () => void }> = ({ current, onNav, user, onLogout, isPlaying, onToggleMusic }) => {
  const menuItems = [
    { id: 'DASHBOARD', icon: <LayoutDashboard size={19} />, label: 'Overview' },
    { id: 'HISTORY', icon: <History size={19} />, label: 'Transactions' },
    { id: 'DEPOSIT', icon: <Plus size={19} />, label: 'Deposit' },
    { id: 'WITHDRAW', icon: <Minus size={19} />, label: 'Withdraw' },
    { id: 'PROFILE', icon: <Settings size={19} />, label: 'Settings' },
  ];

  return (
    <aside className="w-64 hidden lg:flex flex-col h-screen fixed left-0 top-0 glass border-r border-slate-200/50 dark:border-slate-800/50 p-6 z-40">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 bg-blue-600 dark:bg-red-600 rounded-lg flex items-center justify-center text-white">
          <ShieldCheck size={18} />
        </div>
        <span className="text-[17px] font-black tracking-tight dark:text-white">Arafath<span className="text-blue-600 dark:text-red-600"> Assignment</span></span>
      </div>

      <div className="flex-1 space-y-1.5">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNav(item.id as Screen)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${current === item.id ? 'bg-blue-600 dark:bg-red-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <button
          onClick={onToggleMusic}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          {isPlaying ? "Pause Music" : "Play Music"}
        </button>
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-600 text-xs">
            {user.fullName[0]}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[13px] font-bold dark:text-white truncate">{user.fullName}</p>
            <p className="text-[11px] text-slate-500 truncate">ID: {user.id}</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

const WebDashboard: React.FC<{ user: UserAccount, advice: string, onAction: (s: Screen) => void }> = ({ user, advice, onAction }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
      <div>
        <h2 className="text-3xl font-black tracking-tight dark:text-white">Dashboard</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, {user.fullName.split(' ')[0]}.</p>
      </div>
      <div className="flex gap-4">
        <Button
          variant="primary"
          className="px-8 py-3 text-base shadow-lg shadow-blue-600/20 dark:shadow-red-600/20"
          onClick={() => onAction('DEPOSIT')}
        >
          <Plus size={20} /> Deposit
        </Button>
        <Button
          variant="secondary"
          className="px-8 py-3 text-base border-slate-300 dark:border-slate-700"
          onClick={() => onAction('WITHDRAW')}
        >
          <Minus size={20} /> Withdraw
        </Button>
      </div>
    </div>

    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 dark:from-red-900 dark:via-red-950 dark:to-slate-950 text-white border-none p-10 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:scale-110 transition-transform">
          <CreditCard size={280} />
        </div>
        <div className="relative z-10 flex flex-col h-full justify-between gap-16">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-blue-100/70 dark:text-red-100/70 text-xs font-bold uppercase tracking-[0.1em]">Available Liquidity</p>
              <h3 className="text-6xl font-black tabular-nums tracking-tighter transition-all duration-300 transform group-hover:translate-x-1">${user.balance.toLocaleString()}</h3>
            </div>
            <Badge status={user.status} />
          </div>
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-200/60 dark:text-red-200/60">Account Identity</p>
              <p className="font-mono text-xl tracking-[0.3em] font-medium">{user.id.match(/.{1,4}/g)?.join(' ')}</p>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-8 bg-yellow-400/95 rounded shadow-sm"></div>
              <div className="w-12 h-8 bg-white/20 rounded backdrop-blur-md border border-white/10 shadow-inner"></div>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="p-8 flex flex-col justify-center h-full">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200">System Monitoring</h4>
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute opacity-75"></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full relative"></div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex items-center gap-4 text-[13px] text-slate-600 dark:text-slate-400">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={18} />
              </div>
              <span className="font-medium">Military Grade Encryption Active</span>
            </div>
            <div className="flex items-center gap-4 text-[13px] text-slate-600 dark:text-slate-400">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-red-950 flex items-center justify-center text-blue-600 dark:text-red-500">
                <Activity size={18} />
              </div>
              <span className="font-medium">Real-time Fraud Audit Engaged</span>
            </div>
            <div className="flex items-center gap-4 text-[13px] text-slate-600 dark:text-slate-400">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                <ExternalLink size={18} />
              </div>
              <span className="font-medium">Cross-border Settlement Ready</span>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <Card className="p-0 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
        <h4 className="font-bold text-sm text-slate-800 dark:text-white">Transaction Ledger</h4>
        <Button variant="ghost" size="sm" className="text-xs font-bold" onClick={() => onAction('HISTORY')}>Request Full Statement</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-8 py-5">Trace Reference</th>
              <th className="px-8 py-5">Descriptor</th>
              <th className="px-8 py-5">Effective Date</th>
              <th className="px-8 py-5">Amount (USD)</th>
              <th className="px-8 py-5">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {user.transactions.slice(0, 5).map(tx => (
              <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                <td className="px-8 py-5 font-mono text-[11px] text-slate-400 group-hover:text-slate-600 transition-colors">{tx.id}</td>
                <td className="px-8 py-5 font-bold text-[13px] text-slate-800 dark:text-white">{tx.description}</td>
                <td className="px-8 py-5 text-[12px] text-slate-500 dark:text-slate-400">{new Date(tx.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                <td className={`px-8 py-5 font-bold text-sm ${tx.type === TransactionType.DEPOSIT ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                  {tx.type === TransactionType.DEPOSIT ? '+' : '-'}${tx.amount.toLocaleString()}
                </td>
                <td className="px-8 py-5"><Badge status={tx.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {user.transactions.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-slate-400 text-sm">No recent settlement activity detected.</p>
        </div>
      )}
    </Card>
  </div>
);

// --- App Entry Point ---

export default function App() {
  const [appState, setAppState] = useState<AppState>(getStoredData());
  const [screen, setScreen] = useState<Screen>('SPLASH');
  const [authError, setAuthError] = useState('');
  const [advice, setAdvice] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio: First click listener logic
  useEffect(() => {
    const handleFirstClick = () => {
      if (audioRef.current && !audioStarted) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAudioStarted(true);
          })
          .catch(e => console.log("Interaction play failed", e));
      }
    };

    if (!audioStarted) {
      window.addEventListener('click', handleFirstClick);
    }

    return () => {
      window.removeEventListener('click', handleFirstClick);
    };
  }, [audioStarted]);

  // Audio: Toggle logic
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        setIsPlaying(true);
        setAudioStarted(true);
      }
    }
  };

  useEffect(() => { saveData(appState); }, [appState]);

  useEffect(() => {
    if (appState.isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [appState.isDarkMode]);

  useEffect(() => {
    if (screen === 'DASHBOARD' && appState.currentUser) {
      getFinancialAdvice(appState.currentUser.transactions, appState.currentUser.balance).then(setAdvice);
    }
  }, [screen, appState.currentUser]);

  const handleLogin = async (id: string, pin: string) => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1000));

    const account = appState.allAccounts.find(acc => acc.id === id);
    if (!account) {
      setAuthError('Identity verification failed: ID not found');
      setIsProcessing(false);
      return;
    }
    if (account.status === AccountStatus.LOCKED) {
      setAuthError('Security Protocol: Account locked after multiple failed attempts.');
      setIsProcessing(false);
      return;
    }
    if (account.status === AccountStatus.FROZEN) {
      setAuthError('Account is currently restricted. Please contact support.');
      setIsProcessing(false);
      return;
    }
    if (account.pin !== pin) {
      const updatedAccounts = appState.allAccounts.map(acc => {
        if (acc.id === id) {
          const attempts = acc.failedLoginAttempts + 1;
          return { ...acc, failedLoginAttempts: attempts, status: attempts >= 3 ? AccountStatus.LOCKED : acc.status };
        }
        return acc;
      });
      setAppState({ ...appState, allAccounts: updatedAccounts });
      setAuthError(`Invalid credential combination. Authorization denied.`);
      setIsProcessing(false);
      return;
    }

    setAppState({ ...appState, currentUser: account, isLoggedIn: true });
    setScreen('DASHBOARD');
    setAuthError('');
    setIsProcessing(false);
  };

  const handleRegister = (data: any) => {
    const newAccount: UserAccount = {
      id: generateAccountId(),
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      pin: data.pin,
      balance: 1000,
      status: AccountStatus.ACTIVE,
      transactions: [createTransaction(TransactionType.DEPOSIT, 1000, 'Tier 1 Enrollment Bonus')],
      securityLogs: [],
      role: 'USER',
      createdAt: new Date().toISOString(),
      failedLoginAttempts: 0
    };

    setAppState({
      ...appState,
      allAccounts: [...appState.allAccounts, newAccount],
      currentUser: newAccount,
      isLoggedIn: true
    });
    setScreen('DASHBOARD');
  };

  const processDeposit = async (amt: number, note?: string) => {
    if (!appState.currentUser || amt <= 0) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500));

    const newTx = createTransaction(TransactionType.DEPOSIT, amt, note || 'Inbound Clearing');
    const updatedUser = {
      ...appState.currentUser,
      balance: appState.currentUser.balance + amt,
      transactions: [newTx, ...appState.currentUser.transactions]
    };
    const updatedAll = appState.allAccounts.map(acc => acc.id === updatedUser.id ? updatedUser : acc);
    setAppState({ ...appState, currentUser: updatedUser, allAccounts: updatedAll });
    setIsProcessing(false);
    setScreen('DASHBOARD');
  };

  const handleWithdrawal = async (amount: number, pin: string) => {
    if (!appState.currentUser) return { success: false, error: 'Authorization required.' };
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000));

    if (appState.currentUser.pin !== pin) {
      setIsProcessing(false);
      return { success: false, error: 'Identity verification failed.' };
    }

    if (amount > appState.currentUser.balance) {
      setIsProcessing(false);
      return { success: false, error: 'Insufficient funds for requested operation.' };
    }

    const today = new Date().toISOString().split('T')[0];
    const todayTotal = appState.currentUser.transactions
      .filter(tx => tx.type === TransactionType.WITHDRAWAL && tx.date.startsWith(today))
      .reduce((sum, tx) => sum + tx.amount, 0);

    if (todayTotal + amount > DAILY_WITHDRAWAL_LIMIT) {
      setIsProcessing(false);
      return { success: false, error: 'Daily liquidity limit exceeded.' };
    }

    const newTx = createTransaction(TransactionType.WITHDRAWAL, amount, 'ATM/Pos Disbursement');
    const updatedUser = {
      ...appState.currentUser,
      balance: appState.currentUser.balance - amount,
      transactions: [newTx, ...appState.currentUser.transactions]
    };
    const updatedAll = appState.allAccounts.map(acc => acc.id === updatedUser.id ? updatedUser : acc);

    setAppState({ ...appState, currentUser: updatedUser, allAccounts: updatedAll });
    setIsProcessing(false);
    return { success: true, txnId: newTx.id };
  };

  const handlePinUpdate = async (current: string, next: string) => {
    if (!appState.currentUser) return { success: false, error: 'Session expired.' };
    await new Promise(r => setTimeout(r, 1500));
    if (appState.currentUser.pin !== current) return { success: false, error: 'Authentication failed.' };
    const updatedUser = { ...appState.currentUser, pin: next };
    const updatedAll = appState.allAccounts.map(acc => acc.id === updatedUser.id ? updatedUser : acc);
    setAppState({ ...appState, currentUser: updatedUser, allAccounts: updatedAll });
    return { success: true };
  };

  const renderContent = () => {
    switch (screen) {
      case 'SPLASH': return <div className="fixed inset-0 bg-blue-600 dark:bg-slate-950 flex items-center justify-center z-[100]"><ShieldCheck size={80} className="text-white dark:text-red-500 animate-pulse" /><script>{setTimeout(() => setScreen(appState.isLoggedIn ? 'DASHBOARD' : 'ONBOARDING'), 1500)}</script></div>;
      case 'ONBOARDING': return <LandingPage onStart={setScreen} />;
      case 'LOGIN': return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
          <Card className="max-w-md w-full p-10 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black dark:text-white">Secure Access</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Authorized personnel only.</p>
            </div>
            {authError && <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-[11px] font-bold text-center">{authError}</div>}
            <div className="space-y-4">
              <Input label="Account Number" placeholder="1000XXXXXX" id="login-id" />
              <Input label="Security PIN" type="password" maxLength={4} id="login-pin" />
            </div>
            <Button fullWidth loading={isProcessing} onClick={() => {
              const id = (document.getElementById('login-id') as HTMLInputElement).value;
              const pin = (document.getElementById('login-pin') as HTMLInputElement).value;
              handleLogin(id, pin);
            }}>Verify Identity</Button>
            <p className="text-center text-xs text-slate-500">New client? <button onClick={() => setScreen('REGISTER')} className="text-blue-600 dark:text-red-500 font-bold hover:underline">Request Account</button></p>
          </Card>
        </div>
      );
      case 'REGISTER': return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
          <Card className="max-w-md w-full p-10 space-y-8">
            <h2 className="text-2xl font-black text-center dark:text-white">Account Request</h2>
            <div className="space-y-4">
              <Input label="Legal Full Name" id="reg-name" />
              <Input label="Corporate Email" type="email" id="reg-email" />
              <Input label="Mobile Verification" id="reg-phone" />
              <Input label="Access PIN" type="password" maxLength={4} id="reg-pin" hint="Exactly 4 digits" />
            </div>
            <Button fullWidth onClick={() => handleRegister({
              fullName: (document.getElementById('reg-name') as HTMLInputElement).value,
              email: (document.getElementById('reg-email') as HTMLInputElement).value,
              phoneNumber: (document.getElementById('reg-phone') as HTMLInputElement).value,
              pin: (document.getElementById('reg-pin') as HTMLInputElement).value
            })}>Enroll for Banking</Button>
            <p className="text-center text-xs text-slate-500">Existing client? <button onClick={() => setScreen('LOGIN')} className="text-blue-600 dark:text-red-500 font-bold hover:underline">Authorize Here</button></p>
          </Card>
        </div>
      );
      case 'DASHBOARD': return appState.currentUser ? <WebDashboard user={appState.currentUser} advice={advice} onAction={setScreen} /> : null;
      case 'DEPOSIT': return appState.currentUser ? (
        <div className="min-h-[80vh] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-lg w-full mx-auto space-y-6">
            <Breadcrumbs items={['Dashboard', 'Deposit']} onAction={setScreen} />
            <Card className="p-10 space-y-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-black dark:text-white">Funds Deposit</h2>
                <p className="text-xs text-slate-500">Electronic clearing system.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Balance</span>
                <span className="text-lg font-black dark:text-white tabular-nums">${appState.currentUser.balance.toLocaleString()}</span>
              </div>

              <div className="space-y-6">
                <Input label="Amount (USD)" type="number" id="deposit-amt" placeholder="0.00" hint="Maximum $100,000 per transfer" />
                <Input label="Settlement Note (Optional)" id="deposit-note" placeholder="e.g. Monthly Savings" />
                <Button fullWidth loading={isProcessing} onClick={() => {
                  const amt = parseFloat((document.getElementById('deposit-amt') as HTMLInputElement).value);
                  const note = (document.getElementById('deposit-note') as HTMLInputElement).value;
                  if (amt > 0) processDeposit(amt, note);
                }}>Authorize Settlement</Button>
              </div>
            </Card>
          </div>
        </div>
      ) : null;
      case 'WITHDRAW': return appState.currentUser ? (
        <div className="min-h-[80vh] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-lg w-full mx-auto space-y-6">
            <Breadcrumbs items={['Dashboard', 'Withdraw']} onAction={setScreen} />
            <Card className="p-10 space-y-8">
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-2xl font-black dark:text-white text-center sm:text-left">Funds Withdrawal</h2>
                <p className="text-xs text-slate-500 text-center sm:text-left">Verified disbursement only.</p>
              </div>
              <div className="space-y-6">
                <Input label="Withdrawal Amount (USD)" type="number" id="withdraw-amt" placeholder="0.00" />
                <Input label="Security PIN Authorization" type="password" id="withdraw-pin" maxLength={4} />
                <Button fullWidth loading={isProcessing} onClick={async () => {
                  const amt = parseFloat((document.getElementById('withdraw-amt') as HTMLInputElement).value);
                  const pin = (document.getElementById('withdraw-pin') as HTMLInputElement).value;
                  const res = await handleWithdrawal(amt, pin);
                  if (res.success) setScreen('DASHBOARD');
                  else alert(res.error);
                }}>Confirm Disbursement</Button>
              </div>
            </Card>
          </div>
        </div>
      ) : null;
      case 'PROFILE': return appState.currentUser ? (
        <SettingsScreen
          user={appState.currentUser}
          isDarkMode={appState.isDarkMode}
          onToggleTheme={() => setAppState({ ...appState, isDarkMode: !appState.isDarkMode })}
          onChangePin={handlePinUpdate}
          onFreeze={() => {
            const updatedUser = { ...appState.currentUser!, status: AccountStatus.FROZEN };
            const updatedAll = appState.allAccounts.map(acc => acc.id === updatedUser.id ? updatedUser : acc);
            setAppState({ ...appState, currentUser: null, allAccounts: updatedAll, isLoggedIn: false });
            setScreen('LOGIN');
            setAuthError('Security restriction: Account frozen by owner.');
          }}
          onBack={() => setScreen('DASHBOARD')}
        />
      ) : null;
      case 'HISTORY': return appState.currentUser ? (
        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
          <Breadcrumbs items={['Dashboard', 'History']} onAction={setScreen} />
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black dark:text-white">Transaction Statement</h2>
          </div>
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 font-bold text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-6">Trace ID</th>
                    <th className="p-6">Description</th>
                    <th className="p-6">Type</th>
                    <th className="p-6">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {appState.currentUser.transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-6 font-mono text-xs text-slate-400 dark:text-slate-500">{tx.id}</td>
                      <td className="p-6 text-sm font-bold dark:text-white">{tx.description}</td>
                      <td className="p-6"><Badge status={tx.type} /></td>
                      <td className={`p-6 font-bold text-sm ${tx.type === TransactionType.DEPOSIT ? 'text-emerald-600' : 'dark:text-white'}`}>
                        {tx.type === TransactionType.DEPOSIT ? '+' : '-'}${tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : null;
      default: return <div className="p-12 text-center text-slate-500">Module under construction... <Button onClick={() => setScreen('DASHBOARD')}>Return</Button></div>;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${appState.isDarkMode ? 'dark' : ''}`}>
      {['ONBOARDING', 'LOGIN', 'REGISTER', 'SPLASH'].includes(screen) ? (
        <div className="dark:bg-slate-950 min-h-screen transition-colors duration-500">
          {screen === 'ONBOARDING' && <Navbar onAuth={setScreen} isPlaying={isPlaying} onToggleMusic={toggleMusic} />}
          {renderContent()}
        </div>
      ) : (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-500">
          <Sidebar current={screen} onNav={setScreen} user={appState.currentUser!} onLogout={() => { setAppState({ ...appState, isLoggedIn: false, currentUser: null }); setScreen('ONBOARDING'); }} isPlaying={isPlaying} onToggleMusic={toggleMusic} />
          <main className="flex-1 lg:ml-64 p-6 md:p-10 lg:p-12">
            <header className="flex lg:hidden items-center justify-between mb-8">
              <span className="text-[17px] font-black tracking-tight dark:text-white">Arafath<span className="text-blue-600 dark:text-red-600"> Assignment</span></span>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMusic}
                  className="p-2 dark:text-white mr-2"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button className="p-2 dark:text-white" onClick={() => setScreen('PROFILE')}><User size={22} /></button>
              </div>
            </header>
            <div className="max-w-5xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      )}
      <audio ref={audioRef} src="/Background.mp3" loop />
    </div>
  );
}
