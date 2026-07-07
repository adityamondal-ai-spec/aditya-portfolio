export const profile = {
  name: 'Aditya Mondal',
  role: 'Computer Science Student · AI/ML',
  location: 'Bengaluru, India',
  email: 'juug24btech28393@jainuniversity.ac.in',
  tagline:
    'Building and shipping machine learning systems — from classical NLP pipelines to cloud-deployed models — while finishing a B.Tech in Computer Science & Engineering (AI & ML).',
  summary:
    'Computer Science student specializing in AI/ML, with hands-on experience in Python, TensorFlow, Scikit-learn, and Google Cloud. Currently looking for a summer internship where I can contribute to real ML systems and learn from experienced engineers.',
}

export const education = {
  school: 'Jain University, Bengaluru',
  degree: 'B.Tech in Computer Science & Engineering (AI & ML)',
  graduation: 'Expected June 2028',
}

export const skills = {
  Languages: ['Python', 'SQL'],
  'ML / Data': ['TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy'],
  Tools: ['Google Cloud Platform', 'Git', 'GitHub', 'Jupyter'],
}

export type Project = {
  title: string
  period: string
  description: string
  bullets: string[]
  stack: string[]
  link?: string
}

export const projects: Project[] = [
  {
    title: 'Sentiment Analysis Model',
    period: 'Mar 2024 — Present',
    description:
      'A machine learning model that classifies customer review sentiment (positive / negative / neutral) from raw text, trained on real Yelp reviews.',
    bullets: [
      'Built a TF-IDF + linear SVM text classification pipeline using Python and Scikit-learn.',
      'Trained on a stratified sample of 15,000 labeled reviews (Yelp Review Full dataset).',
      'Reached 67.3% accuracy on the full 3-class task (positive/negative/neutral); 89.5% when evaluated as binary positive/negative.',
    ],
    stack: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
    link: 'https://github.com/adityamondal-ai-spec/sentiment-analysis-ml',
  },
  {
    title: 'Interactive 3D Portfolio',
    period: 'Jul 2026 — Present',
    description:
      'This site — a single continuous, scroll-reactive 3D experience, with a real-time particle field and rotating shape tracking the cursor behind every section.',
    bullets: [
      'Built with React 19, TypeScript, Vite, Three.js/React Three Fiber, and Framer Motion.',
      '3D background tracks cursor movement on desktop and touch-drag on mobile, with scroll-driven parallax throughout.',
      'Mobile-specific performance tuning: throttled frame rate, reduced particle count, and disabled backdrop blur on small screens.',
    ],
    stack: ['React', 'TypeScript', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
    link: 'https://github.com/adityamondal-ai-spec/aditya-portfolio',
  },
]

export type ExperienceItem = {
  title: string
  org: string
  period: string
  bullets: string[]
}

export const experience: ExperienceItem[] = [
  {
    title: 'Volunteer Instructor',
    org: 'Code for Good',
    period: 'Jun 2023 — Present',
    bullets: ['Mentored 15+ high-school students in Python fundamentals.'],
  },
]

export type Certification = {
  title: string
  issuer: string
  status: string
}

export const certifications: Certification[] = [
  {
    title: 'Deep Learning Specialization',
    issuer: 'Coursera',
    status: 'Completed — Apr 2023',
  },
]

export const links = {
  github: 'https://github.com/adityamondal-ai-spec' as string | undefined,
  // TODO: add real LinkedIn URL when ready
  linkedin: undefined as string | undefined,
}
