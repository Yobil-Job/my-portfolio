"use client";

import { Github, Linkedin, Mail } from 'lucide-react';
import { developerInfo } from '@/data/developer';

export function Footer() {
  return (
    <footer className="border-t bg-background/80">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {developerInfo.name}. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <a
            href={developerInfo.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={developerInfo.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href={`mailto:${developerInfo.email}`}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
