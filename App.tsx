
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Leaf, CheckCircle2, Heart, BookOpen, Trash2,
  Brain, Loader2, Play, Pause, Sparkles, StickyNote, 
  Volume2, VolumeX, CloudRain, Waves, Bird, BarChart2, 
  Coffee, Sun, Cloud, Wind, Zap, Droplets, Smile, Clock, RotateCcw
} from 'lucide-react';
import { Thought, ThoughtCategory, MoodType } from './types';
import { classifyThought } from './geminiService';
import TreeVisualization from './components/TreeVisualization';

const AMBIENT_SOUNDS = [
  { id: 'forest', icon: Bird, url: '#' },
  { id: 'rain', icon: CloudRain, url: '#' },
  { id: 'waves', icon: Waves, url: '#' }
];

const MOODS: { id: MoodType; icon: any; color: string; label: string }[] = [
  { id: 'sunny', icon: Sun, color: 'text-orange-400 bg-orange-50', label: '晴朗' },
  { id: 'cloudy', icon: Cloud, color: 'text-slate-400 bg-slate-50', label: '阴郁' },
  { id: 'rainy', icon: Droplets, color: 'text-blue-400 bg-blue-50', label: '小雨' },
  { id: 'windy', icon: Wind, color: 'text-emerald-400 bg-emerald-50', label: '起风' },
  { id: 'stormy', icon: Zap, color: 'text-purple-400 bg-purple-50', label: '雷暴' },
  { id: 'misty', icon: CloudRain, color: 'text-slate-300 bg-slate-50', label: '晨雾' },
];

const TEST_SEEDS = [
  { text: "总是想起面试搞砸的表现", mood: 'stormy' as MoodType, label: "疗愈测试" },
  { text: "下周三写完伦理报告初稿", mood: 'windy' as MoodType, label: "待办测试" },
  { text: "设计一栋会随季节变形的建筑", mood: 'sunny' as MoodType, label: "灵感测试" }
];

