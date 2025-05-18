"use client";

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DraggableWindow } from '@/components/core/DraggableWindow';
import { AboutWindowContent } from '@/components/dashboard/AboutWindowContent';
import { SkillsWindowContent } from '@/components/dashboard/SkillsWindowContent';
import { ProjectsWindowContent } from '@/components/dashboard/ProjectsWindowContent';
import { ContactWindowContent } from '@/components/dashboard/ContactWindowContent';
import { Maximize, Minimize2, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Balancer } from 'react-wrap-balancer';

export interface WindowInstance {
  id: string;
  title: string;
  content: React.ReactNode;
  initialPosition: { x: number; y: number };
  initialSize: { width: string | number; height: string | number };
  minSize?: { width: number; height: number };
  zIndex: number;
  isOpen: boolean;
  isMinimized?: boolean;
}

const initialWindowsConfig: Omit<WindowInstance, 'id' | 'zIndex' | 'isOpen' | 'isMinimized' | 'content'>[] = [
  { title: 'About Me', initialPosition: { x: 50, y: 50 }, initialSize: { width: 450, height: 'auto' }, minSize: { width: 320, height: 200 } },
  { title: 'Skills & Stack', initialPosition: { x: 550, y: 50 }, initialSize: { width: 400, height: 'auto' }, minSize: { width: 300, height: 250 } },
  { title: 'Projects', initialPosition: { x: 50, y: 450 }, initialSize: { width: 600, height: 'auto' }, minSize: { width: 320, height: 300 } },
  { title: 'Contact', initialPosition: { x: 700, y: 400 }, initialSize: { width: 400, height: 'auto' }, minSize: { width: 300, height: 280 } },
];


export default function DashboardPage() {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(10); // Start z-index from 10
  const isMobile = useIsMobile();

  useEffect(() => {
    setWindows(
      initialWindowsConfig.map((win, index) => {
        let content: React.ReactNode;
        switch (win.title) {
          case 'About Me': content = <AboutWindowContent />; break;
          case 'Skills & Stack': content = <SkillsWindowContent />; break;
          case 'Projects': content = <ProjectsWindowContent />; break;
          case 'Contact': content = <ContactWindowContent />; break;
          default: content = <div>Content for {win.title}</div>;
        }
        return {
          ...win,
          id: uuidv4(),
          content,
          zIndex: index + 10, // Initial z-index
          isOpen: true,
          isMinimized: false,
        };
      })
    );
  }, []);


  const bringToFront = (id: string) => {
    const newMaxZ = maxZIndex + 1;
    setMaxZIndex(newMaxZ);
    setWindows(
      windows.map((win) =>
        win.id === id ? { ...win, zIndex: newMaxZ, isMinimized: false } : win
      )
    );
  };

  const toggleMinimize = (id: string) => {
    setWindows(windows.map(win => win.id === id ? {...win, isMinimized: !win.isMinimized} : win));
  };
  
  const closeWindow = (id: string) => {
     setWindows(windows.map(win => win.id === id ? {...win, isOpen: false} : win));
  };

  const openWindow = (title: string) => {
    setWindows(prevWindows => {
      const existingWindow = prevWindows.find(w => w.title === title);
      if (existingWindow && !existingWindow.isOpen) {
        const newMaxZ = maxZIndex + 1;
        setMaxZIndex(newMaxZ);
        return prevWindows.map(w => w.id === existingWindow.id ? {...w, isOpen: true, isMinimized: false, zIndex: newMaxZ} : w);
      }
      return prevWindows;
    });
  };
  
  // Effect to adjust window positions on resize for mobile, or if they go out of bounds
  useEffect(() => {
    if (isMobile === undefined) return; // Wait for isMobile to be defined

    const updatePositions = () => {
      setWindows(currentWindows => currentWindows.map((win, index) => {
        if (isMobile) {
          return {
            ...win,
            initialPosition: { x: 0, y: index * 60 }, // Stack them roughly on mobile
            initialSize: { width: '100%', height: 'auto' },
          };
        }
        // Basic boundary check for desktop (example)
        const newX = Math.max(0, Math.min(win.initialPosition.x, window.innerWidth - (typeof win.initialSize.width === 'number' ? win.initialSize.width : 300)));
        const newY = Math.max(0, Math.min(win.initialPosition.y, window.innerHeight - (typeof win.initialSize.height === 'number' ? win.initialSize.height : 200) - 100)); // -100 for header/footer
        
        return {
          ...win,
          initialPosition: {x: newX, y: newY}
        };
      }));
    };
    updatePositions(); // Initial call
  }, [isMobile]);


  if (isMobile === undefined) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] w-full overflow-hidden bg-background dark:bg-dot-white/[0.2] bg-dot-black/[0.2]">
      {/* Radial gradient for subtle effect */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-background bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="p-4 space-y-4 md:p-0 md:space-y-0">
        {windows.filter(w => w.isOpen).map((win) => (
          <DraggableWindow
            key={win.id}
            id={win.id}
            title={win.title}
            initialPosition={win.initialPosition}
            initialSize={win.initialSize}
            minSize={win.minSize}
            zIndex={win.zIndex}
            onFocus={() => bringToFront(win.id)}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => toggleMinimize(win.id)}
            isMinimized={win.isMinimized}
            isMobile={isMobile}
          >
            {!win.isMinimized && win.content}
          </DraggableWindow>
        ))}
      </div>
      
      {/* Dock/Taskbar for closed windows - simplistic example */}
      {!isMobile && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-md p-2 rounded-lg shadow-xl flex space-x-2">
          {initialWindowsConfig.map(cfg => {
            const winInstance = windows.find(w => w.title === cfg.title);
            if (!winInstance || !winInstance.isOpen) {
              return (
                <button 
                  key={cfg.title} 
                  onClick={() => openWindow(cfg.title)}
                  className="p-2 hover:bg-accent rounded-md text-xs"
                  title={`Open ${cfg.title}`}
                >
                  {cfg.title.substring(0,3)}...
                </button>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}
