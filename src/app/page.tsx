
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DraggableWindow } from '@/components/core/DraggableWindow';
import { AboutWindowContent } from '@/components/dashboard/AboutWindowContent';
import { SkillsWindowContent } from '@/components/dashboard/SkillsWindowContent';
import { ProjectsWindowContent } from '@/components/dashboard/ProjectsWindowContent';
import { ContactWindowContent } from '@/components/dashboard/ContactWindowContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserCircle, Layers, FolderKanban, Mail, Dot } from 'lucide-react';

export interface WindowConfig {
  title: string;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: string | number; height: string | number };
  minSize?: { width: number; height: number };
  contentKey: 'about' | 'skills' | 'projects' | 'contact';
  icon: React.ElementType;
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
  { title: 'About Me', contentKey: 'about', defaultPosition: { x: 50, y: 50 }, defaultSize: { width: 480, height: 400 }, minSize: { width: 320, height: 250 }, icon: UserCircle },
  { title: 'Skills & Stack', contentKey: 'skills', defaultPosition: { x: 100, y: 100 }, defaultSize: { width: 420, height: 450 }, minSize: { width: 300, height: 300 }, icon: Layers },
  { title: 'Projects', contentKey: 'projects', defaultPosition: { x: 150, y: 150 }, defaultSize: { width: 650, height: 550 }, minSize: { width: 320, height: 400 }, icon: FolderKanban },
  { title: 'Contact', contentKey: 'contact', defaultPosition: { x: 200, y: 200 }, defaultSize: { width: 430, height: 480 }, minSize: { width: 300, height: 350 }, icon: Mail },
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

  useEffect(() => {
    setWindows(
      initialWindowsSetup.map((cfg, index) => ({
        ...cfg,
        id: uuidv4(),
        content: WindowContentMap[cfg.contentKey],
        currentPosition: cfg.defaultPosition,
        currentSize: cfg.defaultSize,
        zIndex: 10 + index,
        isOpen: false, 
        isMinimized: false,
      }))
    );
  }, []);


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
        return prevWindows.map(w =>
          w.title === title
            ? { ...w,
                isOpen: true,
                isMinimized: false,
                zIndex: newMaxZ,
                currentPosition: !w.isOpen ? winConfig.defaultPosition : w.currentPosition,
                currentSize: !w.isOpen ? winConfig.defaultSize : w.currentSize,
              }
            : w
        );
      } else {
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
        if (!newMinimizedState) { 
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
          currentPosition: { x: 10, y: (index * 40) + 10 }, 
          currentSize: { width: 'calc(100% - 20px)', height: 'auto' }, 
        };
      } else {
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
    <div className="relative min-h-[calc(100vh-8rem)] w-full overflow-auto dashboard-animated-background">
      {/* Container for Draggable Windows */}
      <div className="p-4 md:p-0">
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
      
      {/* Desktop Dock */}
      {!isMobile && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-md p-2 rounded-lg shadow-xl flex space-x-2 z-[1000]">
          {initialWindowsSetup.map(cfg => {
            const winInstance = windows.find(w => w.title === cfg.title);
            const isOpenAndNotMinimized = winInstance && winInstance.isOpen && !winInstance.isMinimized;
            const isMinimized = winInstance && winInstance.isOpen && winInstance.isMinimized;

            let actionVerb = "Open";
            if (isOpenAndNotMinimized) actionVerb = "Focus";
            if (isMinimized) actionVerb = "Restore";
            
            const IconComponent = cfg.icon;

            return (
              <button 
                key={cfg.title} 
                onClick={() => {
                  if (isMinimized && winInstance) {
                    toggleMinimize(winInstance.id);
                  } else {
                    openWindow(cfg.title); 
                  }
                }}
                className="relative p-3 hover:bg-accent/80 rounded-lg text-card-foreground transition-colors flex flex-col items-center w-20 group"
                title={`${actionVerb} ${cfg.title}`}
              >
                <IconComponent className="h-6 w-6 mb-1 text-primary group-hover:text-accent-foreground" />
                <span className="text-xs truncate w-full text-center">{cfg.title}</span>
                {(isOpenAndNotMinimized || isMinimized) && 
                  <Dot className={`absolute -bottom-2 -right-0.5 h-5 w-5 ${isMinimized ? 'text-amber-500' : 'text-green-500'}`} />
                }
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