const App: React.FC = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'healing' | 'mood' | 'todo' | 'tree' | 'other' | 'stats'>('all');
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [totalFocusTime, setTotalFocusTime] = useState(0); // in seconds
  const timerRef = useRef<number | null>(null);
  
  const [isMuted, setIsMuted] = useState(true);
  const [currentSound, setCurrentSound] = useState(AMBIENT_SOUNDS[0].id);

  useEffect(() => {
    const saved = localStorage.getItem('mindglow_v3_data');
    if (saved) setThoughts(JSON.parse(saved));
    
    const savedTime = localStorage.getItem('mindglow_total_focus');
    if (savedTime) setTotalFocusTime(parseInt(savedTime));
  }, []);

  useEffect(() => {
    localStorage.setItem('mindglow_v3_data', JSON.stringify(thoughts));
  }, [thoughts]);

  useEffect(() => {
    localStorage.setItem('mindglow_total_focus', totalFocusTime.toString());
  }, [totalFocusTime]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setTotalFocusTime(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-simple-notification-well-done-941.mp3');
      audio.play().catch(() => {});
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  // 简单的降级分类函数（当 API key 不可用时使用）
  const getFallbackCategory = (text: string): ThoughtCategory => {
    const lowerText = text.toLowerCase();
    // 简单的关键词匹配
    if (lowerText.includes('想起') || lowerText.includes('后悔') || lowerText.includes('担心') || lowerText.includes('害怕')) {
      return ThoughtCategory.TRAUMA;
    }
    if (lowerText.includes('完成') || lowerText.includes('写') || lowerText.includes('做') || lowerText.includes('准备') || lowerText.includes('计划')) {
      return ThoughtCategory.TODO;
    }
    if (lowerText.includes('设计') || lowerText.includes('创意') || lowerText.includes('想法') || lowerText.includes('灵感')) {
      return ThoughtCategory.CREATIVE;
    }
    return ThoughtCategory.OTHER;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    setIsProcessing(true);
    const text = inputValue;
    const mood = selectedMood;
    setInputValue('');
    setSelectedMood(undefined);

    try {
      const result = await classifyThought(text);
      const newThought: Thought = {
        id: crypto.randomUUID(),
        content: text,
        timestamp: Date.now(),
        category: result.category as ThoughtCategory,
        aiAdvice: result.advice,
        books: result.books,
        tags: result.tags,
        sentiment: result.sentiment,
        mood: mood,
        isCompleted: false,
      };
      setThoughts(prev => [newThought, ...prev]);
    } catch (err: any) {
      console.error(err);
      // 如果 API key 无效或未设置，使用简单的本地分类
      const isApiKeyError = err?.error?.code === 400 || 
                           err?.message?.includes('API key') || 
                           err?.message?.includes('not configured');
      
      if (isApiKeyError) {
        // 使用简单的关键词匹配作为降级方案
        const fallbackCategory = getFallbackCategory(text);
        const newThought: Thought = {
          id: crypto.randomUUID(),
          content: text,
          timestamp: Date.now(),
          category: fallbackCategory,
          mood: mood,
          isCompleted: false,
        };
        setThoughts(prev => [newThought, ...prev]);
        
        // 只在第一次显示提示
        if (!localStorage.getItem('api_key_warning_shown')) {
          alert('⚠️ API Key 未设置或无效\n\n' +
                '请编辑 .env.local 文件，将 GEMINI_API_KEY 设置为你的真实 API Key\n\n' +
                '获取 API Key: https://aistudio.google.com/app/apikey\n\n' +
                '应用将使用简单分类继续工作');
          localStorage.setItem('api_key_warning_shown', 'true');
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteThought = (id: string) => setThoughts(prev => prev.filter(t => t.id !== id));
  const toggleTask = (id: string) => setThoughts(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));

  const stats = useMemo(() => {
    return {
      healing: thoughts.filter(t => t.category === ThoughtCategory.TRAUMA).length,
      todo: thoughts.filter(t => t.category === ThoughtCategory.TODO).length,
      creative: thoughts.filter(t => t.category === ThoughtCategory.CREATIVE).length,
      other: thoughts.filter(t => t.category === ThoughtCategory.OTHER).length,
      moods: thoughts.filter(t => t.mood).length
    };
  }, [thoughts]);

  return (
    <div className="min-h-screen text-slate-700 pb-40 relative">
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-100/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-50/40 rounded-full blur-[100px]"></div>
      </div>

      <header className="fixed top-0 w-full z-50 glass border-b border-white/50 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Sparkles size={20} />
          </div>
          <h1 className="serif font-bold text-2xl tracking-tighter text-emerald-950">MindGlow</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 bg-slate-100/40 p-1 rounded-full border border-white px-4">
            {AMBIENT_SOUNDS.map(s => (
              <button key={s.id} onClick={() => { setCurrentSound(s.id); setIsMuted(false); }} className={`p-1.5 rounded-full transition-all ${currentSound === s.id && !isMuted ? 'bg-white shadow-sm text-emerald-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
                <s.icon size={16} />
              </button>
            ))}
            <div className="w-px h-4 bg-slate-200 mx-1"></div>
            <button onClick={() => setIsMuted(!isMuted)} className="text-slate-500 hover:text-emerald-600 transition-colors">{isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">专注时刻</span>
                <span className="text-xs font-black text-emerald-700">{formatDuration(totalFocusTime)}</span>
             </div>
             <div className="flex items-center gap-2 bg-white/80 p-1 pr-1.5 rounded-full border border-emerald-50 shadow-sm transition-all hover:shadow-md">
                <div className="pl-4 flex items-center gap-2 font-mono text-xl font-black text-emerald-800 tracking-widest min-w-[100px]">
                  <Clock size={16} className={isActive ? "animate-pulse text-emerald-500" : "text-slate-300"} />
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setIsActive(!isActive)} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-100 shadow-lg' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100 shadow-lg'}`}>
                    {isActive ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>
                  <button onClick={resetTimer} className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 flex items-center justify-center transition-all">
                    <RotateCcw size={16} />
                  </button>
                </div>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-36">
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="serif text-4xl text-emerald-950 mb-3">安放此刻的波动</h2>
            <p className="text-slate-400 text-base tracking-wide">让干扰你的念头转化为宁静的动力。</p>
          </div>
          
          <form onSubmit={handleSubmit} className="relative group max-w-2xl mx-auto">
            <div className="bg-white/90 p-8 rounded-[3rem] border border-emerald-50 shadow-2xl shadow-emerald-900/5 focus-within:ring-8 focus-within:ring-emerald-50 transition-all duration-500">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="这一刻，脑海里跳出了什么？"
                className="w-full min-h-[120px] text-xl bg-transparent border-none focus:outline-none resize-none serif italic placeholder:text-slate-200"
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              />
              
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mr-2">选择心晴:</span>
                  <div className="flex gap-2">
                    {MOODS.map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMood(m.id === selectedMood ? undefined : m.id)}
                        title={m.label}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${selectedMood === m.id ? `${m.color} ring-2 ring-offset-2 ring-emerald-100 scale-110` : 'text-slate-300 hover:bg-slate-50 hover:scale-110'}`}
                      >
                        <m.icon size={18} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  disabled={isProcessing || !inputValue.trim()}
                  type="submit"
                  className={`px-8 py-3.5 rounded-2xl flex items-center gap-2 font-bold transition-all ${isProcessing || !inputValue.trim() ? 'bg-slate-100 text-slate-300' : 'bg-emerald-900 text-white hover:scale-105 shadow-xl hover:shadow-emerald-900/20'}`}
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                  <span>{isProcessing ? '分类中...' : '释放'}</span>
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8 flex justify-center items-center gap-4 animate-float-up" style={{animationDelay: '0.2s'}}>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">试试快速输入:</span>
            <div className="flex gap-2">
              {TEST_SEEDS.map((seed, i) => (
                <button
                  key={i}
                  onClick={() => { setInputValue(seed.text); setSelectedMood(seed.mood); }}
                  className="px-3 py-1.5 bg-white/50 hover:bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-lg transition-all border border-emerald-50 hover:border-emerald-100 hover:-translate-y-0.5"
                >
                  {seed.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <nav className="flex justify-center gap-1.5 mb-16 px-4">
          {[
            { id: 'all', label: '全部', icon: Brain },
            { id: 'healing', label: '愈心', icon: Heart },
            { id: 'mood', label: '心晴', icon: Smile },
            { id: 'todo', label: '待办', icon: CheckCircle2 },
            { id: 'tree', label: '灵感', icon: Leaf },
            { id: 'other', label: '碎影', icon: StickyNote },
            { id: 'stats', label: '洞察', icon: BarChart2 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-sm font-bold ${activeTab === tab.id ? 'bg-emerald-900 text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
            >
              <tab.icon size={16} />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="space-y-12 min-h-[500px]">
          {activeTab === 'tree' && <TreeVisualization thoughts={thoughts.filter(t => t.category === ThoughtCategory.CREATIVE)} />}

          {activeTab === 'mood' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-float-up">
                {thoughts.filter(t => t.mood).map(t => (
                  <div key={t.id} className="bg-white p-8 rounded-[2.5rem] border border-emerald-50 shadow-sm flex items-start gap-6 hover:shadow-md transition-all duration-500">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform hover:scale-110 ${MOODS.find(m => m.id === t.mood)?.color || 'bg-slate-50'}`}>
                      {(() => {
                        const Icon = MOODS.find(m => m.id === t.mood)?.icon || Smile;
                        return <Icon size={28} />;
                      })()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{new Date(t.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest">{MOODS.find(m => m.id === t.mood)?.label}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">“{t.content}”</p>
                    </div>
                  </div>
                ))}
             </div>
          )}

          {activeTab === 'healing' && thoughts.filter(t => t.category === ThoughtCategory.TRAUMA).map(t => (
              <div key={t.id} className="bg-white p-10 rounded-[3rem] border border-rose-50 shadow-sm animate-float-up hover:shadow-md transition-all duration-700">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <span className="bg-rose-50 text-rose-500 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-rose-100/50">Healing Note</span>
                    {t.mood && <span className="bg-slate-50 text-slate-400 p-1.5 rounded-full"><Smile size={12}/></span>}
                  </div>
                  <button onClick={() => deleteThought(t.id)} className="text-slate-200 hover:text-rose-400 transition-colors p-2"><Trash2 size={20} /></button>
                </div>
                <p className="serif text-2xl text-slate-800 italic mb-10 leading-relaxed">“{t.content}”</p>
                {t.aiAdvice && (
                  <div className="bg-rose-50/20 p-8 rounded-[2rem] mb-10 border border-rose-100/30">
                    <p className="text-slate-600 leading-relaxed italic">{t.aiAdvice}</p>
                  </div>
                )}
                {t.books && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {t.books.map((b, i) => (
                      <div key={i} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-rose-50 shadow-sm hover:border-rose-200 transition-all group">
                        <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-300 group-hover:bg-rose-100 group-hover:text-rose-500 transition-all"><BookOpen size={20} /></div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">《{b.title}》</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{b.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
          ))}

          {(activeTab === 'all' || activeTab === 'todo') && (
              <div className="space-y-4 animate-float-up">
                {thoughts.filter(t => t.category === ThoughtCategory.TODO).map(t => (
                  <div 
                    key={t.id} 
                    className={`flex items-center gap-5 p-6 bg-white group hover:bg-slate-50/80 transition-all duration-500 rounded-[2.5rem] border ${t.isCompleted ? 'border-transparent opacity-60 scale-[0.98]' : 'border-emerald-50/50 hover:border-emerald-100 shadow-sm hover:shadow-xl hover:-translate-y-1'}`}
                  >
                    <button 
                      onClick={() => toggleTask(t.id)} 
                      className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition-all duration-700 transform ${t.isCompleted ? 'bg-emerald-600 border-emerald-600 text-white scale-90 rotate-[360deg] shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-slate-200 hover:border-emerald-400 hover:scale-110 active:scale-95'}`}
                    >
                      {t.isCompleted && <CheckCircle2 size={24} className="animate-in zoom-in-50 duration-500" />}
                    </button>
                    <div className="flex-1 flex flex-col">
                      <p className={`text-lg transition-all duration-500 ${t.isCompleted ? 'line-through text-slate-400 italic decoration-emerald-500/50' : 'text-slate-800 font-semibold'}`}>
                        {t.content}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{new Date(t.timestamp).toLocaleDateString()}</span>
                        {t.mood && <span className="text-emerald-800/20"><Smile size={10} /></span>}
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteThought(t.id)} 
                      className="p-3 text-slate-200 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-125"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                {thoughts.filter(t => t.category === ThoughtCategory.TODO).length === 0 && (
                   <div className="text-center py-24 bg-slate-50/30 rounded-[3rem] border border-dashed border-slate-200">
                      <p className="text-slate-300 serif italic text-xl">暂无待办，尽情专注</p>
                   </div>
                )}
              </div>
          )}

          {activeTab === 'other' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-float-up">
                {thoughts.filter(t => t.category === ThoughtCategory.OTHER).map(t => (
                  <div key={t.id} className="bg-white/60 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group hover:shadow-md transition-all duration-500">
                    <button onClick={() => deleteThought(t.id)} className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-400 transition-all"><Trash2 size={16}/></button>
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">{new Date(t.timestamp).toLocaleDateString()}</div>
                    <p className="text-slate-600 italic">“{t.content}”</p>
                    {t.sentiment && <div className="mt-4 text-[10px] text-emerald-800/40 font-bold uppercase tracking-widest">氛围: {t.sentiment}</div>}
                  </div>
                ))}
             </div>
          )}
          
          {activeTab === 'stats' && (
            <div className="space-y-8 animate-float-up">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-rose-50 p-8 rounded-[2.5rem] text-center hover:scale-105 transition-transform"><p className="text-3xl font-black text-rose-600">{stats.healing}</p><p className="text-[10px] font-bold uppercase tracking-widest text-rose-400 mt-2">愈心</p></div>
                <div className="bg-sky-50 p-8 rounded-[2.5rem] text-center hover:scale-105 transition-transform"><p className="text-3xl font-black text-sky-600">{stats.todo}</p><p className="text-[10px] font-bold uppercase tracking-widest text-sky-400 mt-2">待办</p></div>
                <div className="bg-emerald-50 p-8 rounded-[2.5rem] text-center hover:scale-105 transition-transform"><p className="text-3xl font-black text-emerald-600">{stats.creative}</p><p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mt-2">灵感</p></div>
                <div className="bg-amber-50 p-8 rounded-[2.5rem] text-center hover:scale-105 transition-transform"><p className="text-3xl font-black text-amber-600">{stats.other}</p><p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mt-2">记录</p></div>
              </div>
              <div className="bg-white p-10 rounded-[3rem] border border-emerald-50 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-700">
                <div>
                  <h3 className="serif text-2xl text-emerald-950 mb-2">专注里程碑</h3>
                  <p className="text-slate-400 text-sm">在这里，每一秒专注都凝聚成成长的痕迹。</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">累计专注时长</p>
                  <p className="text-4xl font-black text-emerald-800">{formatDuration(totalFocusTime)}</p>
                </div>
              </div>
            </div>
          )}

          {thoughts.length === 0 && !isProcessing && (
            <div className="flex flex-col items-center justify-center py-32 opacity-20">
               <Coffee size={80} strokeWidth={1} className="mb-6" />
               <p className="serif text-2xl italic tracking-[0.2em]">此时此刻，唯有宁静</p>
            </div>
          )}
        </div>
      </main>

      {!isMuted && isActive && (
        <div className="fixed bottom-12 left-12 flex items-center gap-3 bg-emerald-900 text-white px-6 py-3 rounded-full shadow-2xl animate-pulse z-50">
           <Volume2 size={16} />
           <span className="text-xs font-black uppercase tracking-widest">专注心流中</span>
        </div>
      )}
    </div>
  );
};

export default App;
