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
    githubUrl: "https://github.com/Yobil-Job/PostgreSQL-Cheatsheet", // Replace with your actual URL
    liveUrl: "https://your-postgres-cheatsheet-live-url.example.com", // Replace with your actual URL
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "database code",
    status: 'completed',
  },
  {
    id: "2",
    title: "YouTube Backend Simulation",
    description: "Demonstrates how like/share/subscription data flows into a database using Java, JDBC, and JavaFX for the UI.",
    tags: ["Java", "JDBC", "JavaFX", "Backend", "Database Simulation", "YouTube"],
    githubUrl: "https://github.com/Yobil-Job/YouTube-Backend-Simulation", // Replace with your actual URL
    liveUrl: "https://your-youtube-simulation-live-url.example.com", // Replace with your actual URL (if applicable)
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "social media data",
    status: 'completed',
  },
  {
    id: "3",
    title: "Python Keylogger",
    description: "A desktop tool for logging keystrokes, developed for educational purposes to understand system-level programming.",
    tags: ["Python", "Keylogger", "Desktop Tool", "Security", "Educational"],
    githubUrl: "https://github.com/Yobil-Job/Python-Keylogger", // Replace with your actual URL
    liveUrl: "https://your-python-keylogger-info-page.example.com", // Replace with your actual URL (if applicable, e.g., a project page)
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "security code",
    status: 'completed',
  },
  {
    id: "4",
    title: "Corruption Control System",
    description: "An enterprise-grade system built with Spring Boot to detect and report corruption in government or religious institutions.",
    tags: ["Spring Boot", "Java", "Enterprise System", "Anti-Corruption", "Backend"],
    githubUrl: "https://github.com/Yobil-Job/Corruption-Control-System", // Replace with your actual URL
    liveUrl: "https://your-corruption-control-live-url.example.com", // Replace with your actual URL (if applicable)
    status: 'coming-soon',
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "enterprise system",
  },
];
