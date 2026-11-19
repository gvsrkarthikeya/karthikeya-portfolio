import { PortfolioContent } from '../../models';

/**
 * Sourced only from the owner's resume. Do not add phone numbers,
 * invented metrics or skill levels that the resume does not state.
 */
export const PORTFOLIO_CONTENT: PortfolioContent = {
  profile: {
    displayName: 'GVSR Karthikeya',
    headline: 'Senior UI Engineer at Teradata',
    summary:
      'Senior UI Engineer with 6 years of experience building scalable web and hybrid mobile ' +
      'applications with Angular and React, including micro-frontend architectures. I own ' +
      'features end to end, from architectural design to delivery, and use AI-driven workflows ' +
      'for feature implementation, bug fixing, code reviews and testing.',
    portraitUrl: '',
    avatarUrl: '',
    resumeUrl: 'resume/Karthikeya_Resume.pdf',
    socialLinks: [
      { kind: 'email', label: 'Email', url: 'mailto:gvsrkarthikeya@gmail.com' },
      {
        kind: 'linkedin',
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/gvsr-karthikeya-a251b91a4/',
      },
      { kind: 'github', label: 'GitHub', url: 'https://github.com/gvsrkarthikeya' },
    ],
  },
  experience: [
    {
      company: 'Teradata',
      role: 'Senior UI Engineer',
      startDate: '2026-05',
      contributions: [
        'Build features within a Module Federation micro-frontend architecture.',
        'Lead architectural design and end-to-end feature delivery in collaboration with UX and backend teams.',
        'Design AI workflows that automate feature implementation, bug fixing, code reviews and testing.',
      ],
    },
    {
      company: 'GE Healthcare',
      role: 'Software Engineer',
      startDate: '2022-06',
      endDate: '2026-05',
      contributions: [
        'Delivered hospital web applications and a hybrid mobile app in an Agile team.',
        'Owned features from architectural design to delivery and conducted code reviews.',
        'Built proofs of concept and worked closely with product owners and UX.',
        'Managed Android and iOS build releases and wrote DevOps automation scripts.',
      ],
    },
    {
      company: 'Prokarma Softech',
      role: 'Software Engineer',
      startDate: '2020-12',
      endDate: '2022-06',
      contributions: [
        'Developed backend services in a Spring Boot microservice architecture.',
        'Fixed bugs across backend services.',
      ],
    },
  ],
  skillGroups: [
    {
      title: 'Frontend',
      skills: [
        { name: 'Angular' },
        { name: 'React' },
        { name: 'TypeScript' },
        { name: 'JavaScript' },
        { name: 'HTML' },
        { name: 'CSS' },
        { name: 'Bootstrap' },
        { name: 'Media Queries' },
      ],
    },
    { title: 'Backend', skills: [{ name: 'Spring Boot' }, { name: 'Node.js' }] },
    { title: 'Programming Languages', skills: [{ name: 'Java' }, { name: 'Python' }] },
    {
      title: 'Tools',
      skills: [
        { name: 'Git' },
        { name: 'Jira' },
        { name: 'Confluence' },
        { name: 'Rally' },
        { name: 'Azure' },
      ],
    },
  ],
  projects: [
    {
      title: 'MCP Configuration Platform',
      organization: 'Teradata',
      description:
        'A platform for creating and configuring tools and databases used to build MCP servers.',
      contributions: [
        'Led architectural design and development.',
        'Delivered features end to end with UX and backend teams.',
      ],
      technologies: ['Angular 22'],
    },
    {
      title: 'Database Lifecycle Management',
      organization: 'Teradata',
      description: 'Backup, restore and copy capabilities for databases.',
      contributions: [
        'Developed UI features for backup, restore and copy.',
        'Fixed defects and improved overall quality.',
      ],
      technologies: ['Angular 22'],
    },
    {
      title: 'AI-Driven Workspace Management Platform',
      organization: 'Teradata',
      description:
        'A workspace platform for managing files and folders, initializing Git and running apps, ' +
        'notebooks and SQL cells.',
      contributions: [
        'Designed AI workflows that automate the software development lifecycle.',
        'Built orchestration for feature implementation, bug fixing, code reviews and testing.',
      ],
      technologies: ['React', 'AI workflow development'],
    },
    {
      title: 'Hospital Web Application: Real-Time Anaesthesia Data',
      organization: 'GE Healthcare',
      description:
        'Streams anaesthesia machine data in real time to improve operating room efficiency.',
      contributions: ['Led architectural design.', 'Owned features from design to delivery.'],
      technologies: ['Angular 21', 'Bootstrap 5'],
    },
    {
      title: 'Hospital Web Application: Clinical and Financial Goals',
      organization: 'GE Healthcare',
      description: 'Helps hospitals track and meet clinical and financial goals.',
      contributions: [
        'Developed features and fixed issues.',
        'Built proofs of concept with the product owner and UX.',
        'Conducted code reviews.',
      ],
      technologies: ['Angular 21', 'Bootstrap 5', 'Node.js', 'Media Queries', 'Azure'],
    },
    {
      title: 'Hybrid Mobile App and Admin Page',
      organization: 'GE Healthcare',
      description:
        'A hybrid mobile app for continuous anaesthesia data streaming, with an admin web page.',
      contributions: [
        'Integrated UI features and ran R&D and proofs of concept.',
        'Released Android and iOS builds.',
        'Wrote DevOps automation scripts to replace manual infrastructure setup.',
      ],
      technologies: ['Angular 21', 'Ionic', 'Capacitor', 'Java', 'Material UI'],
    },
  ],
  education: [
    {
      degree: 'M.Tech, Software Engineering',
      institution: 'BITS Pilani',
      startYear: 2025,
      endYear: 2026,
    },
    {
      degree: 'B.Tech, Electronics and Communication Engineering',
      institution: 'Mahatma Gandhi Institute of Technology, Hyderabad',
      startYear: 2016,
      endYear: 2020,
      grade: '8.09 CGPA',
    },
  ],
  certifications: [
    {
      title: 'PG Level Advanced Programme in Applied Data Science and Machine Intelligence',
      issuer: 'TalentSprint & IIT Madras',
    },
    {
      title: 'Introduction to Wireless and Cellular Communications',
      issuer: 'IIT Madras',
      note: 'Course topper',
    },
    { title: 'Pattern Recognition and Application', issuer: 'IIT Kanpur' },
  ],
};
