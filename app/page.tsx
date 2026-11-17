'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MedicineTab from '@/components/MedicineExplainer/MedicineTab';
import ReportTab from '@/components/ReportExplainer/ReportTab';
import AssistantTab from '@/components/Assistant/AssistantTab';
import HistoryView from '@/components/HistoryView';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';

// Dynamically import 3D Background with SSR disabled as required
const Background3D = dynamic(() => import('@/components/Background3D'), {
  ssr: false,
});

export default function Home() {
  const [activeTab, setActiveTab] = useState<'medicine' | 'report' | 'assistant' | 'history'>('medicine');
  const [hasScrolledToTool, setHasScrolledToTool] = useState(false);

  const handleSelectFeature = (tab: 'medicine' | 'report' | 'assistant') => {
    setActiveTab(tab);
    setHasScrolledToTool(true);
    // Smooth scroll to the tool workspace
    const el = document.getElementById('tool-workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* 3D Medical Scene Background */}
      <Background3D />

      {/* Main Header with Language & Easy Mode Controls */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Landing Hero Section */}
      <Hero onSelectFeature={handleSelectFeature} />

      {/* Interactive Tool Workspace */}
      <main id="tool-workspace" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-16 pt-4">
        {activeTab === 'medicine' && <MedicineTab />}
        {activeTab === 'report' && <ReportTab />}
        {activeTab === 'assistant' && <AssistantTab />}
        {activeTab === 'history' && <HistoryView onSelectTab={handleSelectFeature} />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Sticky Bottom Nav on Mobile */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
