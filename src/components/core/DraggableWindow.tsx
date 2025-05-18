"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DraggableWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  initialSize: { width: string | number; height: string | number };
  minSize?: { width: number; height: number };
  zIndex: number;
  onFocus: () => void;
  onClose: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  isMobile?: boolean;
}

export function DraggableWindow({
  id,
  title,
  children,
  initialPosition,
  initialSize,
  minSize = {width: 200, height: 150},
  zIndex,
  onFocus,
  onClose,
  onMinimize,
  isMinimized,
  isMobile,
}: DraggableWindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const constraintsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If mobile, use full width and auto height, and reset position
    if (isMobile) {
      setPosition({ x: 0, y: 0 }); // Position will be handled by flex/grid in parent
      setSize({ width: '100%', height: 'auto' });
    } else {
      setPosition(initialPosition);
      setSize(initialSize);
    }
  }, [isMobile, initialPosition, initialSize]);

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isMobile) return; // Disable dragging on mobile
    setPosition({
      x: position.x + info.delta.x,
      y: position.y + info.delta.y,
    });
  };

  if (isMobile) {
    // Render as a static card on mobile
    return (
      <div
        id={id}
        className="mb-4 w-full rounded-2xl bg-card shadow-2xl flex flex-col"
        style={{ minHeight: typeof minSize.height === 'number' ? minSize.height : 'auto' }}
        onClick={onFocus} // Still bring to front conceptually if needed for other interactions
      >
        <header className="flex items-center justify-between p-3 border-b window-header-gradient rounded-t-2xl">
          <h2 className="font-semibold text-sm truncate text-card-foreground">{title}</h2>
          <div className="flex items-center space-x-1">
            {onMinimize && (
              <Button variant="ghost" size="icon" onClick={onMinimize} className="h-6 w-6">
                <Minimize2 className="h-3 w-3" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 hover:bg-destructive/80">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </header>
        {!isMinimized && (
          <ScrollArea className={cn("p-4 flex-grow", typeof size.height === 'number' && size.height < 200 ? "h-auto" : "max-h-[60vh]")} style={{ height: isMinimized ? 0 : 'auto' }}>
            {children}
          </ScrollArea>
        )}
      </div>
    );
  }

  // Desktop draggable window
  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none" />
      <motion.div
        id={id}
        drag={!isMobile && !isMinimized}
        dragControls={undefined} // Using default drag
        dragListener={!isMobile && !isMinimized} // Only listen to drag if not mobile/minimized
        dragMomentum={false}
        onDrag={handleDrag}
        initial={false} // Do not animate on initial render using Framer's initial
        animate={{ x: position.x, y: position.y, width: size.width, height: isMinimized ? 40 : size.height }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          zIndex,
          position: 'absolute',
          minWidth: minSize.width,
          minHeight: isMinimized ? 'auto' : minSize.height,
        }}
        className="rounded-2xl bg-card shadow-2xl flex flex-col overflow-hidden border"
        onMouseDown={onFocus}
        onTouchStart={onFocus}
      >
        <motion.header
          className="flex items-center justify-between p-2 cursor-grab active:cursor-grabbing border-b window-header-gradient rounded-t-2xl"
        >
          <h2 className="font-semibold text-sm truncate text-card-foreground pl-2">{title}</h2>
          <div className="flex items-center space-x-1">
            {onMinimize && (
              <Button variant="ghost" size="icon" onClick={onMinimize} className="h-6 w-6">
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 hover:bg-destructive/80">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </motion.header>
        {!isMinimized && (
           <ScrollArea className="p-4 flex-grow" style={{height: typeof size.height === 'number' && !isNaN(size.height) ? size.height - 40 : 'auto'}}>
            {children}
          </ScrollArea>
        )}
      </motion.div>
    </>
  );
}
