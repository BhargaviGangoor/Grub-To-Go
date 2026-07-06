"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Screen =
  | "home"
  | "assistant"
  | "menu"
  | "dashboard"
  | "login"
  | "register"
  | "research"
  | "advanced"
  | "artifact"
  | "token"
  | "redemption";

type Tile = {
  src: string;
  alt: string;
  className: string;
};

const backdropSets: Record<Screen, Tile[]> = {
  home: [
    {
      src: "/bg-romance.jpg",
      alt: "Warm dining atmosphere",
      className:
        "left-[4%] top-[12%] h-56 w-40 -rotate-6 opacity-85 sm:h-64 sm:w-48",
    },
    {
      src: "/verandah.jpg",
      alt: "Dining veranda",
      className:
        "right-[6%] top-[10%] h-48 w-36 rotate-6 opacity-75 sm:h-56 sm:w-44",
    },
    {
      src: "/download4.jpg",
      alt: "Hero dish collage",
      className:
        "left-[12%] bottom-[10%] h-44 w-36 rotate-3 opacity-70 sm:h-52 sm:w-44",
    },
    {
      src: "/cute.jpg",
      alt: "Table texture",
      className:
        "right-[12%] bottom-[12%] h-56 w-40 -rotate-3 opacity-70 sm:h-64 sm:w-48",
    },
  ],
  assistant: [
    {
      src: "/download.jpg",
      alt: "Featured bowl",
      className:
        "left-[5%] top-[12%] h-52 w-40 -rotate-6 opacity-80 sm:h-60 sm:w-44",
    },
    {
      src: "/download2.jpg",
      alt: "Creamy dish",
      className:
        "right-[7%] top-[14%] h-44 w-36 rotate-6 opacity-72 sm:h-52 sm:w-40",
    },
    {
      src: "/download3.jpg",
      alt: "Menu dish",
      className:
        "left-[11%] bottom-[11%] h-44 w-36 rotate-2 opacity-70 sm:h-52 sm:w-40",
    },
    {
      src: "/download4.jpg",
      alt: "Premium bowl",
      className:
        "right-[12%] bottom-[13%] h-52 w-40 -rotate-4 opacity-70 sm:h-60 sm:w-44",
    },
  ],
  menu: [
    {
      src: "/download3.jpg",
      alt: "Menu backdrop",
      className:
        "left-[6%] top-[8%] h-56 w-40 rotate-3 opacity-78 sm:h-64 sm:w-48",
    },
    {
      src: "/monuments.jpg",
      alt: "Heritage backdrop",
      className:
        "right-[8%] top-[12%] h-48 w-36 -rotate-6 opacity-70 sm:h-56 sm:w-44",
    },
    {
      src: "/download4.jpg",
      alt: "Menu dish plate",
      className:
        "left-[14%] bottom-[12%] h-44 w-36 -rotate-3 opacity-72 sm:h-52 sm:w-40",
    },
    {
      src: "/cute.jpg",
      alt: "Warm table setting",
      className:
        "right-[13%] bottom-[10%] h-56 w-40 rotate-4 opacity-72 sm:h-64 sm:w-48",
    },
  ],
  dashboard: [
    {
      src: "/verandah.jpg",
      alt: "Lifestyle dining backdrop",
      className:
        "left-[4%] top-[10%] h-52 w-40 -rotate-6 opacity-72 sm:h-60 sm:w-44",
    },
    {
      src: "/monuments.jpg",
      alt: "City heritage",
      className:
        "right-[5%] top-[10%] h-48 w-36 rotate-5 opacity-70 sm:h-56 sm:w-44",
    },
    {
      src: "/bg-romance.jpg",
      alt: "Dining mood",
      className:
        "left-[13%] bottom-[10%] h-44 w-36 rotate-3 opacity-68 sm:h-52 sm:w-40",
    },
    {
      src: "/cute.jpg",
      alt: "Tabletop warmth",
      className:
        "right-[14%] bottom-[12%] h-52 w-40 -rotate-4 opacity-72 sm:h-60 sm:w-48",
    },
  ],
  login: [
    {
      src: "/bg-romance.jpg",
      alt: "Warm dining atmosphere",
      className:
        "left-[7%] top-[12%] h-56 w-40 -rotate-3 opacity-72 sm:h-64 sm:w-48",
    },
    {
      src: "/cute.jpg",
      alt: "Clean tabletop",
      className:
        "right-[8%] top-[10%] h-44 w-36 rotate-6 opacity-68 sm:h-52 sm:w-40",
    },
    {
      src: "/download2.jpg",
      alt: "Food detail",
      className:
        "left-[14%] bottom-[10%] h-44 w-36 rotate-2 opacity-68 sm:h-52 sm:w-40",
    },
    {
      src: "/verandah.jpg",
      alt: "Verandah backdrop",
      className:
        "right-[13%] bottom-[12%] h-56 w-40 -rotate-5 opacity-70 sm:h-64 sm:w-48",
    },
  ],
  register: [
    {
      src: "/monuments.jpg",
      alt: "Heritage texture",
      className:
        "left-[6%] top-[10%] h-52 w-40 -rotate-6 opacity-68 sm:h-60 sm:w-44",
    },
    {
      src: "/bg-romance.jpg",
      alt: "Dining atmosphere",
      className:
        "right-[7%] top-[12%] h-48 w-36 rotate-5 opacity-72 sm:h-56 sm:w-44",
    },
    {
      src: "/download4.jpg",
      alt: "Food image",
      className:
        "left-[13%] bottom-[11%] h-44 w-36 rotate-3 opacity-72 sm:h-52 sm:w-40",
    },
    {
      src: "/cute.jpg",
      alt: "Soft tabletop",
      className:
        "right-[13%] bottom-[10%] h-56 w-40 -rotate-4 opacity-70 sm:h-64 sm:w-48",
    },
  ],
  research: [
    {
      src: "/monuments.jpg",
      alt: "Urban texture",
      className:
        "left-[5%] top-[10%] h-56 w-40 rotate-3 opacity-66 sm:h-64 sm:w-48",
    },
    {
      src: "/verandah.jpg",
      alt: "Warm dining mood",
      className:
        "right-[8%] top-[12%] h-44 w-36 -rotate-5 opacity-68 sm:h-52 sm:w-40",
    },
    {
      src: "/download3.jpg",
      alt: "Dish texture",
      className:
        "left-[13%] bottom-[12%] h-44 w-36 -rotate-4 opacity-70 sm:h-52 sm:w-40",
    },
    {
      src: "/download2.jpg",
      alt: "Warm plate",
      className:
        "right-[13%] bottom-[10%] h-52 w-40 rotate-4 opacity-70 sm:h-60 sm:w-48",
    },
  ],
  advanced: [
    {
      src: "/download.jpg",
      alt: "Advanced menu item",
      className:
        "left-[4%] top-[11%] h-52 w-40 -rotate-6 opacity-80 sm:h-60 sm:w-44",
    },
    {
      src: "/download4.jpg",
      alt: "Advanced food item",
      className:
        "right-[6%] top-[11%] h-48 w-36 rotate-6 opacity-74 sm:h-56 sm:w-44",
    },
    {
      src: "/bg-romance.jpg",
      alt: "Lifestyle backdrop",
      className:
        "left-[12%] bottom-[11%] h-44 w-36 rotate-3 opacity-68 sm:h-52 sm:w-40",
    },
    {
      src: "/cute.jpg",
      alt: "Dining detail",
      className:
        "right-[12%] bottom-[12%] h-56 w-40 -rotate-3 opacity-70 sm:h-64 sm:w-48",
    },
  ],
  artifact: [
    {
      src: "/download2.jpg",
      alt: "Artifact view backdrop",
      className:
        "left-[5%] top-[10%] h-52 w-40 rotate-3 opacity-72 sm:h-60 sm:w-44",
    },
    {
      src: "/monuments.jpg",
      alt: "Historical backdrop",
      className:
        "right-[7%] top-[10%] h-48 w-36 -rotate-5 opacity-68 sm:h-56 sm:w-44",
    },
    {
      src: "/download3.jpg",
      alt: "Artifact food image",
      className:
        "left-[13%] bottom-[12%] h-44 w-36 -rotate-4 opacity-70 sm:h-52 sm:w-40",
    },
    {
      src: "/bg-romance.jpg",
      alt: "Warm ambience",
      className:
        "right-[13%] bottom-[10%] h-56 w-40 rotate-4 opacity-68 sm:h-64 sm:w-48",
    },
  ],
  token: [
    {
      src: "/download4.jpg",
      alt: "Token view backdrop",
      className:
        "left-[6%] top-[10%] h-52 w-40 -rotate-4 opacity-76 sm:h-60 sm:w-44",
    },
    {
      src: "/verandah.jpg",
      alt: "Dining backdrop",
      className:
        "right-[7%] top-[12%] h-48 w-36 rotate-5 opacity-70 sm:h-56 sm:w-44",
    },
    {
      src: "/cute.jpg",
      alt: "Table setting",
      className:
        "left-[12%] bottom-[11%] h-44 w-36 rotate-2 opacity-68 sm:h-52 sm:w-40",
    },
    {
      src: "/bg-romance.jpg",
      alt: "Warm dining scene",
      className:
        "right-[12%] bottom-[12%] h-56 w-40 -rotate-3 opacity-70 sm:h-64 sm:w-48",
    },
  ],
  redemption: [
    {
      src: "/download.jpg",
      alt: "Redemption backdrop",
      className:
        "left-[5%] top-[10%] h-52 w-40 -rotate-5 opacity-78 sm:h-60 sm:w-44",
    },
    {
      src: "/download3.jpg",
      alt: "Redemption food image",
      className:
        "right-[8%] top-[10%] h-48 w-36 rotate-6 opacity-70 sm:h-56 sm:w-44",
    },
    {
      src: "/monuments.jpg",
      alt: "City backdrop",
      className:
        "left-[12%] bottom-[12%] h-44 w-36 rotate-3 opacity-68 sm:h-52 sm:w-40",
    },
    {
      src: "/verandah.jpg",
      alt: "Dining veranda",
      className:
        "right-[12%] bottom-[10%] h-56 w-40 -rotate-4 opacity-72 sm:h-64 sm:w-48",
    },
  ],
};

