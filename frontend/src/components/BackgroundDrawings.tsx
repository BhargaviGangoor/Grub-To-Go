import React from "react";

interface DrawingProps {
  className?: string;
  stroke?: string;
}

// 1. Notre-Dame Cathedral Basilica of Saigon
export function SaigonCathedralDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`absolute left-4 bottom-[200px] w-[450px] h-[750px] pointer-events-none opacity-[0.16] select-none z-0 hidden lg:block ${className}`}
      viewBox="0 0 500 850"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Left Tower Spire */}
      <path d="M 175 220 L 175 70" />
      <path d="M 140 220 L 175 70 L 210 220" />
      <path d="M 148 220 L 175 85 L 202 220" strokeWidth="0.8" />
      <path d="M 165 140 L 185 140" />
      <path d="M 160 170 L 190 170" />
      <path d="M 150 200 L 200 200" />
      <path d="M 175 70 L 175 50" />
      <path d="M 169 58 L 181 58" />

      {/* Right Tower Spire */}
      <path d="M 355 220 L 355 70" />
      <path d="M 320 220 L 355 70 L 390 220" />
      <path d="M 328 220 L 355 85 L 382 220" strokeWidth="0.8" />
      <path d="M 345 140 L 365 140" />
      <path d="M 340 170 L 370 170" />
      <path d="M 330 200 L 380 200" />
      <path d="M 355 70 L 355 50" />
      <path d="M 349 58 L 361 58" />

      {/* Left Tower Body */}
      <path d="M 140 220 L 140 720 L 210 720 L 210 220 Z" />
      <path d="M 140 310 L 210 310" />
      <path d="M 140 430 L 210 430" />
      <path d="M 140 550 L 210 550" />
      <path d="M 140 630 L 210 630" />
      <path d="M 155 280 C 155 250, 168 250, 168 280 L 168 310" />
      <path d="M 182 280 C 182 250, 195 250, 195 280 L 195 310" />
      <path d="M 158 390 C 158 340, 172 340, 172 390 L 172 430" />
      <path d="M 178 390 C 178 340, 192 340, 192 390 L 192 430" />

      {/* Right Tower Body */}
      <path d="M 320 220 L 320 720 L 390 720 L 390 220 Z" />
      <path d="M 320 310 L 390 310" />
      <path d="M 320 430 L 390 430" />
      <path d="M 320 550 L 390 550" />
      <path d="M 320 630 L 390 630" />
      <circle cx="355" cy="280" r="10" />
      <circle cx="355" cy="400" r="12" />

      {/* Central Portal Nave & Rose Window */}
      <path d="M 210 310 L 320 310" />
      <path d="M 210 430 L 320 430" />
      <path d="M 210 630 L 320 630" />
      <path d="M 210 720 L 320 720" />
      <path d="M 210 310 L 265 250 L 320 310" />
      <circle cx="265" cy="370" r="32" />
      <circle cx="265" cy="370" r="7" />
      <path d="M 265 338 L 265 402" />
      <path d="M 233 370 L 297 370" />

      {/* Doors */}
      <path d="M 160 720 C 160 670, 190 670, 190 720" />
      <path d="M 340 720 C 340 670, 370 670, 370 720" />
      <path d="M 235 720 C 235 640, 295 640, 295 720" />

      {/* Ground lines */}
      <path d="M 20 720 L 480 720" />
      <path d="M 10 730 L 490 730" strokeWidth="0.8" />
    </svg>
  );
}

