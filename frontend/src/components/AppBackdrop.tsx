"use client";

import Image from "next/image";

const backdropTiles = [
  {
    src: "/bg-romance.jpg",
    alt: "Warm dining atmosphere",
    className:
      "left-[4%] top-[10%] h-52 w-40 -rotate-6 sm:h-60 sm:w-44 opacity-80",
  },
  {
    src: "/verandah.jpg",
    alt: "Dining veranda",
    className:
      "right-[6%] top-[8%] h-44 w-36 rotate-6 sm:h-52 sm:w-40 opacity-75",
  },
  {
    src: "/monuments.jpg",
    alt: "City heritage backdrop",
    className:
      "left-[8%] bottom-[8%] h-44 w-36 rotate-3 sm:h-52 sm:w-40 opacity-70",
  },
  {
    src: "/cute.jpg",
    alt: "Food and table texture",
    className:
      "right-[10%] bottom-[12%] h-52 w-40 -rotate-3 sm:h-60 sm:w-44 opacity-70",
  },
];

export default function AppBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(229,155,39,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(29,58,43,0.10),transparent_35%),linear-gradient(180deg,rgba(244,241,234,0.82),rgba(244,241,234,0.92))]" />
      <div className="cyber-grid absolute inset-0 opacity-25" />
      <div className="absolute inset-0 opacity-50 blur-[1px]">
        {backdropTiles.map((tile) => (
          <div
            key={tile.src}
            className={`absolute overflow-hidden rounded-[2rem] border border-white/60 bg-white/30 shadow-[0_18px_60px_rgba(29,58,43,0.14)] backdrop-blur-sm ${tile.className}`}
          >
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 160px, 220px"
              priority={false}
            />
          </div>
        ))}
      </div>
      <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-[#e59b27]/10 blur-3xl" />
      <div className="absolute bottom-24 right-1/4 h-64 w-64 rounded-full bg-[#1d3a2b]/10 blur-3xl" />
    </div>
  );
}