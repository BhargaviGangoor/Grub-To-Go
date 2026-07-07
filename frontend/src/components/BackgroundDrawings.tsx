import React from "react";

interface DrawingProps {
  className?: string;
  stroke?: string;
}

// 1. Notre-Dame Cathedral Basilica of Saigon
export function SaigonCathedralDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
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
      className={`pointer-events-none select-none ${className}`}
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
      className={`pointer-events-none select-none ${className}`}
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
        className="absolute top-0 left-0 w-full h-16 opacity-[0.38]"
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M 0 15 Q 250 5 500 15 Q 750 25 1000 15" />
        <path d="M 0 17 Q 250 7 500 17 Q 750 27 1000 17" strokeWidth="0.8" strokeDasharray="3 3" />
        <path d="M 100 12 C 110 0, 130 5, 120 18 C 110 30, 95 20, 100 12" />
        <path d="M 250 10 C 260 22, 280 15, 270 5 C 260 -5, 245 2, 250 10" />
        <path d="M 400 14 C 410 2, 430 7, 420 20 C 410 32, 395 22, 400 14" />
        <path d="M 550 12 C 560 25, 580 18, 570 8 C 560 -2, 545 5, 550 12" />
        <path d="M 700 15 C 710 3, 730 8, 720 21 C 710 33, 695 23, 700 15" />
        <path d="M 850 13 C 860 25, 880 18, 870 8 C 860 -2, 845 5, 850 13" />
      </svg>

      {/* Bottom Border Vine */}
      <svg
        className="absolute bottom-0 left-0 w-full h-16 opacity-[0.38]"
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M 0 25 Q 250 35 500 25 Q 750 15 1000 25" />
        <path d="M 0 23 Q 250 33 500 23 Q 750 13 1000 23" strokeWidth="0.8" strokeDasharray="3 3" />
        <path d="M 150 28 C 160 40, 180 35, 170 22 C 160 10, 145 20, 150 28" />
        <path d="M 300 26 C 310 14, 330 20, 320 32 C 310 45, 295 35, 300 26" />
        <path d="M 450 29 C 460 41, 480 36, 470 23 C 460 11, 445 21, 450 29" />
        <path d="M 600 25 C 610 13, 630 18, 620 30 C 610 43, 595 33, 600 25" />
        <path d="M 750 28 C 760 40, 780 35, 770 22 C 760 10, 745 20, 750 28" />
        <path d="M 900 27 C 910 15, 930 20, 920 32 C 910 45, 895 35, 900 27" />
      </svg>

      {/* Left Border Vine */}
      <svg
        className="absolute left-0 top-0 h-full w-16 opacity-[0.38]"
        viewBox="0 0 40 1000"
        preserveAspectRatio="none"
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M 15 0 Q 25 250 15 500 Q 5 750 15 1000" />
        <path d="M 17 0 Q 27 250 17 500 Q 7 750 17 1000" strokeWidth="0.8" strokeDasharray="3 3" />
        <path d="M 12 100 C 0 90, 5 70, 18 80 C 30 90, 20 105, 12 100" />
        <path d="M 18 250 C 30 240, 25 220, 12 230 C 0 240, 8 260, 18 250" />
        <path d="M 13 400 C 1 390, 6 370, 19 380 C 30 390, 21 405, 13 400" />
        <path d="M 17 550 C 29 540, 24 520, 11 530 C 0 540, 7 560, 17 550" />
        <path d="M 14 700 C 2 690, 7 670, 20 680 C 31 690, 22 705, 14 700" />
        <path d="M 18 850 C 30 840, 25 820, 12 830 C 0 840, 8 860, 18 850" />
      </svg>

      {/* Right Border Vine */}
      <svg
        className="absolute right-0 top-0 h-full w-16 opacity-[0.38]"
        viewBox="0 0 40 1000"
        preserveAspectRatio="none"
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M 25 0 Q 15 250 25 500 Q 35 750 25 1000" />
        <path d="M 23 0 Q 13 250 23 500 Q 33 750 23 1000" strokeWidth="0.8" strokeDasharray="3 3" />
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

