import React from "react";

// SVG character avatars with distinct visual style for each guide
// Lana = Owl (Language), Leo = Lion (Literacy), Nia = Penguin (Numeracy),
// Dex = Fox (Digital), Indy = Koala (Independence), Winnie = Bear (General)

export function LanaOwl({ size = 80, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label="Lana the Owl - Language Guide"
    >
      <circle cx="50" cy="58" r="32" fill="#7C3AED" />
      <circle cx="50" cy="45" r="26" fill="#8B5CF6" />
      {/* Wings */}
      <ellipse cx="22" cy="65" rx="14" ry="9" fill="#6D28D9" transform="rotate(-20 22 65)" />
      <ellipse cx="78" cy="65" rx="14" ry="9" fill="#6D28D9" transform="rotate(20 78 65)" />
      {/* Ear tufts */}
      <polygon points="36,22 30,5 42,18" fill="#7C3AED" />
      <polygon points="64,22 58,18 70,5" fill="#7C3AED" />
      {/* Face plate */}
      <ellipse cx="50" cy="46" rx="20" ry="16" fill="#DDD6FE" />
      {/* Eyes */}
      <circle cx="40" cy="42" r="9" fill="white" />
      <circle cx="60" cy="42" r="9" fill="white" />
      <circle cx="40" cy="42" r="6" fill="#4C1D95" />
      <circle cx="60" cy="42" r="6" fill="#4C1D95" />
      <circle cx="42" cy="40" r="2" fill="white" />
      <circle cx="62" cy="40" r="2" fill="white" />
      {/* Beak */}
      <polygon points="50,50 45,56 55,56" fill="#F59E0B" />
      {/* Chest pattern */}
      <ellipse cx="50" cy="68" rx="12" ry="10" fill="#A78BFA" />
      <text x="50" y="95" textAnchor="middle" fontSize="10" fill="#5B21B6" fontWeight="bold">
        Lana
      </text>
    </svg>
  );
}

export function LeoLion({ size = 80, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label="Leo the Lion - Literacy Guide"
    >
      {/* Mane */}
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="50"
          rx="8"
          ry="28"
          fill="#D97706"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="25" fill="#F59E0B" />
      {/* Ears */}
      <circle cx="30" cy="30" r="8" fill="#F59E0B" />
      <circle cx="70" cy="30" r="8" fill="#F59E0B" />
      <circle cx="30" cy="30" r="5" fill="#FDE68A" />
      <circle cx="70" cy="30" r="5" fill="#FDE68A" />
      {/* Face */}
      <circle cx="40" cy="46" r="7" fill="#FDE68A" />
      <circle cx="60" cy="46" r="7" fill="#FDE68A" />
      <circle cx="40" cy="46" r="4" fill="#1C1917" />
      <circle cx="60" cy="46" r="4" fill="#1C1917" />
      <circle cx="41" cy="44" r="1.5" fill="white" />
      <circle cx="61" cy="44" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="54" rx="5" ry="3" fill="#B45309" />
      {/* Mouth */}
      <path d="M45,57 Q50,62 55,57" stroke="#92400E" strokeWidth="1.5" fill="none" />
      {/* Whiskers */}
      <line x1="20" y1="52" x2="38" y2="54" stroke="#78716C" strokeWidth="1" />
      <line x1="20" y1="56" x2="38" y2="56" stroke="#78716C" strokeWidth="1" />
      <line x1="62" y1="54" x2="80" y2="52" stroke="#78716C" strokeWidth="1" />
      <line x1="62" y1="56" x2="80" y2="56" stroke="#78716C" strokeWidth="1" />
      <text x="50" y="95" textAnchor="middle" fontSize="10" fill="#92400E" fontWeight="bold">
        Leo
      </text>
    </svg>
  );
}

export function NiaPenguin({ size = 80, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label="Nia the Penguin - Numeracy Guide"
    >
      {/* Body */}
      <ellipse cx="50" cy="62" rx="28" ry="32" fill="#1E40AF" />
      {/* Belly */}
      <ellipse cx="50" cy="65" rx="18" ry="22" fill="white" />
      {/* Wings */}
      <ellipse cx="22" cy="60" rx="10" ry="20" fill="#1E3A8A" transform="rotate(-15 22 60)" />
      <ellipse cx="78" cy="60" rx="10" ry="20" fill="#1E3A8A" transform="rotate(15 78 60)" />
      {/* Head */}
      <circle cx="50" cy="34" r="22" fill="#1E40AF" />
      {/* Face white patch */}
      <ellipse cx="50" cy="36" rx="14" ry="16" fill="white" />
      {/* Eyes */}
      <circle cx="43" cy="30" r="6" fill="white" />
      <circle cx="57" cy="30" r="6" fill="white" />
      <circle cx="43" cy="30" r="4" fill="#0F172A" />
      <circle cx="57" cy="30" r="4" fill="#0F172A" />
      <circle cx="44" cy="28" r="1.5" fill="white" />
      <circle cx="58" cy="28" r="1.5" fill="white" />
      {/* Beak */}
      <polygon points="50,38 44,44 56,44" fill="#F59E0B" />
      {/* Feet */}
      <ellipse cx="38" cy="91" rx="10" ry="5" fill="#F59E0B" />
      <ellipse cx="62" cy="91" rx="10" ry="5" fill="#F59E0B" />
      {/* Numbers on belly */}
      <text x="50" y="68" textAnchor="middle" fontSize="9" fill="#1E40AF" fontWeight="bold">
        1+2=3
      </text>
      <text x="50" y="95" textAnchor="middle" fontSize="10" fill="#1E3A8A" fontWeight="bold">
        Nia
      </text>
    </svg>
  );
}

