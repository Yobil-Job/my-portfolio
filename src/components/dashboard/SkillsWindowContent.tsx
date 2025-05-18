"use client";

import { developerInfo } from '@/data/developer';
import { Badge } from '@/components/ui/badge';
import { Code, Database, Settings2, ToyBrick, BrainCircuit } from 'lucide-react'; // Added BrainCircuit for AI
import { Balancer } from 'react-wrap-balancer';

const skillIcons: { [key: string]: React.ElementType } = {
  Java: () => <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2v-2zm0 3h2v7h-2v-7z"/></svg>, // Generic icon
  Python: () => <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19.224 10.368q.336 0 .552.24.24.24.24.576v.816q0 .336-.24.552t-.552.24h-1.296v2.688q0 .336-.216.576t-.576.24H6.264q-.336 0-.576-.24t-.216-.576v-8.784q0-.336.216-.576t.576.24h11.808q.336 0 .576.216t.216.576v3.312h.576zm-6.168 5.448h4.32V6.312h-9.6v3.216h5.28v6.288z"/></svg>, // Generic icon
  JavaScript: () => <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM9 9h2v6H9V9zm4 0h2v6h-2V9z"/></svg>, // Generic icon
  "C++": () => <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3-3h6v-2h-6v2zm0-4h6v-2h-6v2zm0-4h6V7h-6v2z"/></svg>, // Generic icon
  PostgreSQL: Database,
  MySQL: Database,
  "Spring Boot": Settings2,
  Django: Settings2,
  Docker: ToyBrick,
  Kubernetes: ToyBrick,
  AWS: ToyBrick,
  Git: ToyBrick,
  AI: BrainCircuit,
};

const SkillCategory = ({ title, skills, icon: CategoryIcon }: { title: string; skills: string[]; icon: React.ElementType }) => (
  <div className="space-y-2">
    <h4 className="flex items-center text-md font-semibold text-foreground">
      <CategoryIcon className="h-5 w-5 mr-2 text-primary" />
      <Balancer>{title}</Balancer>
    </h4>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => {
        const Icon = skillIcons[skill] || Code;
        return (
          <Badge key={skill} variant="secondary" className="flex items-center text-xs sm:text-sm px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Icon />
            <span>{skill}</span>
          </Badge>
        );
      })}
    </div>
  </div>
);

export function SkillsWindowContent() {
  return (
    <div className="space-y-6 text-sm">
      <SkillCategory title="Programming Languages" skills={developerInfo.skills.languages} icon={Code} />
      <SkillCategory title="Databases" skills={developerInfo.skills.databases} icon={Database} />
      <SkillCategory title="Frameworks &amp; Libraries" skills={developerInfo.skills.frameworks} icon={Settings2} />
      {developerInfo.skills.others && developerInfo.skills.others.length > 0 && (
         <SkillCategory title="Cloud &amp; DevOps" skills={developerInfo.skills.others} icon={ToyBrick} />
      )}
      <SkillCategory title="Interests" skills={["Cloud Infrastructure", "AI/ML", "Full-Stack Development"]} icon={BrainCircuit} />
    </div>
  );
}