// 10. Cozy Potted Flowers (Flower Pot)
export function FlowerPotSketch({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`absolute pointer-events-none select-none z-0 hidden lg:block ${className}`}
      viewBox="0 0 300 400"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* The Pot Rim */}
      <path d="M 100 280 L 200 280 L 200 265 L 100 265 Z" fill="#f4f1ea" />
      <path d="M 105 273 L 195 273" strokeWidth="0.6" strokeDasharray="2 2" />

      {/* The Pot Body */}
      <path d="M 112 280 L 188 280 L 175 370 L 125 370 Z" fill="#f4f1ea" strokeWidth="1.5" />
      {/* Decorative lines on the pot */}
      <path d="M 125 300 Q 150 305 175 300" strokeWidth="0.8" />
      <path d="M 128 325 Q 150 330 172 325" strokeWidth="0.8" />
      <path d="M 130 350 Q 150 355 170 350" strokeWidth="0.8" />
      
      {/* Stems & Leaves */}
      <path d="M 150 265 C 150 200, 140 160, 150 100" strokeWidth="1.4" />
      <path d="M 148 180 C 130 170, 135 190, 147 195" fill="#f4f1ea" />
      <path d="M 149 150 C 165 140, 160 160, 150 165" fill="#f4f1ea" />
      
      {/* Center Flower (Tulip shape) */}
      <path d="M 130 95 C 130 70, 145 60, 150 95 C 155 60, 170 70, 170 95 Z" fill="#f4f1ea" strokeWidth="1.5" />
      <path d="M 150 95 L 150 65" strokeWidth="0.8" />
      <circle cx="150" cy="62" r="2.5" fill={stroke} />

      {/* Left stem */}
      <path d="M 130 265 C 120 210, 95 180, 100 130" strokeWidth="1.2" />
      <path d="M 118 200 C 105 195, 110 210, 122 212" />
      {/* Left Flower */}
      <path d="M 88 125 C 88 105, 100 95, 102 125 C 104 95, 116 105, 116 125 Z" fill="#f4f1ea" />
      <circle cx="102" cy="98" r="2" fill={stroke} />

      {/* Right stem */}
      <path d="M 170 265 C 180 210, 205 180, 200 120" strokeWidth="1.2" />
      <path d="M 182 190 C 195 185, 190 200, 180 202" />
      {/* Right Flower */}
      <path d="M 188 115 C 188 95, 200 85, 202 115 C 204 85, 216 95, 216 115 Z" fill="#f4f1ea" />
      <circle cx="202" cy="88" r="2" fill={stroke} />

      {/* Drooping leaves */}
      <path d="M 105 280 C 85 290, 80 320, 95 330 C 105 320, 100 300, 108 282 Z" fill="#f4f1ea" />
      <path d="M 195 280 C 215 290, 220 320, 205 330 C 195 320, 200 300, 192 282 Z" fill="#f4f1ea" />
    </svg>
  );
}

// 11. Cozy Bird on Branch (Bird Sketch)
export function BirdOnBranchSketch({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`absolute pointer-events-none select-none z-0 hidden lg:block ${className}`}
      viewBox="0 0 250 250"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* The Branch */}
      <path d="M 20 180 C 80 170, 140 185, 230 155" strokeWidth="1.8" />
      <path d="M 120 177 C 110 190, 80 200, 70 210" strokeWidth="0.8" />
      <path d="M 85 200 Q 75 205 78 212" strokeWidth="0.6" />
      
      {/* Bird Body */}
      <path d="M 90 145 C 90 110, 145 110, 155 145 C 160 160, 145 180, 115 180 C 95 180, 90 165, 90 145 Z" fill="#f4f1ea" strokeWidth="1.5" />
      
      {/* Bird Head */}
      <circle cx="150" cy="125" r="14" fill="#f4f1ea" strokeWidth="1.5" />
      <circle cx="154" cy="122" r="1.5" fill={stroke} />
      <path d="M 164 123 L 174 127 L 164 131 Z" fill={stroke} />
      
      {/* Bird Wing */}
      <path d="M 105 148 C 95 152, 105 170, 125 162 C 130 158, 120 144, 105 148 Z" fill="#f4f1ea" />
      
      {/* Bird Tail */}
      <path d="M 90 165 L 55 185 L 80 172 Z" fill="#f4f1ea" />
      
      {/* Bird Feet */}
      <path d="M 120 178 L 118 188" strokeWidth="1.5" />
      <path d="M 132 178 L 134 188" strokeWidth="1.5" />
    </svg>
  );
}