export function DexFox({ size = 80, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label="Dex the Fox - Digital Guide"
    >
      {/* Body */}
      <ellipse cx="50" cy="68" rx="26" ry="24" fill="#EA580C" />
      {/* Chest */}
      <ellipse cx="50" cy="72" rx="14" ry="14" fill="#FED7AA" />
      {/* Tail */}
      <ellipse cx="78" cy="75" rx="12" ry="8" fill="#EA580C" transform="rotate(-30 78 75)" />
      <ellipse cx="81" cy="71" rx="6" ry="4" fill="white" transform="rotate(-30 81 71)" />
      {/* Head */}
      <ellipse cx="50" cy="38" rx="22" ry="20" fill="#EA580C" />
      {/* Pointed ears */}
      <polygon points="32,22 26,5 42,20" fill="#EA580C" />
      <polygon points="68,22 58,20 74,5" fill="#EA580C" />
      <polygon points="34,20 30,9 40,19" fill="#FCA5A5" />
      <polygon points="66,20 60,19 70,9" fill="#FCA5A5" />
      {/* Face */}
      <ellipse cx="50" cy="42" rx="14" ry="12" fill="#FED7AA" />
      {/* Eyes */}
      <circle cx="42" cy="36" r="6" fill="white" />
      <circle cx="58" cy="36" r="6" fill="white" />
      <circle cx="42" cy="36" r="4" fill="#065F46" />
      <circle cx="58" cy="36" r="4" fill="#065F46" />
      <circle cx="43" cy="34" r="1.5" fill="white" />
      <circle cx="59" cy="34" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="44" rx="4" ry="3" fill="#7F1D1D" />
      {/* Mouth */}
      <path d="M45,47 Q50,52 55,47" stroke="#7F1D1D" strokeWidth="1.5" fill="none" />
      {/* Tech glasses */}
      <rect
        x="35"
        y="32"
        width="12"
        height="8"
        rx="2"
        fill="none"
        stroke="#0EA5E9"
        strokeWidth="1.5"
      />
      <rect
        x="53"
        y="32"
        width="12"
        height="8"
        rx="2"
        fill="none"
        stroke="#0EA5E9"
        strokeWidth="1.5"
      />
      <line x1="47" y1="36" x2="53" y2="36" stroke="#0EA5E9" strokeWidth="1.5" />
      <text x="50" y="95" textAnchor="middle" fontSize="10" fill="#C2410C" fontWeight="bold">
        Dex
      </text>
    </svg>
  );
}

export function IndyKoala({ size = 80, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label="Indy the Koala - Independence Guide"
    >
      {/* Body */}
      <ellipse cx="50" cy="68" rx="26" ry="24" fill="#6B7280" />
      {/* Belly */}
      <ellipse cx="50" cy="70" rx="14" ry="16" fill="#E5E7EB" />
      {/* Arms */}
      <ellipse cx="24" cy="65" rx="10" ry="7" fill="#6B7280" transform="rotate(-30 24 65)" />
      <ellipse cx="76" cy="65" rx="10" ry="7" fill="#6B7280" transform="rotate(30 76 65)" />
      {/* Head */}
      <circle cx="50" cy="38" r="22" fill="#6B7280" />
      {/* Big round ears */}
      <circle cx="26" cy="22" r="13" fill="#6B7280" />
      <circle cx="74" cy="22" r="13" fill="#6B7280" />
      <circle cx="26" cy="22" r="9" fill="#9CA3AF" />
      <circle cx="74" cy="22" r="9" fill="#9CA3AF" />
      {/* Face patch */}
      <ellipse cx="50" cy="40" rx="16" ry="14" fill="#9CA3AF" />
      {/* Eyes */}
      <circle cx="42" cy="34" r="6" fill="white" />
      <circle cx="58" cy="34" r="6" fill="white" />
      <circle cx="42" cy="34" r="4" fill="#1C1917" />
      <circle cx="58" cy="34" r="4" fill="#1C1917" />
      <circle cx="43" cy="32" r="1.5" fill="white" />
      <circle cx="59" cy="32" r="1.5" fill="white" />
      {/* Big nose */}
      <ellipse cx="50" cy="44" rx="7" ry="5" fill="#374151" />
      {/* Mouth */}
      <path d="M44,49 Q50,54 56,49" stroke="#374151" strokeWidth="1.5" fill="none" />
      {/* Star badge */}
      <polygon
        points="50,60 52,66 58,66 53,70 55,76 50,72 45,76 47,70 42,66 48,66"
        fill="#F59E0B"
      />
      <text x="50" y="95" textAnchor="middle" fontSize="10" fill="#4B5563" fontWeight="bold">
        Indy
      </text>
    </svg>
  );
}

