"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CornerDownLeft, ArrowUp, ArrowDown, ChevronsRight } from 'lucide-react';
import { useTerminal } from '@/contexts/TerminalContext';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

export function HiddenTerminal() {
  const { isOpen, toggleTerminal, history, executeCommand, commandHistory, currentCommandIndex, setCurrentCommandIndex } = useTerminal();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if(scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      executeCommand(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = currentCommandIndex >= commandHistory.length -1 ? commandHistory.length -1 : currentCommandIndex + 1;
        setCurrentCommandIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length > 0 && currentCommandIndex > -1) {
        const newIndex = currentCommandIndex <= 0 ? -1 : currentCommandIndex -1;
        setCurrentCommandIndex(newIndex);
        setInputValue(newIndex === -1 ? '' : commandHistory[commandHistory.length - 1 - newIndex] || '');

      }
    } else if (e.key === 'Tab') {
        // Basic autocomplete POC (e.g., for 'help' or 'projects')
        e.preventDefault();
        const commonCommands = ['help', 'whoami', 'projects', 'skills', 'contact', 'clear', 'exit', 'joke', 'date'];
        const currentInputLower = inputValue.toLowerCase();
        const match = commonCommands.find(cmd => cmd.startsWith(currentInputLower));
        if (match) {
            setInputValue(match + " ");
        }
    }
  };
  
  const getOutputStyle = (type: string) => {
    switch(type) {
        case 'input': return 'text-primary';
        case 'error': return 'text-destructive';
        case 'system': return 'text-muted-foreground italic';
        default: return 'text-foreground';
    }
  }


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          className="fixed inset-x-0 bottom-0 h-1/2 md:h-1/3 bg-card/95 backdrop-blur-md shadow-2xl border-t z-[100] flex flex-col rounded-t-2xl overflow-hidden"
          onClick={() => inputRef.current?.focus()}
        >
          <header className="flex items-center justify-between p-3 border-b bg-card/70">
            <div className="flex items-center space-x-2">
              <ChevronsRight className="h-5 w-5 text-primary" />
              <h3 className="font-mono text-sm font-semibold">TERMINAL</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleTerminal} className="h-7 w-7">
              <X className="h-4 w-4" />
            </Button>
          </header>

          <ScrollArea className="flex-grow p-4 font-mono text-xs custom-scrollbar" ref={scrollAreaRef}>
            {history.map((item) => (
              <div key={item.id} className={cn("mb-1 whitespace-pre-wrap break-words", getOutputStyle(item.type))}>
                {typeof item.text === 'string' ? item.text.split('\n').map((line, i) => <div key={i}>{line}</div>) : item.text}
              </div>
            ))}
             <div ref={scrollAreaRef} /> {/* Anchor for scrolling */}
          </ScrollArea>

          <form onSubmit={handleSubmit} className="flex items-center p-3 border-t bg-card/70">
            <ChevronsRight className="h-5 w-5 text-primary mr-2 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow bg-transparent text-foreground placeholder-muted-foreground focus:outline-none font-mono text-sm"
              placeholder="Type a command (or 'help')..."
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
            />
            <Button type="submit" variant="ghost" size="icon" className="ml-2 h-7 w-7">
              <CornerDownLeft className="h-4 w-4" />
            </Button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