// 12. Flock of Flying Birds (Flying Birds)
export function FlyingBirdsSketch({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 200 150"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Bird 1 - Large */}
      <path d="M 40 50 Q 55 25 70 50 Q 85 25 100 50" strokeWidth="1.6" />
      {/* Bird 2 - Medium */}
      <path d="M 90 85 Q 102 65 115 85 Q 128 65 140 85" strokeWidth="1.3" />
      {/* Bird 3 - Small */}
      <path d="M 130 110 Q 140 95 150 110 Q 160 95 170 110" strokeWidth="1" />
      {/* Bird 4 - Extra Small */}
      <path d="M 30 95 Q 38 85 45 95 Q 52 85 60 95" strokeWidth="0.8" />
    </svg>
  );
}

// 1. Eiffel Tower
export function EiffelTowerDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 400 800"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top Antenna */}
      <path d="M 200 40 L 200 100" strokeWidth="1.5" />
      <circle cx="200" cy="35" r="4" fill={stroke} />

      {/* Top Deck */}
      <path d="M 185 100 L 215 100 L 215 120 L 185 120 Z" />
      
      {/* Mid Section 1 */}
      <path d="M 190 120 L 160 300 M 210 120 L 240 300" strokeWidth="1.2" />
      <path d="M 195 120 L 175 300 M 205 120 L 225 300" strokeWidth="0.8" />
      <path d="M 180 180 L 220 180" />
      <path d="M 172 240 L 228 240" />

      {/* Second Deck */}
      <path d="M 150 300 L 250 300 L 255 330 L 145 330 Z" />
      <path d="M 150 315 L 250 315" strokeDasharray="2 2" />

      {/* Lower Section */}
      <path d="M 148 330 Q 120 500 80 750 M 252 330 Q 280 500 320 750" strokeWidth="2" />
      <path d="M 160 330 Q 140 500 120 750 M 240 330 Q 260 500 280 750" strokeWidth="1.2" />
      <path d="M 140 430 L 260 430" />
      <path d="M 130 530 L 270 530" />
      <path d="M 115 630 L 285 630" />

      {/* Cross beams (x-patterns) */}
      <path d="M 190 120 L 220 180 M 210 120 L 180 180" strokeWidth="0.6" />
      <path d="M 180 180 L 228 240 M 220 180 L 172 240" strokeWidth="0.6" />
      <path d="M 172 240 L 250 300 M 228 240 L 150 300" strokeWidth="0.6" />

      <path d="M 148 330 L 260 430 M 252 330 L 140 430" strokeWidth="0.8" />
      <path d="M 140 430 L 270 530 M 260 430 L 130 530" strokeWidth="0.8" />
      <path d="M 130 530 L 285 630 M 270 530 L 115 630" strokeWidth="0.8" />

      {/* Base Arch */}
      <path d="M 120 750 C 130 650, 270 650, 280 750" strokeWidth="2" />
      <path d="M 135 750 C 145 670, 255 670, 265 750" strokeWidth="1" />

      {/* Ground */}
      <path d="M 40 750 L 360 750" strokeWidth="1.5" />
    </svg>
  );
}

// 2. Croissant
export function CroissantDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 200 150"
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 20 80 C 20 20, 180 20, 180 80 C 180 100, 150 120, 100 120 C 50 120, 20 100, 20 80 Z" />
      <path d="M 40 50 C 60 70, 60 100, 45 110" />
      <path d="M 70 35 C 90 60, 90 105, 75 118" />
      <path d="M 110 30 C 130 60, 125 110, 110 120" />
      <path d="M 150 45 C 160 65, 155 95, 145 108" />
      <path d="M 35 90 C 45 95, 55 90, 60 85" strokeWidth="0.8" />
      <path d="M 130 90 C 140 95, 150 90, 160 85" strokeWidth="0.8" />
    </svg>
  );
}

