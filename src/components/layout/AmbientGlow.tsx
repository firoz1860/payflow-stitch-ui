import React from 'react';

export const AmbientGlow: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Top Left Electric Blue Aura */}
      <div className="absolute -top-[15%] left-[8%] w-[680px] h-[680px] rounded-full bg-blue-400/10 blur-[130px]" />
      
      {/* Mid Right Cyan/Indigo Aura */}
      <div className="absolute top-[35%] right-[-5%] w-[580px] h-[580px] rounded-full bg-indigo-400/10 blur-[140px]" />
      
      {/* Bottom Center Emerald/Slate Aura */}
      <div className="absolute bottom-[-10%] left-[30%] w-[720px] h-[720px] rounded-full bg-emerald-400/5 blur-[150px]" />
    </div>
  );
};
