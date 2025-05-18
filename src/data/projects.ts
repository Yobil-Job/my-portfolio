export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  status?: 'completed' | 'in-progress' | 'coming-soon';
  imageHint?: string;
};

export const projectsData: Project[] = [
  {
    id: "1",
    title: "PostgreSQL Cheatsheet Website",
    description: "Fast SQL reference with a playground for developers and students. Built with Next.js and Tailwind CSS.",
    tags: ["PostgreSQL", "SQL", "Cheatsheet", "Next.js", "Web Development", "Playground"],
    githubUrl: "https://github.com/Yobil-Job/PostgreSQL-Cheatsheet", // Example URL
    liveUrl: "https://postgres-cheatsheet.example.com", // Example URL
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "database code",
    status: 'completed',
  },
  {
    id: "2",
    title: "YouTube Backend Simulation",
    description: "Demonstrates how like/share/subscription data flows into a database using Java, JDBC, and JavaFX for the UI.",
    tags: ["Java", "JDBC", "JavaFX", "Backend", "Database Simulation", "YouTube"],
    githubUrl: "https://github.com/Yobil-Job/YouTube-Backend-Simulation", // Example URL
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "social media data",
    status: 'completed',
  },
  {
    id: "3",
    title: "Python Keylogger",
    description: "A desktop tool for logging keystrokes, developed for educational purposes to understand system-level programming.",
    tags: ["Python", "Keylogger", "Desktop Tool", "Security", "Educational"],
    githubUrl: "https://github.com/Yobil-Job/Python-Keylogger", // Example URL
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "security code",
    status: 'completed',
  },
  {
    id: "4",
    title: "Corruption Control System",
    description: "An enterprise-grade system built with Spring Boot to detect and report corruption in government or religious institutions.",
    tags: ["Spring Boot", "Java", "Enterprise System", "Anti-Corruption", "Backend"],
    status: 'coming-soon',
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "enterprise system",
  },
];