// 3. Street Lamp
export function StreetLampDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 200 400"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 100 380 L 100 120" strokeWidth="3" />
      <path d="M 80 380 L 120 380" strokeWidth="3" />
      <path d="M 90 350 L 110 350" strokeWidth="2" />
      
      {/* Lamp Head */}
      <path d="M 80 120 L 120 120 L 130 50 L 70 50 Z" />
      <path d="M 90 120 L 95 50 M 110 120 L 105 50" strokeWidth="0.8" />
      <path d="M 70 50 C 70 20, 130 20, 130 50" fill="#f4f1ea" />
      <circle cx="100" cy="20" r="4" fill={stroke} />

      {/* Light glow (dashed lines) */}
      <path d="M 50 85 L 20 95 M 150 85 L 180 95" strokeDasharray="3 3" />
      <path d="M 40 50 L 15 35 M 160 50 L 185 35" strokeDasharray="3 3" />
      <path d="M 60 20 L 40 5 M 140 20 L 160 5" strokeDasharray="3 3" />
    </svg>
  );
}

// 4. Wine Glass
export function WineGlassDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 150 200"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Bowl */}
      <path d="M 40 30 C 40 100, 110 100, 110 30" strokeWidth="1.5" />
      <ellipse cx="75" cy="30" rx="35" ry="6" />
      
      {/* Wine level */}
      <path d="M 46 65 Q 75 70 104 65" strokeWidth="0.8" />
      <path d="M 46 65 C 46 95, 104 95, 104 65" strokeWidth="0.5" />

      {/* Stem */}
      <path d="M 75 100 L 75 170" strokeWidth="1.5" />
      
      {/* Base */}
      <ellipse cx="75" cy="170" rx="25" ry="5" />
    </svg>
  );
}

// 5. Arc de Triomphe
export function ArcDeTriompheDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 300 300"
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 40 260 L 40 60 L 260 60 L 260 260" />
      <path d="M 100 260 L 100 160 C 100 120, 200 120, 200 160 L 200 260" />
      
      {/* Top details */}
      <path d="M 30 60 L 270 60 L 270 40 L 30 40 Z" />
      <path d="M 35 40 L 265 40 L 265 25 L 35 25 Z" />

      {/* Pillars details */}
      <path d="M 55 100 L 85 100 L 85 150 L 55 150 Z" />
      <path d="M 215 100 L 245 100 L 245 150 L 215 150 Z" />
      <circle cx="70" cy="125" r="8" />
      <circle cx="230" cy="125" r="8" />

      {/* Arch details */}
      <path d="M 110 160 C 110 130, 190 130, 190 160" strokeWidth="0.8" />
      {/* Bird Feet */}
      <path d="M 120 178 L 118 188" strokeWidth="1.5" />
      <path d="M 132 178 L 134 188" strokeWidth="1.5" />
    </svg>
  );
}


// 6. Rose Bouquet
export function RoseBouquetDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 250 350"
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Wrapper Paper */}
      <path d="M 80 250 L 50 150 L 100 80 L 150 80 L 200 150 L 170 250 Z" strokeWidth="1" />
      <path d="M 80 250 L 110 320 L 140 320 L 170 250" strokeWidth="1" />
      <path d="M 50 150 C 70 180, 100 200, 170 250" strokeWidth="0.8" />
      <path d="M 200 150 C 180 180, 150 200, 80 250" strokeWidth="0.8" />
      
      {/* Rose 1 (Center) */}
      <path d="M 125 100 C 115 110, 135 120, 125 130 C 115 140, 100 120, 110 110 C 120 100, 130 90, 125 100 Z" />
      <path d="M 120 115 C 125 115, 125 125, 120 125" />
      
      {/* Rose 2 (Left) */}
      <path d="M 85 90 C 75 100, 95 110, 85 120 C 75 130, 60 110, 70 100 C 80 90, 90 80, 85 90 Z" />
      <path d="M 80 105 C 85 105, 85 115, 80 115" />
      
      {/* Rose 3 (Right) */}
      <path d="M 165 90 C 155 100, 175 110, 165 120 C 155 130, 140 110, 150 100 C 160 90, 170 80, 165 90 Z" />
      <path d="M 160 105 C 165 105, 165 115, 160 115" />

      {/* Leaves */}
      <path d="M 100 130 C 90 140, 95 160, 110 150 Z" />
      <path d="M 150 130 C 160 140, 155 160, 140 150 Z" />
      <path d="M 125 135 C 120 145, 130 155, 125 145 Z" />
      
      {/* Stems poking out */}
      <path d="M 115 320 L 110 340 M 125 320 L 125 345 M 135 320 L 140 335" strokeWidth="1.2" />
    </svg>
  );
}

