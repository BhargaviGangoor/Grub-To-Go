"use client";

import LandingView from "@/components/landing/LandingView";

export default function Page(){
  const handleNavigate =(view:string)=>{
    console.log(`Would navigate to: ${view}`);
  };
  return (
    <main>
      <LandingView onNavigate={handleNavigate} />
    </main>
  );
  }