export default function AppBackdrop({ screen = "home" }: { screen?: Screen }) {
  const [rotationIndex, setRotationIndex] = useState(0);

  useEffect(() => {
    setRotationIndex(0);
    const interval = window.setInterval(() => {
      setRotationIndex((current) => current + 1);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [screen]);

  const tiles = useMemo(() => {
    const currentSet = backdropSets[screen] ?? backdropSets.home;
    const offset = rotationIndex % currentSet.length;
    return currentSet.slice(offset).concat(currentSet.slice(0, offset));
  }, [screen, rotationIndex]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(229,155,39,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(29,58,43,0.14),transparent_34%),linear-gradient(180deg,rgba(243,238,223,0.88),rgba(243,238,223,0.96))]" />
      <div className="cyber-grid absolute inset-0 opacity-20" />
      <div className="absolute inset-0 opacity-55 blur-[0.5px]">
        {tiles.map((tile, index) => (
          <div
            key={`${tile.src}-${index}`}
            className={`absolute overflow-hidden rounded-[2rem] border border-white/70 bg-white/25 shadow-[0_18px_60px_rgba(29,58,43,0.16)] backdrop-blur-sm transition-all duration-700 ease-out ${tile.className}`}
          >
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 160px, 220px"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-[#e59b27]/12 blur-3xl" />
      <div className="absolute bottom-24 right-1/4 h-64 w-64 rounded-full bg-[#284629]/10 blur-3xl" />
    </div>
  );
}