// 7. Ribbon
export function RibbonDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 300 200"
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Center knot */}
      <ellipse cx="150" cy="100" rx="15" ry="20" />
      <path d="M 145 85 C 145 115, 155 115, 155 85" strokeWidth="0.8" />
      
      {/* Left loop */}
      <path d="M 135 100 C 50 50, 50 150, 135 110" />
      <path d="M 80 110 C 100 105, 120 105, 135 105" strokeWidth="0.8" />
      
      {/* Right loop */}
      <path d="M 165 100 C 250 50, 250 150, 165 110" />
      <path d="M 220 110 C 200 105, 180 105, 165 105" strokeWidth="0.8" />
      
      {/* Tails */}
      <path d="M 145 118 C 120 160, 90 170, 60 190 L 80 160 L 50 150 C 90 140, 110 130, 135 118" />
      <path d="M 155 118 C 180 160, 210 170, 240 190 L 220 160 L 250 150 C 210 140, 190 130, 165 118" />
    </svg>
  );
}

// 8. Heels
export function HeelsDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 200 180"
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Left Shoe */}
      <path d="M 80 130 C 60 150, 30 160, 20 160 C 20 150, 30 140, 50 120 C 70 100, 80 60, 100 50 C 110 45, 130 50, 140 70 C 120 80, 110 110, 110 130 L 80 130 Z" />
      <path d="M 110 130 L 115 160 L 105 160 Z" />
      
      {/* Right Shoe (Slightly offset) */}
      <g opacity="0.8">
        <path d="M 110 110 C 90 130, 60 140, 50 140 C 50 130, 60 120, 80 100 C 100 80, 110 40, 130 30 C 140 25, 160 30, 170 50 C 150 60, 140 90, 140 110 L 110 110 Z" />
        <path d="M 140 110 L 145 140 L 135 140 Z" />
      </g>
    </svg>
  );
}

// 9. Coffee Cup (Cafe style)
export function CoffeeCupDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 200 200"
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Saucer */}
      <ellipse cx="100" cy="140" rx="60" ry="15" />
      <ellipse cx="100" cy="143" rx="55" ry="12" strokeWidth="0.8" />
      
      {/* Cup Body */}
      <path d="M 50 70 C 50 130, 70 135, 100 135 C 130 135, 150 130, 150 70" />
      <ellipse cx="100" cy="70" rx="50" ry="12" />
      
      {/* Coffee inside */}
      <ellipse cx="100" cy="72" rx="42" ry="8" strokeWidth="0.8" />
      <path d="M 100 70 Q 110 75 120 70" strokeWidth="0.5" />
      
      {/* Handle */}
      <path d="M 148 80 C 180 80, 180 110, 143 115" />
      <path d="M 149 85 C 170 85, 170 105, 145 110" strokeWidth="0.8" />
      
      {/* Steam */}
      <path d="M 90 50 Q 80 40, 95 30 T 90 10" strokeWidth="1" strokeDasharray="5 5" />
      <path d="M 110 55 Q 125 40, 110 30 T 115 15" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );
}