// 2. Bến Thành Market Clock Tower Facade
export function BenThanhMarketDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`absolute right-6 top-[80px] w-[380px] h-[480px] pointer-events-none opacity-[0.14] select-none z-0 hidden lg:block ${className}`}
      viewBox="0 0 400 500"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Side pavilions */}
      <path d="M 50 420 L 140 420 L 140 340 L 50 340 Z" />
      <path d="M 50 340 L 140 310" />
      <path d="M 70 420 C 70 380, 100 380, 100 420" />
      <path d="M 115 420 L 115 370" strokeDasharray="3 3" />

      <path d="M 260 420 L 350 420 L 350 340 L 260 340 Z" />
      <path d="M 260 340 L 350 310" />
      <path d="M 300 420 C 300 380, 330 380, 330 420" />
      <path d="M 285 420 L 285 370" strokeDasharray="3 3" />

      {/* Main Base Section */}
      <path d="M 140 420 L 260 420 L 260 310 L 140 310 Z" />
      <path d="M 170 420 C 170 360, 230 360, 230 420 Z" />
      <path d="M 175 420 C 175 368, 225 368, 225 420 Z" strokeWidth="0.8" />
      
      {/* Mid Tower Section */}
      <path d="M 160 310 L 240 310 L 240 190 L 160 190 Z" />
      <path d="M 150 190 L 250 190" />
      
      {/* Large Clock Face */}
      <circle cx="200" cy="245" r="22" />
      <circle cx="200" cy="245" r="18" strokeDasharray="2 3" />
      <circle cx="200" cy="245" r="2" fill={stroke} />
      <path d="M 200 245 L 200 232" strokeWidth="1.5" />
      <path d="M 200 245 L 212 245" strokeWidth="1.2" />

      {/* Triangular Roof Spire */}
      <path d="M 155 190 L 200 120 L 245 190" />
      <path d="M 163 190 L 200 132 L 237 190" strokeWidth="0.8" />
      
      {/* Spire Needle & Top Flag */}
      <path d="M 200 120 L 200 70" />
      <path d="M 200 80 Q 215 75 220 85 Q 200 90 200 90" fill="#f4f1ea" />

      {/* Ground lines */}
      <path d="M 20 420 L 380 420" />
      <path d="M 10 430 L 390 430" strokeWidth="0.8" />
    </svg>
  );
}

// 3. One Pillar Pagoda (Chùa Một Cột)
export function OnePillarPagodaDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`absolute right-4 bottom-[220px] w-[350px] h-[450px] pointer-events-none opacity-[0.14] select-none z-0 hidden lg:block ${className}`}
      viewBox="0 0 400 500"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Lotus Pond Waterline */}
      <path d="M 50 380 Q 200 395 350 380" />
      <path d="M 30 395 Q 200 410 370 395" strokeWidth="0.8" />

      {/* Central Pillar */}
      <path d="M 185 380 L 185 240 L 215 240 L 215 380 Z" />

      {/* Diagonal Wooden Braces */}
      <path d="M 185 320 L 140 240" strokeWidth="1.8" />
      <path d="M 215 320 L 260 240" strokeWidth="1.8" />

      {/* Temple Floor */}
      <path d="M 110 240 L 290 240 L 290 220 L 110 220 Z" />

      {/* Temple Body */}
      <path d="M 130 220 L 130 130 L 270 130 L 270 220 Z" />
      <path d="M 160 220 L 160 150 L 240 150 L 240 220 Z" />
      <path d="M 200 150 L 200 220" strokeWidth="0.8" />

      {/* Curved Sanctuary Roof */}
      <path d="M 90 140 Q 200 70 310 140" />
      <path d="M 85 148 Q 200 75 315 148" />
      <path d="M 90 140 Q 75 110 95 130" />
      <path d="M 310 140 Q 325 110 305 130" />
      
      {/* Top Crest */}
      <circle cx="200" cy="85" r="4" />
      <path d="M 190 92 Q 200 85 210 92" />

      {/* Lotus Flowers */}
      <g strokeWidth="0.8" opacity="0.8">
        <path d="M 90 380 Q 95 365 100 380" />
        <ellipse cx="75" cy="385" rx="15" ry="3" />
        <path d="M 300 395 Q 305 380 310 395" />
        <ellipse cx="330" cy="398" rx="18" ry="4" />
      </g>
    </svg>
  );
}

