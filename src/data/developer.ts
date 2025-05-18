export type DeveloperInfo = {
  name: string;
  title: string;
  bio: string;
  email: string;
  socials: {
    github: string;
    linkedin: string;
  };
  skills: {
    languages: string[];
    databases: string[];
    frameworks: string[];
    others?: string[];
  };
};

export const developerInfo: DeveloperInfo = {
  name: "Eyob Weldetensay",
  title: "Backend Developer (Spring Boot) | Aspiring Cloud Engineer",
  bio: "I'm a software engineering student at Arba Minch University, passionate about backend systems, full-stack development, cloud infrastructure, and AI.",
  email: "eyobwldetensay@gmail.com",
  socials: {
    github: "https://github.com/Yobil-Job",
    linkedin: "https://linkedin.com/in/eyob-weldetensay-a68160254",
  },
  skills: {
    languages: ["Java", "Python", "JavaScript", "C++"],
    databases: ["PostgreSQL", "MySQL"],
    frameworks: ["Spring Boot", "Django"],
    others: ["Docker", "Kubernetes", "AWS", "Git"]
  },
};