// 13. Paris Notre-Dame Cathedral Facade
export function ParisNotreDameDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 500 600"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer Outline */}
      <path d="M 120 500 L 120 180 L 210 180 L 210 280 L 290 280 L 290 180 L 380 180 L 380 500 Z" />
      
      {/* Towers */}
      <path d="M 120 180 L 120 100 L 210 100 L 210 180" />
      <path d="M 140 100 L 140 180 M 190 100 L 190 180" strokeWidth="0.8" />
      <path d="M 150 120 C 150 110, 180 110, 180 120 L 180 160 C 180 170, 150 170, 150 160 Z" />
      
      <path d="M 290 180 L 290 100 L 380 100 L 380 180" />
      <path d="M 310 100 L 310 180 M 360 100 L 360 180" strokeWidth="0.8" />
      <path d="M 320 120 C 320 110, 350 110, 350 120 L 350 160 C 350 170, 320 170, 320 160 Z" />

      {/* Gallery of Kings */}
      <path d="M 120 280 L 380 280" />
      <path d="M 120 305 L 380 305" />
      <path d="M 130 305 Q 135 285 140 305 M 145 305 Q 150 285 155 305 M 160 305 Q 165 285 170 305 M 175 305 Q 180 285 185 305 M 190 305 Q 195 285 200 305" strokeWidth="0.8" />
      <path d="M 300 305 Q 305 285 310 305 M 315 305 Q 320 285 325 305 M 330 305 Q 335 285 340 305 M 345 305 Q 350 285 355 305 M 360 305 Q 365 285 370 305" strokeWidth="0.8" />

      {/* Rose Window */}
      <circle cx="250" cy="360" r="45" />
      <circle cx="250" cy="360" r="10" />
      <path d="M 250 315 L 250 405" strokeWidth="0.8" />
      <path d="M 205 360 L 295 360" strokeWidth="0.8" />
      <path d="M 218 328 L 282 392" strokeWidth="0.8" />
      <path d="M 218 392 L 282 328" strokeWidth="0.8" />
      <circle cx="250" cy="360" r="32" strokeDasharray="3 3" />

      {/* Portals */}
      <path d="M 140 500 C 140 440, 190 440, 190 500" strokeWidth="1.5" />
      <path d="M 148 500 C 148 455, 182 455, 182 500" strokeWidth="0.8" />
      
      <path d="M 220 500 C 220 430, 280 430, 280 500" strokeWidth="1.5" />
      <path d="M 228 500 C 228 445, 272 445, 272 500" strokeWidth="0.8" />
      
      <path d="M 310 500 C 310 440, 360 440, 360 500" strokeWidth="1.5" />
      <path d="M 318 500 C 318 455, 352 455, 352 500" strokeWidth="0.8" />

      {/* Gallery details */}
      <path d="M 120 410 L 380 410" />
      <path d="M 120 220 L 380 220" />
      
      {/* Ground lines */}
      <path d="M 50 500 L 450 500" strokeWidth="1.5" />
      <path d="M 30 510 L 470 510" strokeWidth="0.8" />
    </svg>
  );
}

// 14. Vintage Vespa Scooter
export function VintageVespaDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 400 300"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="90" cy="220" r="30" />
      <circle cx="90" cy="220" r="10" />
      <circle cx="280" cy="220" r="30" />
      <circle cx="280" cy="220" r="10" />
      <path d="M 60 215 C 60 175, 115 175, 115 210" strokeWidth="1.6" fill="#f4f1ea" />
      <path d="M 125 180 L 140 90" strokeWidth="2.5" />
      <path d="M 115 90 L 165 90" strokeWidth="2" />
      <circle cx="140" cy="75" r="12" fill="#f4f1ea" />
      <circle cx="140" cy="75" r="8" />
      <path d="M 140 95 C 105 110, 105 185, 120 210 L 135 210" strokeWidth="1.8" fill="#f4f1ea" />
      <path d="M 130 210 L 220 210" strokeWidth="2.5" />
      <path d="M 210 210 C 220 160, 310 160, 310 210 Z" fill="#f4f1ea" strokeWidth="1.8" />
      <path d="M 230 180 L 290 180" strokeWidth="0.8" />
      <path d="M 160 165 C 160 150, 260 145, 270 165 Z" fill="#f4f1ea" strokeWidth="1.6" />
      <path d="M 200 165 L 200 210" strokeWidth="0.8" />
      <path d="M 310 180 L 325 180 L 325 190 Z" fill={stroke} />
      <path d="M 180 210 L 175 235" strokeWidth="2" />
    </svg>
  );
}

