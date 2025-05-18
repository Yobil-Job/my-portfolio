
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DraggableWindow } from '@/components/core/DraggableWindow';
import { AboutWindowContent } from '@/components/dashboard/AboutWindowContent';
import { SkillsWindowContent } from '@/components/dashboard/SkillsWindowContent';
import { ProjectsWindowContent } from '@/components/dashboard/ProjectsWindowContent';
import { ContactWindowContent } from '@/components/dashboard/ContactWindowContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { Balancer } from 'react-wrap-balancer';

export interface WindowConfig {
  title: string;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: string | number; height: string | number };
  minSize?: { width: number; height: number };
  contentKey: 'about' | 'skills' | 'projects' | 'contact'; // To map to content components
}

export interface WindowInstance extends WindowConfig {
  id: string;
  content: React.ReactNode;
  currentPosition: { x: number; y: number };
  currentSize: { width: string | number; height: string | number };
  zIndex: number;
  isOpen: boolean;
  isMinimized?: boolean;
}

const initialWindowsSetup: WindowConfig[] = [
  { title: 'About Me', contentKey: 'about', defaultPosition: { x: 50, y: 50 }, defaultSize: { width: 480, height: 400 }, minSize: { width: 320, height: 250 } },
  { title: 'Skills & Stack', contentKey: 'skills', defaultPosition: { x: 100, y: 100 }, defaultSize: { width: 420, height: 450 }, minSize: { width: 300, height: 300 } },
  { title: 'Projects', contentKey: 'projects', defaultPosition: { x: 150, y: 150 }, defaultSize: { width: 650, height: 500 }, minSize: { width: 320, height: 400 } },
  { title: 'Contact', contentKey: 'contact', defaultPosition: { x: 200, y: 200 }, defaultSize: { width: 430, height: 480 }, minSize: { width: 300, height: 350 } },
];

const WindowContentMap = {
  about: <AboutWindowContent />,
  skills: <SkillsWindowContent />,
  projects: <ProjectsWindowContent />,
  contact: <ContactWindowContent />,
};

