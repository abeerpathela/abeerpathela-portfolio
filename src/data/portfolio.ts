export type ProjectData = {
  id: string
  title: string
  description: string
  imagePath: string
  github: string
  live: string
  tech: string[]
  color: string
  emissive: string
  size: number
  position: [number, number, number]
}

export type ParticipationData = {
  id: string
  title: string
  role: string
  description: string
  imagePath: string
  link: string
  tags: string[]
}

export type NebulaRegion = {
  id: string
  label: string
  color: string
  emissive: string
  position: [number, number, number]
  techs: string[]
}

export const PROJECTS: ProjectData[] = [
  {
    id: 'autotune-sql',
    title: 'AutoTune-SQL',
    description: 'An AI-powered database performance optimizer that analyzes SQL workloads, recommends query optimizations, and provides an integrated learning ecosystem with certification support.',
    imagePath: 'AutoTune-SQL.png',
    github: 'https://github.com/abeerpathela/AutoTune-SQL',
    live: 'https://autotune-sql.in',
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'OpenAI API', 'Tailwind CSS'],
    color: '#6b8cff',
    emissive: '#3d5aff',
    size: 3.2,
    position: [0, 0, -50],
  },
  {
    id: 'simapi',
    title: 'SimAPI',
    description: 'A BYOD SMS Gateway that transforms Android devices into programmable SMS APIs, enabling OTP delivery and automated messaging without third-party providers.',
    imagePath: 'SimAPI.png',
    github: 'https://github.com/abeerpathela/SimAPI',
    live: 'https://sim-api-one.vercel.app',
    tech: ['Flutter', 'Node.js', 'Express.js', 'MongoDB', 'REST API'],
    color: '#ff8c6b',
    emissive: '#ff5533',
    size: 2.8,
    position: [0, 0, -100],
  },
  {
    id: 'genetic-guardrail',
    title: 'Genetic Guardrail',
    description: 'A production-ready backend leveraging genomic VCF files to deliver personalized drug safety recommendations, bridging genetics with clinical decision-making.',
    imagePath: 'GeneticGuardrail.png',
    github: 'https://github.com/abeerpathela/GeneticGuardrail',
    live: '',
    tech: ['Node.js', 'Express.js', 'Python', 'MongoDB', 'REST API'],
    color: '#6bffc8',
    emissive: '#00ff88',
    size: 3.5,
    position: [0, 0, -150],
  },
  {
    id: 'nullprompt',
    title: 'NullPrompt',
    description: 'A Zero-Trust AI privacy extension that intercepts prompts locally, preventing data leakage across ChatGPT, Claude, and Gemini platforms.',
    imagePath: 'NullPrompt.png',
    github: 'https://github.com/abeerpathela/NullPrompt',
    live: '',
    tech: ['JavaScript', 'Chrome Extension', 'Manifest V3', 'Browser APIs', 'Privacy'],
    color: '#c084fc',
    emissive: '#9945ff',
    size: 2.6,
    position: [0, 0, -200],
  },
  {
    id: 'razorpay-clone',
    title: 'Razorpay Clone',
    description: 'A pixel-perfect frontend recreation of the Razorpay website, showcasing responsive layouts, modern UI components, and production-grade development.',
    imagePath: 'RazorpayClone.png',
    github: 'https://github.com/abeerpathela/Razorpay-Clone',
    live: 'https://razorpay-clone-chi-eight.vercel.app',
    tech: ['HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript'],
    color: '#ff6b9d',
    emissive: '#ff3366',
    size: 2.9,
    position: [0, 0, -250],
  },
  {
    id: 'jal-sahayak-ai',
    title: 'Jal Sahayak AI',
    description: 'An AI-powered complaint platform helping citizens resolve water-related issues via intelligent chatbots and real-time tracking.',
    imagePath: 'JalSahayakAI.png',
    github: 'https://github.com/abeerpathela/Jal-Sahayak-AI',
    live: 'https://jal-sahayak-ai.vercel.app',
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'OpenAI API'],
    color: '#4dd4ff',
    emissive: '#00aaff',
    size: 3.0,
    position: [0, 0, -300],
  },
  {
    id: 'codefixo',
    title: 'CodeFixo',
    description: 'SaaS-based AI code review and learning platform that detects bugs, explains source code, and helps developers strengthen DSA skills.',
    imagePath: 'CodeFixo.png',
    github: 'https://github.com/abeerpathela/CodeFixo',
    live: 'https://code-fixo.vercel.app',
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'OpenAI API'],
    color: '#ffd700',
    emissive: '#ffaa00',
    size: 3.3,
    position: [0, 0, -350],
  },
  {
    id: 'aitextra',
    title: 'AiTextra',
    description: 'An AI-powered SMS chatbot enabling interaction with LLMs via text messages without requiring internet connectivity or mobile apps.',
    imagePath: 'AiTextra.png',
    github: 'https://github.com/abeerpathela/AiTextra',
    live: '',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Twilio', 'OpenAI API'],
    color: '#ff7eb3',
    emissive: '#ff4488',
    size: 2.5,
    position: [0, 0, -400],
  },
  {
    id: 'brainbuster',
    title: 'BrainBuster',
    description: 'An interactive quiz platform where users attempt dynamic quizzes across subjects to improve logical thinking.',
    imagePath: 'BrainBuster.png',
    github: 'https://github.com/abeerpathela/BrainBuster',
    live: 'https://brain-buster-lac.vercel.app',
    tech: ['React', 'JavaScript', 'CSS3'],
    color: '#7cff6b',
    emissive: '#44ff22',
    size: 2.7,
    position: [0, 0, -450],
  },
]

