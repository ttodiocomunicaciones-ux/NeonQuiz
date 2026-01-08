import React from 'react';

interface AdBannerProps {
  position: 'top' | 'bottom';
}

export const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  return (
    <div className={`ads-container w-full h-[60px] flex-shrink-0 bg-black/80 border-${position === 'top' ? 'b' : 't'} border-white/10 flex items-center justify-center relative overflow-hidden group z-50`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
      <div className="text-center">
        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest block mb-1">Publicidad</span>
        <div className="w-64 h-8 bg-gray-800/50 rounded flex items-center justify-center border border-dashed border-gray-700">
           <span className="text-xs text-gray-500">Banner {position === 'top' ? 'Superior' : 'Inferior'} 320x50</span>
        </div>
      </div>
    </div>
  );
};