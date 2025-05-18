
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, HelpCircle } from 'lucide-react';
import type { Project } from '@/data/projects';
import { answerProjectQuestion, type AnswerProjectQuestionInput, type AnswerProjectQuestionOutput } from '@/ai/flows/answer-project-question';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface AiPrompterDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function AiPrompterDialog({ project, isOpen, onClose }: AiPrompterDialogProps) {
  const [userQuestion, setUserQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!userQuestion.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question about the project.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setAiAnswer(null);
    try {
      const input: AnswerProjectQuestionInput = {
        projectTitle: project.title,
        projectDescription: project.description,
        projectTags: project.tags,
        userQuestion: userQuestion,
      };
      const result = await answerProjectQuestion(input);
      setAiAnswer(result.answer);
      toast({
        title: "AI Answer Received!",
        description: "The AI has responded to your question.",
      });
    } catch (error) {
      console.error("Error fetching AI answer:", error);
      let errorMessage = "Failed to get an answer from the AI. Please try again.";
      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setUserQuestion('');
    setAiAnswer(null);
    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-primary" />
            Ask AI About: {project.title}
          </DialogTitle>
          <DialogDescription>
            Ask questions about this project, and the AI will answer based on its details.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow pr-2 custom-scrollbar -mr-2">
          <div className="grid gap-4 py-4 ">
            <div className="p-3 border rounded-md bg-muted/30 space-y-2">
              <h4 className="font-semibold text-sm text-foreground">Project Context:</h4>
              <p className="text-xs text-muted-foreground"><strong>Title:</strong> {project.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-3"><strong>Description:</strong> {project.description}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {project.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-question">Your Question</Label>
              <Textarea 
                id="user-question" 
                value={userQuestion} 
                onChange={(e) => setUserQuestion(e.target.value)} 
                placeholder={`e.g., What technologies does "${project.title}" use?`}
                rows={3} 
              />
            </div>

            {aiAnswer && (
              <div className="mt-4 p-3 border rounded-md bg-muted/50 space-y-2">
                <h4 className="font-semibold text-sm text-primary flex items-center">
                  <Sparkles className="h-4 w-4 mr-1.5" /> AI's Answer:
                </h4>
                <p className="text-sm text-foreground whitespace-pre-wrap">{aiAnswer}</p>
              </div>
            )}
             {isLoading && !aiAnswer && (
              <div className="mt-4 p-3 flex items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Thinking...
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-auto pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading || !userQuestion.trim()}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Asking AI...</>
            ) : (
              <><HelpCircle className="mr-2 h-4 w-4" /> Ask AI</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