// 15. Classic French Bistro Table & Chairs
export function BistroSetDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 350 350"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 20 320 L 330 320" strokeWidth="1.5" />
      <ellipse cx="175" cy="180" rx="60" ry="12" fill="#f4f1ea" strokeWidth="1.6" />
      <ellipse cx="175" cy="184" rx="58" ry="10" strokeWidth="0.8" />
      <path d="M 175 192 L 175 300" strokeWidth="2.5" />
      <path d="M 170 200 L 170 290 M 180 200 L 180 290" strokeWidth="0.8" />
      <path d="M 175 220 Q 160 230 175 240 Q 190 230 175 220" strokeWidth="0.8" />
      <path d="M 145 320 Q 175 295 205 320" strokeWidth="2" fill="#f4f1ea" />
      <ellipse cx="160" cy="176" rx="8" ry="2.5" />
      <path d="M 155 176 C 155 182, 165 182, 165 176" />
      <path d="M 158 171 Q 155 166 160 162" strokeWidth="0.6" />
      <path d="M 60 240 L 60 130 C 60 100, 100 100, 100 130 L 100 240" strokeWidth="1.6" />
      <path d="M 68 135 C 68 120, 92 120, 92 135 L 92 240" strokeWidth="0.8" />
      <ellipse cx="85" cy="240" rx="25" ry="7" fill="#f4f1ea" strokeWidth="1.6" />
      <path d="M 65 245 L 55 320" strokeWidth="1.8" />
      <path d="M 105 245 L 115 320" strokeWidth="1.8" />
      <path d="M 75 246 L 80 320" strokeWidth="1.2" />
      <path d="M 95 246 L 90 320" strokeWidth="1.2" />
      <path d="M 60 280 Q 85 285 110 280" strokeWidth="0.8" />
      <path d="M 250 240 L 250 130 C 250 100, 290 100, 290 130 L 290 240" strokeWidth="1.6" />
      <path d="M 258 135 C 258 120, 282 120, 282 135 L 282 240" strokeWidth="0.8" />
      <ellipse cx="265" cy="240" rx="25" ry="7" fill="#f4f1ea" strokeWidth="1.6" />
      <path d="M 245 245 L 235 320" strokeWidth="1.8" />
      <path d="M 285 245 L 295 320" strokeWidth="1.8" />
      <path d="M 255 246 L 260 320" strokeWidth="1.2" />
      <path d="M 275 246 L 270 320" strokeWidth="1.2" />
      <path d="M 240 280 Q 265 285 290 280" strokeWidth="0.8" />
    </svg>
  );
}

// 16. Wicker Basket of French Baguettes
export function BaguetteBasketDrawing({ className = "", stroke = "#8d7a68" }: DrawingProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 250 300"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="125" cy="180" rx="55" ry="12" fill="#f4f1ea" strokeWidth="1.8" />
      <path d="M 70 180 C 70 240, 95 280, 125 280 C 155 280, 180 240, 180 180 Z" fill="#f4f1ea" strokeWidth="1.5" />
      <path d="M 85 195 Q 125 200 165 195" strokeWidth="0.8" />
      <path d="M 90 220 Q 125 225 160 220" strokeWidth="0.8" />
      <path d="M 100 245 Q 125 250 150 245" strokeWidth="0.8" />
      <path d="M 100 180 L 110 280 M 125 180 L 125 280 M 150 180 L 140 280" strokeWidth="0.8" />
      <g>
        <path d="M 80 180 L 50 70 C 45 50, 65 40, 75 55 L 105 180 Z" fill="#f4f1ea" strokeWidth="1.5" />
        <path d="M 58 85 L 68 80" strokeWidth="1.5" />
        <path d="M 64 105 L 74 100" strokeWidth="1.5" />
        <path d="M 70 125 L 80 120" strokeWidth="1.5" />
        <path d="M 76 145 L 86 140" strokeWidth="1.5" />
      </g>
      <g>
        <path d="M 110 180 L 110 50 C 110 30, 130 30, 130 50 L 130 180 Z" fill="#f4f1ea" strokeWidth="1.5" />
        <path d="M 113 70 L 127 65" strokeWidth="1.5" />
        <path d="M 113 90 L 127 85" strokeWidth="1.5" />
        <path d="M 113 110 L 127 105" strokeWidth="1.5" />
        <path d="M 113 130 L 127 125" strokeWidth="1.5" />
        <path d="M 113 150 L 127 145" strokeWidth="1.5" />
      </g>
      <g>
        <path d="M 140 180 L 180 80 C 185 65, 202 75, 192 90 L 165 180 Z" fill="#f4f1ea" strokeWidth="1.5" />
        <path d="M 172 100 L 180 93" strokeWidth="1.5" />
        <path d="M 166 120 L 174 113" strokeWidth="1.5" />
        <path d="M 160 140 L 168 133" strokeWidth="1.5" />
        <path d="M 154 160 L 162 153" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
