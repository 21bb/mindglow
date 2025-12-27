
import React, { useMemo, useState } from 'react';
import { Thought, MoodType } from '../types';
import { Sparkles, X } from 'lucide-react';

interface TreeVisualizationProps {
  thoughts: Thought[];
}

const getMoodColors = (mood?: MoodType) => {
  switch (mood) {
    case 'sunny': return { start: '#FFD700', mid: '#F59E0B', end: '#10B981', glow: 'rgba(245, 158, 11, 0.5)' }; 
    case 'rainy': return { start: '#60A5FA', mid: '#3B82F6', end: '#0EA5E9', glow: 'rgba(59, 130, 246, 0.5)' }; 
    case 'stormy': return { start: '#A855F7', mid: '#7C3AED', end: '#4338CA', glow: 'rgba(124, 58, 237, 0.5)' }; 
    case 'cloudy': return { start: '#94A3B8', mid: '#64748B', end: '#475569', glow: 'rgba(100, 116, 139, 0.5)' }; 
    case 'windy': return { start: '#6EE7B7', mid: '#10B981', end: '#059669', glow: 'rgba(16, 185, 129, 0.5)' }; 
    case 'misty': return { start: '#F8FAFC', mid: '#CBD5E1', end: '#94A3B8', glow: 'rgba(203, 213, 225, 0.4)' }; 
    default: return { start: '#D1FAE5', mid: '#10B981', end: '#064E3B', glow: 'rgba(16, 185, 129, 0.4)' };
  }
};

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ thoughts }) => {
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null);

  const branchesData = useMemo(() => {
    const map = new Map<string, Thought[]>();
    thoughts.forEach(t => {
      const tag = t.tags?.[0] || '感悟';
      if (!map.has(tag)) map.set(tag, []);
      map.get(tag)?.push(t);
    });
    return Array.from(map.entries());
  }, [thoughts]);

  return (
    <div className="w-full h-[750px] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#f9fbf9] to-white rounded-[4rem] relative overflow-hidden shadow-[inset_0_0_150px_rgba(5,150,105,0.05)] border border-emerald-50/50">
      
      <div className="absolute top-12 left-12 z-10">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>
          <h3 className="serif text-2xl font-bold text-emerald-950/70 tracking-[0.2em]">灵感之森</h3>
        </div>
        <p className="text-[10px] text-emerald-800/40 font-bold uppercase tracking-[0.4em] mt-2 pl-6">Emotional Landscapes of Creativity</p>
      </div>

      {selectedThought && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-2xl p-6 animate-in fade-in duration-500">
          <div className="bg-white p-12 rounded-[4.5rem] shadow-[0_50px_150px_rgba(6,78,59,0.1)] border border-emerald-50 max-w-lg w-full relative animate-in zoom-in-95 duration-700">
            <button onClick={() => setSelectedThought(null)} className="absolute top-10 right-10 w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all">
              <X size={20} />
            </button>
            <div className="flex gap-2 mb-10">
              {selectedThought.tags?.map(tag => (
                <span key={tag} className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full uppercase tracking-widest border border-emerald-100">#{tag}</span>
              ))}
            </div>
            <div className="space-y-10">
              <section>
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mb-4">思绪的剪影</div>
                <p className="text-slate-800 text-2xl serif italic leading-relaxed">“{selectedThought.content}”</p>
              </section>
              {selectedThought.aiAdvice && (
                <section className="pt-10 border-t border-emerald-50">
                  <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                    <Sparkles size={14} /> 灵感回响
                  </div>
                  <div className="text-sm text-slate-600 italic leading-relaxed bg-emerald-50/30 p-8 rounded-[2.5rem] shadow-inner border border-emerald-100/20">
                    {selectedThought.aiAdvice}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="relative w-full h-full flex items-end justify-center">
        <div className="absolute bottom-4 w-96 h-12 bg-emerald-900/5 blur-3xl rounded-full"></div>
        <svg className="w-full h-full max-w-[700px] overflow-visible" viewBox="0 0 400 500">
          <defs>
            <filter id="labelShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
            </filter>
            <style>
              {`
                @keyframes sway { 0% { transform: rotate(-0.4deg); } 100% { transform: rotate(0.4deg); } }
                @keyframes leafSway { 0% { transform: rotate(-3deg); } 100% { transform: rotate(3deg); } }
                .tree-group { transform-origin: 200px 500px; animation: sway 8s ease-in-out infinite alternate; }
                .leaf-node:hover { transform: scale(1.4) translateY(-10px); filter: brightness(1.1); }
                .leaf-animate { transform-origin: center bottom; animation: leafSway 4s ease-in-out infinite alternate; }
              `}
            </style>
          </defs>

          <g className="tree-group">
            <path d="M 170 500 Q 200 480 200 430 L 200 150 Q 200 480 230 500 Z" fill="rgba(6, 78, 59, 0.08)" />
            
            {branchesData.map(([tag, group], bIdx) => {
              const total = branchesData.length;
              const heightFactor = 0.2 + (bIdx / (total || 1)) * 0.6;
              const startY = 500 - (500 * heightFactor);
              const side = bIdx % 2 === 0 ? 1 : -1;
              const angle = side * (30 + Math.random() * 35);
              const branchLen = 100 + Math.random() * 80;
              const rad = (angle - 90) * Math.PI / 180;
              const xEnd = 200 + Math.cos(rad) * branchLen;
              const yEnd = startY + Math.sin(rad) * branchLen;

              return (
                <g key={tag}>
                  <path d={`M 200 ${startY} C 200 ${startY - 20} ${200 + (xEnd-200)*0.3} ${startY + (yEnd-startY)*0.1} ${xEnd} ${yEnd}`} stroke="rgba(6, 78, 59, 0.08)" strokeWidth="4" fill="none" strokeLinecap="round" />
                  
                  <g transform={`translate(${xEnd}, ${yEnd - 35})`}>
                    <rect x="-40" y="-12" width="80" height="24" rx="12" fill="white" fillOpacity="0.9" filter="url(#labelShadow)" />
                    <text fontSize="9" fontWeight="bold" fill="#064e3b" textAnchor="middle" className="tracking-widest uppercase" dy="4">{tag}</text>
                  </g>

                  {group.map((thought, tIdx) => {
                    const leafBranchLen = branchLen + 40;
                    const spread = 25 + (tIdx * 25);
                    const lAngle = angle + (tIdx - (group.length-1)/2) * 30;
                    const lRad = (lAngle - 90) * Math.PI / 180;
                    const lx = 200 + Math.cos(lRad) * (leafBranchLen + spread);
                    const ly = startY + Math.sin(lRad) * (leafBranchLen + spread);
                    const colors = getMoodColors(thought.mood);
                    const gradId = `grad-${thought.id}`;
                    
                    return (
                      <g 
                        key={thought.id} 
                        transform={`translate(${lx}, ${ly}) rotate(${lAngle + 90})`} 
                        className="leaf-node cursor-pointer transition-all duration-700" 
                        onClick={() => setSelectedThought(thought)}
                      >
                        <defs>
                          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={colors.start} />
                            <stop offset="50%" stopColor={colors.mid} />
                            <stop offset="100%" stopColor={colors.end} />
                          </linearGradient>
                          <filter id={`glow-${thought.id}`}>
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>
                        <g className="leaf-animate" style={{ animationDelay: `${tIdx * 0.5}s` }}>
                           {/* Leaf Glow */}
                          <path d="M 0 0 C 16 -12 24 -24 0 -42 C -24 -24 -16 -12 0 0" fill={colors.glow} transform="scale(1.1)" filter="blur(4px)" />
                          {/* Main Leaf */}
                          <path d="M 0 0 C 16 -12 24 -24 0 -42 C -24 -24 -16 -12 0 0" fill={`url(#${gradId})`} className="opacity-95" />
                          {/* Leaf Vein */}
                          <path d="M 0 0 L 0 -32" stroke="white" strokeOpacity="0.3" strokeWidth="0.8" fill="none" />
                        </g>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default TreeVisualization;