// 4. Steaming Pho Bowl
export function PhoBowlSketch({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`absolute right-4 top-[650px] w-[350px] h-[300px] pointer-events-none opacity-[0.14] select-none z-0 hidden lg:block ${className}`}
      viewBox="0 0 400 300"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 160 110 Q 148 70 162 40" />
      <path d="M 200 105 Q 212 65 200 35" />
      <path d="M 240 110 Q 228 72 242 42" />
      <path d="M 330 50 L 150 180" strokeWidth="2.5" />
      <path d="M 345 50 L 170 188" strokeWidth="2" />
      <ellipse cx="200" cy="140" rx="95" ry="25" fill="#f4f1ea" />
      <ellipse cx="200" cy="140" rx="90" ry="21" />
      <path d="M 130 138 C 140 155, 170 155, 180 138" strokeWidth="0.8" />
      <path d="M 150 142 C 160 160, 190 160, 200 142" strokeWidth="0.8" />
      <path d="M 210 138 C 220 155, 250 155, 260 138" strokeWidth="0.8" />
      <path d="M 106 148 C 106 205, 294 205, 294 148" />
      <path d="M 165 200 L 160 220 L 240 220 L 235 200 Z" />
      <path d="M 160 220 L 240 220" strokeWidth="1.8" />
    </svg>
  );
}

// 5. Traditional Drip Coffee
export function DripCoffeeSketch({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`absolute left-6 bottom-[40px] w-[250px] h-[350px] pointer-events-none opacity-[0.14] select-none z-0 hidden lg:block ${className}`}
      viewBox="0 0 300 400"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="150" cy="78" r="4" />
      <path d="M 115 90 L 185 90 L 175 82 L 125 82 Z" fill="#f4f1ea" />
      <path d="M 120 90 L 125 170 L 175 170 L 180 90 Z" />
      <ellipse cx="150" cy="173" rx="45" ry="7" fill="#f4f1ea" />
      <ellipse cx="150" cy="173" rx="42" ry="5" />
      <path d="M 115 180 L 128 310 L 172 310 L 185 180 Z" />
      <path d="M 123 260 Q 150 263 177 260" strokeWidth="1.5" />
      <path d="M 125 285 Q 150 288 175 285" strokeWidth="1.5" />
      <path d="M 125 285 L 127 310 L 173 310 L 175 285 Z" fill="#f4f1ea" />
      <circle cx="150" cy="205" r="1.5" fill={stroke} />
      <circle cx="150" cy="225" r="1.5" fill={stroke} />
    </svg>
  );
}

// 6. Paddling Canoe
export function PaddlingBoatDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`absolute right-4 bottom-10 w-[380px] h-[220px] pointer-events-none opacity-[0.14] select-none z-0 hidden xl:block ${className}`}
      viewBox="0 0 500 300"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 40 180 Q 250 260 460 180" />
      <path d="M 30 170 Q 250 280 470 170" />
      <path d="M 30 170 Q 250 255 470 170" strokeWidth="0.8" />
      <path d="M 80 200 Q 82 230 85 208" strokeWidth="0.8" />
      <path d="M 130 215 Q 133 248 137 220" strokeWidth="0.8" />
      <path d="M 190 225 Q 195 258 200 228" strokeWidth="0.8" />
      <path d="M 260 228 Q 265 258 270 228" strokeWidth="0.8" />
      <path d="M 105 130 L 145 130 L 125 105 Z" fill="#f4f1ea" />
      <circle cx="125" cy="142" r="5.5" />
      <path d="M 125 148 L 125 190" />
      <path d="M 125 155 L 105 175 L 90 210" />
      <path d="M 85 160 L 115 260" strokeWidth="2.5" />
      <path d="M 220 220 C 220 180, 280 180, 280 220 Z" fill="#f4f1ea" />
      <path d="M 310 215 C 310 185, 360 185, 360 215 Z" fill="#f4f1ea" />
      <path d="M 20 240 Q 100 230 180 240 Q 260 250 340 240 Q 420 230 480 240" strokeWidth="0.8" />
    </svg>
  );
}

