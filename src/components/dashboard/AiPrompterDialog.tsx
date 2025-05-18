"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';
import type { Project } from '@/data/projects';
import { suggestProjectImprovements, type SuggestProjectImprovementsInput, type SuggestProjectImprovementsOutput } from '@/ai/flows/suggest-project-improvements';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

interface AiPrompterDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function AiPrompterDialog({ project, isOpen, onClose }: AiPrompterDialogProps) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [tags, setTags] = useState(project.tags.join(', '));
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestProjectImprovementsOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const input: SuggestProjectImprovementsInput = {
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };
      const result = await suggestProjectImprovements(input);
      setSuggestions(result);
      toast({
        title: "AI Suggestions Generated!",
        description: "Check out the improved title, description, and tags.",
      });
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state if needed, or on open
    // setTitle(project.title);
    // setDescription(project.description);
    // setTags(project.tags.join(', '));
    // setSuggestions(null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            AI Project Optimizer for: {project.title}
          </DialogTitle>
          <DialogDescription>
            Get AI-powered suggestions to improve your project's title, description, and tags for better discoverability.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-2">
            <Label htmlFor="ai-title">Current Title</Label>
            <Input id="ai-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-description">Current Description</Label>
            <Textarea id="ai-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-tags">Current Tags (comma-separated)</Label>
            <Input id="ai-tags" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>

          {suggestions && (
            <div className="mt-6 p-4 border rounded-md bg-muted/50 space-y-4">
              <h4 className="font-semibold text-lg text-primary">AI Suggestions:</h4>
              <div>
                <Label className="font-medium">Suggested Title:</Label>
                <p className="text-sm p-2 bg-background rounded-md">{suggestions.suggestedTitle}</p>
              </div>
              <div>
                <Label className="font-medium">Suggested Description:</Label>
                <p className="text-sm p-2 bg-background rounded-md whitespace-pre-wrap">{suggestions.suggestedDescription}</p>
              </div>
              <div>
                <Label className="font-medium">Suggested Tags:</Label>
                <div className="flex flex-wrap gap-2 mt-1 p-2 bg-background rounded-md">
                  {suggestions.suggestedTags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>&lt;Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
            ) : (
              <>&lt;Sparkles className="mr-2 h-4 w-4" /> Get Suggestions</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