export const PARTICIPATIONS: ParticipationData[] = [
  {
    id: 'hackindia-2026',
    title: 'HackIndia 2026',
    role: 'AI Developer / Participant',
    description: 'National level hackathon focused on solving real-world problems using Artificial Intelligence and scalable web technologies.',
    imagePath: 'HackIndia2026.jpeg',
    link: 'https://www.linkedin.com/posts/abeer-pathela-240001313_hackindia2026-hackathon-ai-activity-7455283772058509313-bbkz',
    tags: ['AI', 'Innovation', 'National Level'],
  },
  {
    id: 'buildx-hackathon',
    title: 'BuildX Hackathon',
    role: 'Backend & System Architect',
    description: 'Fast-paced innovation hackathon where we developed production-ready prototypes within 48 hours.',
    imagePath: 'BuildX.png',
    link: 'https://www.linkedin.com/posts/abeer-pathela-240001313_hackathon-buildx-innovation-activity-7462754885097295872-mClT',
    tags: ['System Architecture', 'Prototyping', 'Teamwork'],
  },
  {
    id: 'chitkaraverse',
    title: 'Chitkaraverse',
    role: 'Full Stack Developer',
    description: 'Web3 and Metaverse focused hackathon, building community-driven platforms for the digital future.',
    imagePath: 'Chitkaraverse.png',
    link: 'https://www.linkedin.com/posts/avinash-guleria-a18553324_chitkaraverse2026-hackathon-aiimpact-ugcPost-7447265770331623424-swhG',
    tags: ['Metaverse', 'React', 'Collaboration'],
  },
  {
    id: 'numpy-physics',
    title: 'NumPy Physics Project',
    role: 'Mathematical Modeler',
    description: 'Collaborative research and development of physics-based game mechanics and simulations using NumPy and Python.',
    imagePath: 'Numpy.png',
    link: 'https://www.linkedin.com/posts/abeer-pathela-240001313_teamwork-physics-gamedevelopment-activity-7263471895314886656-UhVd',
    tags: ['Python', 'NumPy', 'Physics Engine'],
  },
]

export const NEBULA_REGIONS: NebulaRegion[] = [
  {
    id: 'tech-galaxy',
    label: 'Tech Galaxy',
    color: '#61dafb',
    emissive: '#00aaff',
    position: [0, 0, -500],
    techs: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Java', 'JavaScript', 'TypeScript', 'Flutter', 'Tailwind CSS', 'Three.js', 'Firebase', 'Git', 'GitHub', 'REST APIs', 'OpenAI API', 'Gemini API', 'PostgreSQL', 'MySQL', 'Socket.io', 'JWT'],
  },
]

export const STATS = {
  cgpa: 9.58,
  leetcode: 100,
  resumePath: '/src/assets/Abeer_Pathela_Resume.pdf',
  certifications: [
    'Programming in C',
    'Design Thinking',
    'Linux for Beginners',
    'Explore Machine Learning using Python',
    'Software Engineering Fundamentals',
  ],
}