export function WinnieBear({ size = 80, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label="Winnie the Bear - AI Mentor"
    >
      {/* Body */}
      <ellipse cx="50" cy="68" rx="28" ry="26" fill="#92400E" />
      {/* Belly */}
      <ellipse cx="50" cy="70" rx="16" ry="18" fill="#FEF3C7" />
      {/* Arms */}
      <circle cx="22" cy="68" r="12" fill="#92400E" />
      <circle cx="78" cy="68" r="12" fill="#92400E" />
      {/* Head */}
      <circle cx="50" cy="38" r="24" fill="#92400E" />
      {/* Ears */}
      <circle cx="28" cy="18" r="11" fill="#92400E" />
      <circle cx="72" cy="18" r="11" fill="#92400E" />
      <circle cx="28" cy="18" r="7" fill="#B45309" />
      <circle cx="72" cy="18" r="7" fill="#B45309" />
      {/* Face */}
      <ellipse cx="50" cy="42" rx="16" ry="14" fill="#FEF3C7" />
      {/* Eyes */}
      <circle cx="42" cy="35" r="6" fill="white" />
      <circle cx="58" cy="35" r="6" fill="white" />
      <circle cx="42" cy="35" r="4" fill="#1C1917" />
      <circle cx="58" cy="35" r="4" fill="#1C1917" />
      <circle cx="43" cy="33" r="1.5" fill="white" />
      <circle cx="59" cy="33" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="44" rx="5" ry="4" fill="#7F1D1D" />
      {/* Smile */}
      <path d="M44,49 Q50,55 56,49" stroke="#7F1D1D" strokeWidth="2" fill="none" />
      {/* Graduation cap */}
      <rect x="30" y="16" width="40" height="5" rx="1" fill="#1E1B4B" />
      <polygon points="50,5 30,16 70,16" fill="#1E1B4B" />
      <circle cx="50" cy="5" r="3" fill="#F59E0B" />
      <text x="50" y="95" textAnchor="middle" fontSize="10" fill="#78350F" fontWeight="bold">
        Winnie
      </text>
    </svg>
  );
}

// Character card component - larger version for lesson guides
export function CharacterCard({ character, size = 100, label, color = "purple" }) {
  const colorMap = {
    purple: "from-purple-100 to-purple-200 border-purple-300",
    amber: "from-amber-100 to-amber-200 border-amber-300",
    blue: "from-blue-100 to-blue-200 border-blue-300",
    orange: "from-orange-100 to-orange-200 border-orange-300",
    gray: "from-gray-100 to-gray-200 border-gray-300",
    yellow: "from-yellow-100 to-yellow-200 border-yellow-300",
  };

  const AvatarComponent =
    {
      lana: LanaOwl,
      leo: LeoLion,
      nia: NiaPenguin,
      dex: DexFox,
      indy: IndyKoala,
      winnie: WinnieBear,
    }[character] || WinnieBear;

  return (
    <div
      className={`flex flex-col items-center p-4 rounded-xl border-2 bg-gradient-to-b ${colorMap[color] || colorMap.purple} shadow-sm`}
    >
      <AvatarComponent size={size} />
      {label && <p className="mt-2 text-sm font-semibold text-gray-700 text-center">{label}</p>}
    </div>
  );
}

// Mini inline avatar (for use inside lessons)
export function MiniAvatar({ character, size = 48 }) {
  const AvatarComponent =
    {
      lana: LanaOwl,
      leo: LeoLion,
      nia: NiaPenguin,
      dex: DexFox,
      indy: IndyKoala,
      winnie: WinnieBear,
    }[character] || WinnieBear;
  return <AvatarComponent size={size} />;
}

export default {
  LanaOwl,
  LeoLion,
  NiaPenguin,
  DexFox,
  IndyKoala,
  WinnieBear,
  CharacterCard,
  MiniAvatar,
};
