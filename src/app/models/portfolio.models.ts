export type SocialLinkKind = 'email' | 'linkedin' | 'github';

export interface SocialLink {
  kind: SocialLinkKind;
  label: string;
  url: string;
}

export interface Profile {
  displayName: string;
  headline: string;
  summary: string;
  portraitUrl: string;
  avatarUrl: string;
  /** Only set once a real resume file has been approved for publication. */
  resumeUrl?: string;
  socialLinks: SocialLink[];
}

/** ISO 8601 year-month, e.g. `2021-06`. */
export type YearMonth = string;

export interface Experience {
  company: string;
  role: string;
  startDate: YearMonth;
  /** Omitted for the current role. */
  endDate?: YearMonth;
  contributions: string[];
}

export type SkillProficiency = 'beginner' | 'intermediate' | 'advanced';

export interface Skill {
  name: string;
  proficiency: SkillProficiency;
}

export interface SkillGroup {
  title: string;
  skills: Skill[];
}

export interface Project {
  title: string;
  description: string;
  contributions: string[];
  technologies: string[];
  /** Only set when a verified public link exists. */
  url?: string;
}

export interface Education {
  degree: string;
  institution: string;
  startDate: YearMonth;
  endDate?: YearMonth;
}

export interface PortfolioContent {
  profile: Profile;
  experience: Experience[];
  skillGroups: SkillGroup[];
  projects: Project[];
  education: Education[];
}