// Botanical sprig
export function BotanicalSprigDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none opacity-[0.20] select-none z-0 ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 50 90 Q 55 50 45 10" />
      <path d="M 46 15 C 35 12, 38 25, 48 20 C 58 25, 61 12, 46 15" />
      <path d="M 48 35 C 30 30, 32 48, 49 42 C 66 48, 68 30, 48 35" />
      <path d="M 32 40 L 48 38" strokeWidth="0.6" />
      <path d="M 64 40 L 48 38" strokeWidth="0.6" />
      <path d="M 50 60 C 25 55, 27 75, 51 68 C 75 75, 77 55, 50 60" />
    </svg>
  );
}

// Curving Vine and Leaves Border (Pencil Drawn Aesthetic)
export function PencilLeavesBorder({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`absolute right-0 top-0 h-screen w-36 pointer-events-none opacity-[0.22] select-none z-20 hidden lg:block ${className}`}
      viewBox="0 0 160 800"
      fill="none"
      stroke={stroke}
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Curved vine running down */}
      <path d="M 140 0 Q 70 200 135 400 Q 155 550 95 700 Q 75 760 115 800" strokeWidth="1.4" />
      <path d="M 137 0 Q 67 200 132 400" strokeWidth="0.5" strokeDasharray="3 3" />

      {/* Leaf 1 (y=60) */}
      <path d="M 120 60 C 95 40, 75 55, 102 72 C 130 90, 128 68, 120 60" />
      <path d="M 120 60 L 109 64" strokeWidth="0.6" />

      {/* Leaf 2 (y=160) */}
      <path d="M 98 160 C 65 145, 55 175, 88 188 C 120 200, 110 172, 98 160" />
      <path d="M 98 160 L 85 168" strokeWidth="0.6" />

      {/* Vine curl (y=230) */}
      <path d="M 100 230 Q 55 210 75 250 Q 88 260 100 248" strokeWidth="0.8" />

      {/* Leaf 3 (y=310) */}
      <path d="M 112 310 C 80 295, 90 330, 122 322 C 145 315, 130 305, 112 310" />
      <path d="M 112 310 L 101 318" strokeWidth="0.6" />

      {/* Leaf 4 (y=410) */}
      <path d="M 130 410 C 100 395, 90 428, 125 438 C 150 448, 142 420, 130 410" />
      <path d="M 130 410 L 118 418" strokeWidth="0.6" />

      {/* Leaf 5 (y=510) */}
      <path d="M 118 510 C 85 495, 75 528, 108 538 C 130 548, 128 522, 118 510" />
      <path d="M 118 510 L 105 518" strokeWidth="0.6" />

      {/* Vine curl (y=580) */}
      <path d="M 120 580 Q 75 570 95 600 Q 108 610 Q 120 595" strokeWidth="0.8" />

      {/* Leaf 6 (y=660) */}
      <path d="M 102 660 C 70 640, 60 675, 92 688 C 118 700, 112 672, 102 660" />
      <path d="M 102 660 L 88 668" strokeWidth="0.6" />

      {/* Leaf 7 (y=750) */}
      <path d="M 105 750 C 80 735, 70 768, 98 775 C 120 780, 115 760, 105 750" />
      <path d="M 105 750 L 92 758" strokeWidth="0.6" />
    </svg>
  );
}

