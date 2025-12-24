import { ResumeData } from '@/types/resume';

export const PROFESSIONAL_TEMPLATES: Record<string, ResumeData> = {
  software_engineer: {
    fullName: 'Alex Rivera',
    email: 'alex.rivera@email.com',
    phone: '+1 (555) 012-3456',
    address: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexrivera',
    github: 'github.com/arivera-dev',
    summary: 'Senior Software Engineer with 8+ years of experience in building scalable distributed systems and cloud-native applications. Proven track record of leading cross-functional teams to deliver high-impact features for millions of users.',
    experience: [
      {
        id: '1',
        company: 'TechGiant Corp',
        role: 'Senior Software Engineer',
        startDate: 'Jan 2020',
        endDate: 'Present',
        description: '• Led the migration of legacy monolithic architecture to microservices, improving system reliability by 40%.\n• Optimized database queries resulting in a 25% reduction in API latency.\n• Mentored 5 junior engineers and established best practices for code reviews and CI/CD pipelines.'
      },
      {
        id: '2',
        company: 'Innovate Startup',
        role: 'Full Stack Developer',
        startDate: 'Jun 2016',
        endDate: 'Dec 2019',
        description: '• Developed and launched a real-time analytics dashboard using React and Node.js.\n• Implemented automated testing suite that reduced production bugs by 30%.\n• Collaborated with product managers to define technical requirements for new features.'
      }
    ],
    education: [
      {
        id: '1',
        school: 'University of California, Berkeley',
        degree: 'B.S. in Computer Science',
        startDate: '2012',
        endDate: '2016',
        description: 'GPA: 3.8/4.0. Relevant coursework: Algorithms, Data Structures, Operating Systems.'
      }
    ],
    skills: [
      { id: '1', name: 'TypeScript', category: 'Languages', level: 'Expert' },
      { id: '2', name: 'Go', category: 'Languages', level: 'Advanced' },
      { id: '3', name: 'React', category: 'Frameworks', level: 'Expert' },
      { id: '4', name: 'Next.js', category: 'Frameworks', level: 'Expert' },
      { id: '5', name: 'AWS', category: 'Cloud', level: 'Advanced' },
      { id: '6', name: 'Kubernetes', category: 'Tools', level: 'Intermediate' }
    ],
    projects: [
      {
        id: '1',
        name: 'OpenSource Analytics',
        description: 'A privacy-focused web analytics tool with over 5k stars on GitHub.',
        link: 'github.com/arivera-dev/os-analytics'
      }
    ],
    photo: '/professional_men.jpg',
    accentColor: '#2563eb',
    skillStyle: 'categorized',
    fontFamily: 'Inter'
  },
  product_manager: {
    fullName: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1 (555) 987-6543',
    address: 'New York, NY',
    linkedin: 'linkedin.com/in/sarahchen-pm',
    summary: 'Strategic Product Manager with 6 years of experience in fintech and e-commerce. Expert in data-driven decision making, user research, and agile methodologies. Successfully launched 3 major products from 0 to 1.',
    experience: [
      {
        id: '1',
        company: 'Fintech Solutions',
        role: 'Senior Product Manager',
        startDate: 'Mar 2021',
        endDate: 'Present',
        description: '• Defined product roadmap for a new mobile banking app, reaching 100k active users in 6 months.\n• Conducted 50+ user interviews to identify pain points in the onboarding process, increasing conversion by 15%.\n• Managed a cross-functional team of 12 engineers and designers.'
      }
    ],
    education: [
      {
        id: '1',
        school: 'New York University',
        degree: 'MBA in Technology Management',
        startDate: '2018',
        endDate: '2020',
        description: ''
      }
    ],
    skills: [
      { id: '1', name: 'Product Strategy', category: 'Core', level: 'Expert' },
      { id: '2', name: 'SQL', category: 'Technical', level: 'Advanced' },
      { id: '3', name: 'Agile/Scrum', category: 'Process', level: 'Expert' },
      { id: '4', name: 'User Research', category: 'Core', level: 'Advanced' }
    ],
    projects: [],
    photo: '/professional_women.jpg',
    accentColor: '#db2777',
    skillStyle: 'bullets',
    fontFamily: 'Merriweather'
  },
  data_scientist: {
    fullName: 'Jordan Smith',
    email: 'jordan.smith@email.com',
    phone: '+1 (555) 444-3333',
    address: 'Austin, TX',
    photo: '/professional_men.jpg',
    accentColor: '#059669',
    linkedin: 'linkedin.com/in/jsmith-data',
    github: 'github.com/jsmith-data',
    summary: 'Data Scientist with a PhD in Statistics and 5 years of experience in machine learning and predictive modeling. Expert in Python, R, and SQL. Passionate about turning complex data into actionable business insights.',
    experience: [
      {
        id: '1',
        company: 'Data Insights Inc.',
        role: 'Senior Data Scientist',
        startDate: 'Aug 2020',
        endDate: 'Present',
        description: '• Developed a customer churn prediction model using XGBoost, reducing churn by 20%.\n• Built an automated data pipeline using Airflow and Snowflake, saving 15 hours of manual work per week.\n• Presented findings to executive leadership, influencing a $2M marketing budget reallocation.'
      }
    ],
    education: [
      {
        id: '1',
        school: 'University of Texas at Austin',
        degree: 'PhD in Statistics',
        startDate: '2015',
        endDate: '2020',
        description: 'Dissertation on Bayesian Neural Networks.'
      }
    ],
    skills: [
      { id: '1', name: 'Python', category: 'Languages', level: 'Expert' },
      { id: '2', name: 'PyTorch', category: 'Frameworks', level: 'Advanced' },
      { id: '3', name: 'Scikit-learn', category: 'Frameworks', level: 'Expert' },
      { id: '4', name: 'SQL', category: 'Tools', level: 'Expert' },
      { id: '5', name: 'Tableau', category: 'Tools', level: 'Advanced' }
    ],
    projects: [
      {
        id: '1',
        name: 'Stock Price Predictor',
        description: 'LSTM-based model for predicting stock market trends with 85% accuracy.',
        link: 'github.com/jsmith-data/stock-predictor'
      }
    ],
    skillStyle: 'levels',
    fontFamily: 'Roboto'
  },
  marketing_manager: {
    fullName: 'Emily Taylor',
    email: 'emily.taylor@email.com',
    phone: '+1 (555) 222-1111',
    address: 'Chicago, IL',
    linkedin: 'linkedin.com/in/etaylor-marketing',
    summary: 'Dynamic Marketing Manager with 7 years of experience in digital strategy, brand management, and social media marketing. Proven ability to increase brand awareness and drive revenue growth through innovative campaigns.',
    experience: [
      {
        id: '1',
        company: 'Global Brands Co.',
        role: 'Marketing Manager',
        startDate: 'May 2019',
        endDate: 'Present',
        description: '• Developed and executed a multi-channel marketing campaign that increased website traffic by 50%.\n• Managed a $500k annual marketing budget, achieving a 4x ROI.\n• Led a team of 5 specialists in content creation, SEO, and PPC.'
      }
    ],
    education: [
      {
        id: '1',
        school: 'Northwestern University',
        degree: 'B.A. in Communications',
        startDate: '2011',
        endDate: '2015',
        description: ''
      }
    ],
    skills: [
      { id: '1', name: 'Digital Strategy', category: 'Core', level: 'Expert' },
      { id: '2', name: 'SEO/SEM', category: 'Technical', level: 'Advanced' },
      { id: '3', name: 'Content Marketing', category: 'Core', level: 'Expert' },
      { id: '4', name: 'Google Analytics', category: 'Tools', level: 'Advanced' }
    ],
    projects: [],
    skillStyle: 'pills',
    fontFamily: 'Lato'
  }
};