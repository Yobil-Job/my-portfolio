
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  onDragStop: (id: string, position: { x: number; y: number }) => void;
  // onResizeStop: (id: string, size: { width: number; height: number }) => void; // Future
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
  onDragStop,
  // onResizeStop,
  isMinimized,
  isMobile,
}: DraggableWindowProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  // Framer Motion will control its internal x/y based on `initialPosition` via the `style` prop.
  // We only update the parent's state (`currentPosition`) via `onDragStop`.

  // This useEffect updates Framer Motion's understanding of initial/current position
  // ONLY when the prop from the parent changes (e.g., mobile toggle, programmatic move).
  // It does not set local state that would conflict with Framer Motion's drag updates.
  const [motionPosition, setMotionPosition] = useState(initialPosition);
  const [motionSize, setMotionSize] = useState(initialSize);

  useEffect(() => {
    setMotionPosition(initialPosition);
  }, [initialPosition]);

  useEffect(() => {
    setMotionSize(initialSize);
  }, [initialSize]);


  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Calculate the new position based on the drag offset and the position *when the drag started*.
    // `motionPosition` reflects the position at the start of this effect cycle, which is what `x` and `y` in `style` are based on.
    const newX = motionPosition.x + info.offset.x;
    const newY = motionPosition.y + info.offset.y;
    onDragStop(id, { x: newX, y: newY });
    // Update motionPosition for the next render cycle AFTER parent updates, if needed, or rely on prop changes.
    // For now, the parent will update initialPosition which flows back down.
  }, [id, motionPosition, onDragStop]);


  if (isMobile) {
    // Render as a static card on mobile
    return (
      <div
        id={id}
        className="mb-4 w-full rounded-2xl bg-card shadow-2xl flex flex-col"
        style={{ minHeight: typeof minSize.height === 'number' ? minSize.height : 'auto' }}
        onClick={onFocus} // Ensure focus brings to front for mobile if multiple items stack weirdly
      >
        <header className="flex items-center justify-between p-3 border-b window-header-gradient rounded-t-2xl">
          <h2 className="font-semibold text-sm truncate text-card-foreground">{title}</h2>
          <div className="flex items-center space-x-1">
            {/* No minimize/maximize on mobile for simplicity, just close */}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 hover:bg-destructive/80">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </header>
        {/* Mobile doesn't have minimization in this simplified version */}
        <ScrollArea className={cn("p-4 flex-grow", typeof initialSize.height === 'number' && initialSize.height < 200 ? "h-auto" : "max-h-[60vh]")} style={{ height: 'auto' }}>
          {children}
        </ScrollArea>
      </div>
    );
  }

  // Desktop draggable window
  return (
    <>
      {/* Constraints div needs to cover the scrollable area of page.tsx now */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none" />
      <motion.div
        id={id}
        drag={!isMobile && !isMinimized} // Only allow drag on desktop when not minimized
        dragConstraints={constraintsRef}
        dragMomentum={false} // Recommended for more predictable direct manipulation
        onDragEnd={handleDragEnd}
        style={{
          position: 'absolute', // Important for constraintsRef to work relative to page
          x: motionPosition.x,
          y: motionPosition.y,
          zIndex,
          minWidth: minSize.width,
          minHeight: isMinimized ? 'auto' : minSize.height,
        }}
        animate={{ // Animate size changes (like minimize/restore) and programmatic position changes
          x: motionPosition.x,
          y: motionPosition.y,
          width: motionSize.width,
          height: isMinimized ? 40 : motionSize.height, // Minimized height is fixed
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="rounded-2xl bg-card shadow-2xl flex flex-col overflow-hidden border"
        onMouseDown={onFocus} // Bring to front on click
        onTouchStart={onFocus} // Bring to front on touch
      >
        <motion.header
          className="flex items-center justify-between p-2 cursor-grab active:cursor-grabbing border-b window-header-gradient rounded-t-2xl"
          // No drag on header if window is minimized
          onPointerDown={(e) => { if (isMinimized) e.stopPropagation(); }}
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
           <ScrollArea 
             className="p-4 flex-grow" 
             style={{
               height: typeof motionSize.height === 'number' && !isNaN(motionSize.height) && motionSize.height > 40 
                 ? motionSize.height - 40 /* header height approx */ 
                 : 'auto',
             }}
           >
            {children}
          </ScrollArea>
        )}
      </motion.div>
    </>
  );
}

    