// Full perimeter border of pencil-drawn leaves and vines
export function PencilLeavesPerimeter({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <div className={`fixed inset-0 pointer-events-none z-20 select-none ${className}`}>
      {/* Top Border Vine */}
      <svg
        className="absolute top-0 left-0 w-full h-8 opacity-[0.20]"
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
        fill="none"
        stroke={stroke}
        strokeWidth="1.1"
        strokeLinecap="round"
      >
        <path d="M 0 15 Q 250 5 500 15 Q 750 25 1000 15" />
        <path d="M 0 17 Q 250 7 500 17 Q 750 27 1000 17" strokeWidth="0.5" strokeDasharray="3 3" />
        <path d="M 100 12 C 110 0, 130 5, 120 18 C 110 30, 95 20, 100 12" />
        <path d="M 250 10 C 260 22, 280 15, 270 5 C 260 -5, 245 2, 250 10" />
        <path d="M 400 14 C 410 2, 430 7, 420 20 C 410 32, 395 22, 400 14" />
        <path d="M 550 12 C 560 25, 580 18, 570 8 C 560 -2, 545 5, 550 12" />
        <path d="M 700 15 C 710 3, 730 8, 720 21 C 710 33, 695 23, 700 15" />
        <path d="M 850 13 C 860 25, 880 18, 870 8 C 860 -2, 845 5, 850 13" />
      </svg>

      {/* Bottom Border Vine */}
      <svg
        className="absolute bottom-0 left-0 w-full h-8 opacity-[0.20]"
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
        fill="none"
        stroke={stroke}
        strokeWidth="1.1"
        strokeLinecap="round"
      >
        <path d="M 0 25 Q 250 35 500 25 Q 750 15 1000 25" />
        <path d="M 0 23 Q 250 33 500 23 Q 750 13 1000 23" strokeWidth="0.5" strokeDasharray="3 3" />
        <path d="M 150 28 C 160 40, 180 35, 170 22 C 160 10, 145 20, 150 28" />
        <path d="M 300 26 C 310 14, 330 20, 320 32 C 310 45, 295 35, 300 26" />
        <path d="M 450 29 C 460 41, 480 36, 470 23 C 460 11, 445 21, 450 29" />
        <path d="M 600 25 C 610 13, 630 18, 620 30 C 610 43, 595 33, 600 25" />
        <path d="M 750 28 C 760 40, 780 35, 770 22 C 760 10, 745 20, 750 28" />
        <path d="M 900 27 C 910 15, 930 20, 920 32 C 910 45, 895 35, 900 27" />
      </svg>

      {/* Left Border Vine */}
      <svg
        className="absolute left-0 top-0 h-full w-8 opacity-[0.20]"
        viewBox="0 0 40 1000"
        preserveAspectRatio="none"
        fill="none"
        stroke={stroke}
        strokeWidth="1.1"
        strokeLinecap="round"
      >
        <path d="M 15 0 Q 25 250 15 500 Q 5 750 15 1000" />
        <path d="M 17 0 Q 27 250 17 500 Q 7 750 17 1000" strokeWidth="0.5" strokeDasharray="3 3" />
        <path d="M 12 100 C 0 90, 5 70, 18 80 C 30 90, 20 105, 12 100" />
        <path d="M 18 250 C 30 240, 25 220, 12 230 C 0 240, 8 260, 18 250" />
        <path d="M 13 400 C 1 390, 6 370, 19 380 C 30 390, 21 405, 13 400" />
        <path d="M 17 550 C 29 540, 24 520, 11 530 C 0 540, 7 560, 17 550" />
        <path d="M 14 700 C 2 690, 7 670, 20 680 C 31 690, 22 705, 14 700" />
        <path d="M 18 850 C 30 840, 25 820, 12 830 C 0 840, 8 860, 18 850" />
      </svg>

      {/* Right Border Vine */}
      <svg
        className="absolute right-0 top-0 h-full w-8 opacity-[0.20]"
        viewBox="0 0 40 1000"
        preserveAspectRatio="none"
        fill="none"
        stroke={stroke}
        strokeWidth="1.1"
        strokeLinecap="round"
      >
        <path d="M 25 0 Q 15 250 25 500 Q 35 750 25 1000" />
        <path d="M 23 0 Q 13 250 23 500 Q 33 750 23 1000" strokeWidth="0.5" strokeDasharray="3 3" />
        <path d="M 28 150 C 40 160, 35 180, 22 170 C 10 160, 20 145, 28 150" />
        <path d="M 22 300 C 10 310, 15 330, 28 320 C 40 310, 32 290, 22 300" />
        <path d="M 29 450 C 41 460, 36 480, 23 470 C 11 460, 21 445, 29 450" />
        <path d="M 21 600 C 9 610, 14 630, 27 620 C 40 610, 31 590, 21 600" />
        <path d="M 28 750 C 40 760, 35 780, 22 770 C 10 760, 20 745, 28 750" />
        <path d="M 23 900 C 11 910, 16 930, 29 920 C 41 910, 33 890, 23 900" />
      </svg>
    </div>
  );
}
