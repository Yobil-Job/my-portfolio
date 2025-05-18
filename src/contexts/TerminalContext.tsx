"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { developerInfo } from '@/data/developer';
import { projectsData } from '@/data/projects';

interface TerminalOutput {
  id: string;
  text: string | ReactNode;
  type: 'input' | 'output' | 'error' | 'system';
}

interface TerminalContextType {
  isOpen: boolean;
  toggleTerminal: () => void;
  history: TerminalOutput[];
  addHistory: (output: Omit<TerminalOutput, 'id'>) => void;
  clearHistory: () => void;
  executeCommand: (command: string) => void;
  commandHistory: string[];
  currentCommandIndex: number;
  setCurrentCommandIndex: React.Dispatch<React.SetStateAction<number>>;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "There are 10 types of people in the world: those who understand binary, and those who don't.",
  "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
  "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
  "!false (It's funny because it's true).",
];

export const HiddenTerminalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<TerminalOutput[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(-1);

  const toggleTerminal = useCallback(() => setIsOpen(prev => !prev), []);

  const addHistory = useCallback((output: Omit<TerminalOutput, 'id'>) => {
    setHistory(prev => [...prev, { ...output, id: Date.now().toString() + Math.random().toString() }]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    addHistory({ text: 'Terminal cleared.', type: 'system'});
  }, [addHistory]);

  const executeCommand = useCallback((command: string) => {
    addHistory({ text: `> ${command}`, type: 'input' });

    if (command.trim() !== "") {
      setCommandHistory(prev => {
        const newHistory = [...prev.filter(c => c !== command), command];
        // Store in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('terminalCommandHistory', JSON.stringify(newHistory.slice(-50))); // Store last 50
        }
        return newHistory;
      });
      setCurrentCommandIndex(-1); // Reset index after new command
    }

    const [cmd, ...args] = command.toLowerCase().trim().split(' ');

    switch (cmd) {
      case 'help':
        addHistory({ text: (
          <div>
            Available commands:
            <ul className="list-disc list-inside ml-4">
              <li><span className="text-primary">help</span>: Show this help message.</li>
              <li><span className="text-primary">whoami</span>: Display developer information.</li>
              <li><span className="text-primary">connect</span>: Show contact links.</li>
              <li><span className="text-primary">projects</span>: List available projects.</li>
              <li><span className="text-primary">project</span> &lt;id|name&gt;: Show details for a specific project.</li>
              <li><span className="text-primary">skills</span>: List developer skills.</li>
              <li><span className="text-primary">joke</span>: Tell a developer joke.</li>
              <li><span className="text-primary">clear</span>: Clear the terminal screen.</li>
              <li><span className="text-primary">date</span>: Show current date and time.</li>
              <li><span className="text-primary">exit</span>: Close the terminal.</li>
            </ul>
          </div>
        ), type: 'output' });
        break;
      case 'whoami':
        addHistory({ text: `${developerInfo.name} - ${developerInfo.title}`, type: 'output' });
        addHistory({ text: developerInfo.bio, type: 'output' });
        break;
      case 'connect':
        addHistory({ text: (
          <div>
            Connect with {developerInfo.name}:
            <ul className="list-disc list-inside ml-4">
              <li>Email: <a href={`mailto:${developerInfo.email}`} className="text-primary hover:underline">{developerInfo.email}</a></li>
              <li>GitHub: <a href={developerInfo.socials.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{developerInfo.socials.github}</a></li>
              <li>LinkedIn: <a href={developerInfo.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{developerInfo.socials.linkedin}</a></li>
            </ul>
          </div>
        ), type: 'output' });
        break;
      case 'projects':
        addHistory({ text: 'Available projects:', type: 'output' });
        projectsData.forEach(p => addHistory({ text: `- ${p.title} (ID: ${p.id})`, type: 'output' }));
        break;
      case 'project':
        const projectNameOrId = args.join(' ').toLowerCase();
        const project = projectsData.find(p => p.id.toLowerCase() === projectNameOrId || p.title.toLowerCase().includes(projectNameOrId));
        if (project) {
            addHistory({text: `Project: ${project.title}`, type: 'output'});
            addHistory({text: `Description: ${project.description}`, type: 'output'});
            addHistory({text: `Tags: ${project.tags.join(', ')}`, type: 'output'});
            if(project.githubUrl) addHistory({text: `GitHub: ${project.githubUrl}`, type: 'output'});
        } else {
            addHistory({text: `Project '${args.join(' ')}' not found.`, type: 'error'});
        }
        break;
      case 'skills':
        addHistory({ text: 'Skills:', type: 'output'});
        addHistory({ text: `Languages: ${developerInfo.skills.languages.join(', ')}`, type: 'output'});
        addHistory({ text: `Databases: ${developerInfo.skills.databases.join(', ')}`, type: 'output'});
        addHistory({ text: `Frameworks: ${developerInfo.skills.frameworks.join(', ')}`, type: 'output'});
        if(developerInfo.skills.others) addHistory({ text: `Others: ${developerInfo.skills.others.join(', ')}`, type: 'output'});
        break;
      case 'joke':
        addHistory({ text: JOKES[Math.floor(Math.random() * JOKES.length)], type: 'output' });
        break;
      case 'clear':
        clearHistory();
        break;
      case 'date':
        addHistory({text: new Date().toLocaleString(), type: 'output'});
        break;
      case 'exit':
        toggleTerminal();
        break;
      default:
        if (command.trim() !== "") {
            addHistory({ text: `Command not found: ${command}. Type 'help' for a list of commands.`, type: 'error' });
        }
    }
  }, [addHistory, clearHistory, toggleTerminal]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedHistory = localStorage.getItem('terminalCommandHistory');
      if (storedHistory) {
        setCommandHistory(JSON.parse(storedHistory));
      }
    }
    addHistory({text: "Welcome to Eyob's Interactive Terminal! Type 'help' for commands.", type: 'system'})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount


  // Keyboard shortcut for opening/closing terminal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === '~') {
        event.preventDefault();
        toggleTerminal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTerminal]);

  return (
    <TerminalContext.Provider value={{ isOpen, toggleTerminal, history, addHistory, clearHistory, executeCommand, commandHistory, currentCommandIndex, setCurrentCommandIndex }}>
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error('useTerminal must be used within a HiddenTerminalProvider');
  }
  return context;
};