export default function DashboardPage() {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const isMobile = useIsMobile();

  // Initialize windows state from config, but all closed initially
  useEffect(() => {
    setWindows(
      initialWindowsSetup.map((cfg, index) => ({
        ...cfg,
        id: uuidv4(),
        content: WindowContentMap[cfg.contentKey],
        currentPosition: cfg.defaultPosition,
        currentSize: cfg.defaultSize,
        zIndex: 10 + index, // Initial z-index, will be updated on focus
        isOpen: false, // All windows start closed
        isMinimized: false,
      }))
    );
  }, []); // Run once on mount


  const bringToFront = useCallback((id: string) => {
    const newMaxZ = maxZIndex + 1;
    setMaxZIndex(newMaxZ);
    setWindows(prevWindows =>
      prevWindows.map((win) =>
        win.id === id ? { ...win, zIndex: newMaxZ, isMinimized: false } : win
      )
    );
  }, [maxZIndex]);

  const openWindow = useCallback((title: string) => {
    setWindows(prevWindows => {
      const winConfig = initialWindowsSetup.find(cfg => cfg.title === title);
      if (!winConfig) return prevWindows;

      const existingWindow = prevWindows.find(w => w.title === title);
      const newMaxZ = maxZIndex + 1;
      setMaxZIndex(newMaxZ);

      if (existingWindow) {
        // If window exists, open it (if closed/minimized) and bring to front
        return prevWindows.map(w => 
          w.title === title 
            ? { ...w, 
                isOpen: true, 
                isMinimized: false, 
                zIndex: newMaxZ,
                // Reset to default position/size if it was previously closed, or keep current if just minimized
                currentPosition: !w.isOpen ? winConfig.defaultPosition : w.currentPosition,
                currentSize: !w.isOpen ? winConfig.defaultSize : w.currentSize,
              } 
            : w
        );
      } else {
        // This case should ideally not happen if windows state is initialized correctly
        // from initialWindowsSetup. If it does, it means a new window is being created.
        const newWindow: WindowInstance = {
          ...winConfig,
          id: uuidv4(),
          content: WindowContentMap[winConfig.contentKey],
          currentPosition: winConfig.defaultPosition,
          currentSize: winConfig.defaultSize,
          zIndex: newMaxZ,
          isOpen: true,
          isMinimized: false,
        };
        return [...prevWindows, newWindow];
      }
    });
  }, [maxZIndex, setMaxZIndex]);

  const toggleMinimize = useCallback((id: string) => {
    setWindows(prevWindows => prevWindows.map(win => {
      if (win.id === id) {
        const newMinimizedState = !win.isMinimized;
        let newZ = win.zIndex;
        if (!newMinimizedState) { // If restoring
          const newMaxZ = maxZIndex + 1;
          setMaxZIndex(newMaxZ);
          newZ = newMaxZ;
        }
        return {...win, isMinimized: newMinimizedState, zIndex: newZ };
      }
      return win;
    }));
  }, [maxZIndex, setMaxZIndex]);
  
  const closeWindow = useCallback((id: string) => {
     setWindows(prevWindows => prevWindows.map(win => win.id === id ? {...win, isOpen: false} : win));
  }, []);

  const updateWindowPosition = useCallback((id: string, newPosition: { x: number; y: number }) => {
    setWindows(prevWindows =>
      prevWindows.map(win => (win.id === id ? { ...win, currentPosition: newPosition } : win))
    );
  }, []);

  const updateWindowSize = useCallback((id: string, newSize: { width: string | number; height: string | number }) => {
    setWindows(prevWindows =>
      prevWindows.map(win => (win.id === id ? { ...win, currentSize: newSize } : win))
    );
  }, []);

  useEffect(() => {
    if (isMobile === undefined) return;

    setWindows(currentWindows => currentWindows.map((win, index) => {
      if (isMobile) {
        return {
          ...win,
          currentPosition: { x: 0, y: index * 60 }, // Basic stacking for mobile
          currentSize: { width: '100%', height: 'auto' },
        };
      } else {
        // On switch to desktop, if window was open, restore to its default or last desktop size/pos
        // For simplicity, if coming from mobile, reset to default.
        // A more complex state management would be needed to remember desktop pos/size.
        return {
            ...win,
            currentPosition: win.defaultPosition,
            currentSize: win.defaultSize,
        }
      }
    }));
  }, [isMobile]);


  if (isMobile === undefined) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] w-full bg-background dark:bg-dot-white/[0.2] bg-dot-black/[0.2] overflow-auto">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-background bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="p-4 space-y-4 md:p-0 md:space-y-0">
        {windows.filter(w => w.isOpen).map((win) => (
          <DraggableWindow
            key={win.id}
            id={win.id}
            title={win.title}
            initialPosition={win.currentPosition}
            initialSize={win.currentSize}
            minSize={win.minSize}
            zIndex={win.zIndex}
            onDragStop={updateWindowPosition}
            // onResizeStop={updateWindowSize} // Future: Implement resize
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
      
      {!isMobile && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-md p-2 rounded-lg shadow-xl flex space-x-2 z-[1000]">
          {initialWindowsSetup.map(cfg => {
            const winInstance = windows.find(w => w.title === cfg.title);
            const isOpenAndNotMinimized = winInstance && winInstance.isOpen && !winInstance.isMinimized;
            const isMinimized = winInstance && winInstance.isOpen && winInstance.isMinimized;

            let actionText = `Open ${cfg.title}`;
            if (isOpenAndNotMinimized) actionText = `Focus ${cfg.title}`;
            if (isMinimized) actionText = `Restore ${cfg.title}`;
            
            return (
              <button 
                key={cfg.title} 
                onClick={() => {
                  if (isMinimized) {
                    toggleMinimize(winInstance!.id); // Restore and bring to front
                  } else {
                    openWindow(cfg.title); // Opens or brings to front
                  }
                }}
                className="p-2 hover:bg-accent rounded-md text-xs text-card-foreground"
                title={actionText}
              >
                {/* Simple icon representation, could be actual icons later */}
                {cfg.title.substring(0,1)}
                {/* Visual indicator for open/minimized state */}
                {(isOpenAndNotMinimized || isMinimized) && 
                  <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${isMinimized ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                }
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

    