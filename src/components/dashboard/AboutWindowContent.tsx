"use client";

import { developerInfo } from '@/data/developer';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Briefcase, GraduationCap, Mail, Github, Linkedin } from 'lucide-react';
import { Balancer } from 'react-wrap-balancer';

export function AboutWindowContent() {
  return (
    <div className="space-y-6 text-sm">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2 ring-offset-background">
        <div className="w-24 h-24 rounded-full overflow-hidden">
  <AvatarImage src="/images/developer.jpg" alt={developerInfo.name} className="object-cover w-full h-full" />
</div>

          <AvatarFallback>{developerInfo.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h3 className="text-2xl font-bold text-foreground">
            <Balancer>{developerInfo.name}</Balancer>
          </h3>
          <p className="text-primary">
            <Balancer>{developerInfo.title}</Balancer>
          </p>
        </div>
      </div>

      <p className="text-muted-foreground leading-relaxed">
        <Balancer>{developerInfo.bio}</Balancer>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="flex items-center space-x-3">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="text-foreground">Student at Arba Minch University</span>
        </div>
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-primary" />
          <a href={`mailto:${developerInfo.email}`} className="hover:underline text-foreground">
            {developerInfo.email}
          </a>
        </div>
        <div className="flex items-center space-x-3">
          <Github className="h-5 w-5 text-primary" />
          <a href={developerInfo.socials.github} target="_blank" rel="noopener noreferrer" className="hover:underline text-foreground">
            GitHub Profile
          </a>
        </div>
        <div className="flex items-center space-x-3">
          <Linkedin className="h-5 w-5 text-primary" />
          <a href={developerInfo.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline text-foreground">
            LinkedIn Profile
          </a>
        </div>
      </div>
    </div>
  );
}
