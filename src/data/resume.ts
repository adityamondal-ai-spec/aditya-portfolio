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

export const metrics = [
  { label: 'reviews trained on', value: 'n = 15,000' },
  { label: 'accuracy — 3-class (pos/neu/neg)', value: '0.673' },
  { label: 'accuracy — binary (pos/neg)', value: '0.895' },
  { label: 'projects shipped', value: 'n = 2' },
]

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
    title: 'Interactive Portfolio',
    period: 'Jul 2026 — Present',
    description:
      'This site — an editorial "Working Paper" design whose signature element, The Boundary, is built from the sentiment model above: real held-out test reviews positioned by the model\'s actual decision geometry, not illustrative data.',
    bullets: [
      'The Boundary plots ~3,000 real reviews by the SVM\'s real decision_function output, colored by true label — rotate it and the neutral class visibly blurs into the boundary, matching the model\'s own confusion matrix.',
      'Ships 2D by default (fast, always real); an opt-in "Enter 3D" mode lazy-loads React Three Fiber only on click, so the WebGL cost is zero unless requested — verified with real Lighthouse runs, not assumed.',
      'Built with React 19, TypeScript, Vite, Tailwind CSS, and Framer Motion, with Three.js/React Three Fiber for the optional 3D mode.',
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
  linkedin: 'https://linkedin.com/in/adityamondal-ai' as string | undefined,
}
