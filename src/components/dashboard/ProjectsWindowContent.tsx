"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { projectsData, Project } from '@/data/projects';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, ExternalLink, Search, Lightbulb } from 'lucide-react';
import { AiPrompterDialog } from './AiPrompterDialog';
import { Balancer } from 'react-wrap-balancer';

export function ProjectsWindowContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectForAI, setSelectedProjectForAI] = useState<Project | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure client-side only execution for dialogs
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projectsData;
    return projectsData.filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  const handleOpenAiPrompter = (project: Project) => {
    setSelectedProjectForAI(project);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search projects by title, tag, or keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
      </div>

      {filteredProjects.length === 0 && (
        <p className="text-center text-muted-foreground">No projects found matching your search.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
            {project.imageUrl && (
              <div className="relative w-full h-48">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl"
                  data-ai-hint={project.imageHint || "project technology"}
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                <Balancer>{project.title}</Balancer>
              </CardTitle>
              {project.status && (
                <Badge 
                  variant={project.status === 'completed' ? 'default' : project.status === 'in-progress' ? 'secondary' : 'outline'}
                  className="absolute top-2 right-2 text-xs"
                >
                  {project.status.replace('-', ' ')}
                </Badge>
              )}
              <CardDescription className="text-xs text-muted-foreground h-16 overflow-hidden">
                <Balancer>{project.description}</Balancer>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2 mb-2">
                {project.tags.slice(0, 5).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
                {project.tags.length > 5 && <Badge variant="outline" className="text-xs">...</Badge>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-4">
              <div className="flex space-x-2">
                {project.githubUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-1.5 h-3.5 w-3.5" /> GitHub
                    </a>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Live Demo
                    </a>
                  </Button>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleOpenAiPrompter(project)} title="Get AI Suggestions">
                <Lightbulb className="mr-1.5 h-3.5 w-3.5" /> AI
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {isMounted && selectedProjectForAI && (
        <AiPrompterDialog
          project={selectedProjectForAI}
          isOpen={!!selectedProjectForAI}
          onClose={() => setSelectedProjectForAI(null)}
        />
      )}
    </div>
  );
}
