import { ResumeData } from '@/types/resume';

export type VisualTemplateId = 'modern' | 'creative' | 'elegant' | 'minimal' | 'dark';

export type ProfessionalTemplateMeta = {
  title: string;
  subtitle: string;
  templateId: VisualTemplateId;
  badge?: string;
};

export const PROFESSIONAL_TEMPLATE_META: Record<string, ProfessionalTemplateMeta> = {
  software_engineer: {
    title: 'Software Engineer',
    subtitle: 'Backend / Full‑Stack',
    templateId: 'modern',
    badge: 'Tech',
  },
  product_manager: {
    title: 'Product Manager',
    subtitle: 'Roadmaps / 0→1',
    templateId: 'creative',
    badge: 'Product',
  },
  data_scientist: {
    title: 'Data Scientist',
    subtitle: 'ML / Analytics',
    templateId: 'dark',
    badge: 'Data',
  },
  doctor: {
    title: 'Doctor',
    subtitle: 'Clinical Practice',
    templateId: 'elegant',
    badge: 'Healthcare',
  },
  lawyer: {
    title: 'Lawyer',
    subtitle: 'Corporate / Litigation',
    templateId: 'elegant',
    badge: 'Legal',
  },
  accountant: {
    title: 'Accountant',
    subtitle: 'Audit / Financials',
    templateId: 'modern',
    badge: 'Finance',
  },
  teacher: {
    title: 'Teacher',
    subtitle: 'Curriculum / Student Success',
    templateId: 'modern',
    badge: 'Education',
  },
};

export const PROFESSIONAL_TEMPLATES: Record<string, ResumeData> = {
  software_engineer: {
    fullName: 'Alex Rivera',
    email: 'alex.rivera@email.com',
    phone: '+1 (555) 012-3456',
    address: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexrivera',
    github: 'github.com/arivera-dev',
    summary: 'Senior Software Engineer with 8+ years of experience in building scalable distributed systems and cloud-native applications. Proven track record of leading cross-functional teams to deliver high-impact features for millions of users. Expert in modern web technologies, microservices architecture, and DevOps practices. Committed to writing clean, maintainable code and fostering a culture of technical excellence.',
    experience: [
      {
        id: '1',
        company: 'TechGiant Corp',
        role: 'Senior Software Engineer',
        startDate: 'Jan 2020',
        endDate: 'Present',
        description: '• Led the migration of legacy monolithic architecture to microservices, improving system reliability by 40% and reducing deployment time by 60%.\n• Optimized database queries and implemented Redis caching, resulting in a 25% reduction in API latency and 30% lower infrastructure costs.\n• Mentored 5 junior engineers and established best practices for code reviews, unit testing, and CI/CD pipelines using GitHub Actions.\n• Architected and implemented a real-time notification system using WebSockets and Kafka, handling over 1M concurrent connections.\n• Collaborated with product and design teams to define technical roadmaps and ensure seamless feature delivery.'
      },
      {
        id: '2',
        company: 'Innovate Startup',
        role: 'Full Stack Developer',
        startDate: 'Jun 2016',
        endDate: 'Dec 2019',
        description: '• Developed and launched a real-time analytics dashboard using React, Node.js, and PostgreSQL, serving 50k+ monthly active users.\n• Implemented automated testing suite with Jest and Cypress that reduced production bugs by 30% and improved developer velocity.\n• Collaborated with product managers to define technical requirements for new features and conducted A/B testing to optimize user engagement.\n• Integrated third-party APIs for payments (Stripe) and authentication (Auth0), ensuring secure and reliable transactions.\n• Optimized frontend performance by implementing code-splitting and lazy loading, reducing initial load time by 45%.'
      },
      {
        id: '3',
        company: 'Web Solutions Ltd',
        role: 'Junior Web Developer',
        startDate: 'Jul 2012',
        endDate: 'May 2016',
        description: '• Developed responsive web applications using HTML5, CSS3, and JavaScript for various clients in the e-commerce and education sectors.\n• Assisted in the migration of legacy jQuery projects to modern React-based architectures.\n• Collaborated with senior developers to implement RESTful APIs and integrate them with frontend components.\n• Participated in daily stand-ups and sprint planning meetings in an Agile development environment.'
      }
    ],
    education: [
      {
        id: '1',
        school: 'University of California, Berkeley',
        degree: 'B.S. in Computer Science',
        startDate: '2008',
        endDate: '2012',
        description: 'GPA: 3.8/4.0. Relevant coursework: Algorithms, Data Structures, Operating Systems, Database Systems, Web Development.'
      }
    ],
    skills: [
      { id: '1', name: 'TypeScript', category: 'Languages', level: 'Expert' },
      { id: '2', name: 'Go', category: 'Languages', level: 'Advanced' },
      { id: '3', name: 'React', category: 'Frameworks', level: 'Expert' },
      { id: '4', name: 'Next.js', category: 'Frameworks', level: 'Expert' },
      { id: '5', name: 'Node.js', category: 'Frameworks', level: 'Expert' },
      { id: '6', name: 'AWS', category: 'Cloud', level: 'Advanced' },
      { id: '7', name: 'Kubernetes', category: 'Tools', level: 'Intermediate' },
      { id: '8', name: 'Docker', category: 'Tools', level: 'Advanced' },
      { id: '9', name: 'PostgreSQL', category: 'Databases', level: 'Advanced' },
      { id: '10', name: 'Redis', category: 'Databases', level: 'Advanced' }
    ],
    projects: [
      {
        id: '1',
        name: 'OpenSource Analytics',
        description: 'A privacy-focused web analytics tool with over 5k stars on GitHub. Built with Next.js, Tailwind CSS, and ClickHouse.',
        link: 'github.com/arivera-dev/os-analytics'
      },
      {
        id: '2',
        name: 'Cloud-Native E-commerce',
        description: 'A scalable e-commerce platform built with microservices architecture using Go, gRPC, and Kubernetes.',
        link: 'github.com/arivera-dev/cloud-shop'
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
    summary: 'Strategic Product Manager with 6 years of experience in fintech and e-commerce. Expert in data-driven decision making, user research, and agile methodologies. Successfully launched 3 major products from 0 to 1, driving significant revenue growth and user engagement. Skilled at aligning cross-functional teams and translating complex customer needs into actionable product roadmaps.',
    experience: [
      {
        id: '1',
        company: 'Fintech Solutions',
        role: 'Senior Product Manager',
        startDate: 'Mar 2021',
        endDate: 'Present',
        description:
          '• Defined product roadmap for a new mobile banking app, reaching 100k active users in 6 months and achieving a 4.8-star App Store rating.\n• Conducted 50+ user interviews to identify pain points in onboarding, increasing conversion by 15% and reducing support tickets by 20%.\n• Led weekly execution with a cross-functional squad (12 engineers + design + data), aligning scope and trade-offs to ensure on-time delivery.\n• Instrumented key funnels and dashboards using Mixpanel and Amplitude; improved activation and reduced drop-off with iterative experiments.\n• Partnered with compliance and risk to ship KYC updates and reduce verification failure rate by 30%.'
      },
      {
        id: '2',
        company: 'ShopCart Marketplace',
        role: 'Product Manager',
        startDate: 'Jul 2019',
        endDate: 'Feb 2021',
        description:
          '• Owned checkout and payments roadmap, increasing conversion by 9% through UX improvements and A/B testing of payment methods.\n• Launched fraud detection rules and refund workflows, reducing chargebacks by 18% and saving $200k in annual losses.\n• Wrote PRDs, user stories, and acceptance criteria; coordinated releases across engineering, marketing, and customer support.\n• Implemented customer feedback loop using surveys and support tickets to prioritize top issues, resulting in a 10-point NPS increase.'
      },
      {
        id: '3',
        company: 'GrowthWorks Studio',
        role: 'Associate Product Manager',
        startDate: 'Jun 2017',
        endDate: 'Jun 2019',
        description:
          '• Supported discovery and delivery for 0→1 features; facilitated sprint planning, demos, and retrospectives for 3 development teams.\n• Built competitive analyses and pricing research to support go-to-market decisions for a new SaaS product line.\n• Maintained product analytics in SQL and collaborated with data team on KPI definitions and automated reporting.'
      },
      {
        id: '4',
        company: 'Tech Innovations',
        role: 'Product Intern',
        startDate: 'May 2016',
        endDate: 'Aug 2016',
        description:
          '• Assisted in user testing sessions and documented feedback for the design team.\n• Conducted market research on emerging trends in the e-commerce space.'
      }
    ],
    education: [
      {
        id: '1',
        school: 'New York University',
        degree: 'MBA in Technology Management',
        startDate: '2018',
        endDate: '2020',
        description: 'Focus on digital transformation and product leadership.'
      },
      {
        id: '2',
        school: 'University of Michigan',
        degree: 'B.S. in Economics',
        startDate: '2013',
        endDate: '2017',
        description: 'Focus: quantitative analysis, consumer behavior, and product strategy. Graduated with Honors.'
      }
    ],
    skills: [
      { id: '1', name: 'Product Strategy', category: 'Core', level: 'Expert' },
      { id: '2', name: 'SQL', category: 'Technical', level: 'Advanced' },
      { id: '3', name: 'Agile/Scrum', category: 'Process', level: 'Expert' },
      { id: '4', name: 'User Research', category: 'Core', level: 'Advanced' },
      { id: '5', name: 'A/B Testing', category: 'Technical', level: 'Advanced' },
      { id: '6', name: 'Roadmapping', category: 'Core', level: 'Expert' },
      { id: '7', name: 'Stakeholder Management', category: 'Core', level: 'Expert' },
      { id: '8', name: 'Mixpanel/Amplitude', category: 'Tools', level: 'Advanced' },
      { id: '9', name: 'Jira/Confluence', category: 'Tools', level: 'Expert' }
    ],
    projects: [
      {
        id: '1',
        name: 'Mobile Onboarding Revamp',
        description: 'Redesigned onboarding flow with experiment framework; improved conversion and reduced verification failures by 25%.',
      },
      {
        id: '2',
        name: 'Payments Reliability Program',
        description: 'Partnered with engineering and ops to improve payment success rates, alerting, and incident response playbooks.',
      },
      {
        id: '3',
        name: 'Customer Feedback Engine',
        description: 'Built an automated system to collect and categorize user feedback, directly influencing the product roadmap.',
      }
    ],
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
    summary: 'Data Scientist with a PhD in Statistics and 5 years of experience in machine learning and predictive modeling. Expert in Python, R, and SQL. Passionate about turning complex data into actionable business insights. Proven track record of developing and deploying high-impact models that drive revenue and optimize operations. Strong communicator with the ability to present technical findings to non-technical stakeholders.',
    experience: [
      {
        id: '1',
        company: 'Data Insights Inc.',
        role: 'Senior Data Scientist',
        startDate: 'Aug 2020',
        endDate: 'Present',
        description:
          '• Developed a customer churn prediction model using XGBoost and SHAP for interpretability, reducing churn by 20% via targeted retention offers.\n• Built an automated data pipeline using Airflow, Snowflake, and dbt, saving 15 hours of manual work per week and improving data quality.\n• Owned model monitoring (drift, performance) and retraining cadence; improved stability across seasonal changes and market shifts.\n• Partnered with product and marketing to translate insights into experiments and KPI targets, resulting in a 15% increase in LTV.\n• Presented findings to executive leadership, influencing a $2M marketing budget reallocation based on ROI analysis.'
      },
      {
        id: '2',
        company: 'CloudCommerce',
        role: 'Data Scientist',
        startDate: 'Jul 2018',
        endDate: 'Jul 2020',
        description:
          '• Built propensity and segmentation models to personalize recommendations, improving CTR by 11% and incremental revenue by $500k.\n• Implemented feature store patterns and reusable training pipelines in Python, reducing model development time by 40%.\n• Created executive dashboards for retention, LTV, and cohort performance using Tableau; standardized metric definitions across teams.\n• Conducted deep-dive analyses on user behavior, identifying key drivers of conversion and informing product roadmap decisions.'
      },
      {
        id: '3',
        company: 'University Research Lab',
        role: 'Research Assistant (ML)',
        startDate: 'Sep 2015',
        endDate: 'Jun 2018',
        description:
          '• Conducted research on Bayesian neural networks and their applications in uncertainty estimation; implemented experiments in PyTorch.\n• Published 3 papers in top-tier ML conferences and presented findings at departmental seminars.\n• Collaborated with faculty and peers on peer review and grant proposals; mentored undergraduate research assistants.'
      },
      {
        id: '4',
        company: 'Tech Solutions',
        role: 'Data Analyst Intern',
        startDate: 'May 2014',
        endDate: 'Aug 2014',
        description:
          '• Performed exploratory data analysis on large datasets using SQL and R.\n• Created automated reports for the marketing team to track campaign performance.'
      }
    ],
    education: [
      {
        id: '1',
        school: 'University of Texas at Austin',
        degree: 'PhD in Statistics',
        startDate: '2015',
        endDate: '2020',
        description: 'Dissertation on Bayesian Neural Networks. Recipient of the Graduate Research Fellowship.'
      },
      {
        id: '2',
        school: 'Stanford University',
        degree: 'B.S. in Mathematics',
        startDate: '2011',
        endDate: '2015',
        description: 'Minor in Computer Science. Graduated Magna Cum Laude.'
      }
    ],
    skills: [
      { id: '1', name: 'Python', category: 'Languages', level: 'Expert' },
      { id: '2', name: 'PyTorch', category: 'Frameworks', level: 'Advanced' },
      { id: '3', name: 'Scikit-learn', category: 'Frameworks', level: 'Expert' },
      { id: '4', name: 'SQL', category: 'Tools', level: 'Expert' },
      { id: '5', name: 'Tableau', category: 'Tools', level: 'Advanced' },
      { id: '6', name: 'Airflow', category: 'Tools', level: 'Advanced' },
      { id: '7', name: 'Snowflake', category: 'Tools', level: 'Advanced' },
      { id: '8', name: 'TensorFlow', category: 'Frameworks', level: 'Advanced' },
      { id: '9', name: 'Spark', category: 'Tools', level: 'Intermediate' }
    ],
    projects: [
      {
        id: '1',
        name: 'Stock Price Predictor',
        description: 'LSTM-based model for predicting stock market trends with 85% accuracy. Implemented with TensorFlow and deployed as a web app.',
        link: 'github.com/jsmith-data/stock-predictor'
      },
      {
        id: '2',
        name: 'Customer Churn Playbook',
        description: 'End-to-end churn modeling workflow with feature engineering, evaluation, and monitoring templates for SaaS businesses.',
        link: 'github.com/jsmith-data/churn-playbook'
      },
      {
        id: '3',
        name: 'NLP Sentiment Engine',
        description: 'A real-time sentiment analysis tool for social media data using BERT and FastAPI.',
        link: 'github.com/jsmith-data/sentiment-engine'
      }
    ],
    skillStyle: 'levels',
    fontFamily: 'Roboto'
  },
  doctor: {
    fullName: 'Dr. Priya Nair, MD',
    email: 'priya.nair@email.com',
    phone: '+1 (555) 321-9090',
    address: 'Seattle, WA',
    linkedin: 'linkedin.com/in/priyanair-md',
    summary:
      'Board-certified Internal Medicine physician with 7+ years of experience delivering evidence-based care in high-volume hospital and outpatient settings. Strong focus on quality improvement, patient safety, and interdisciplinary collaboration. Proven ability to manage complex patient populations and lead clinical initiatives that improve outcomes and operational efficiency. Committed to patient-centered care and continuous professional development.',
    experience: [
      {
        id: '1',
        company: 'Evergreen Medical Center',
        role: 'Attending Physician (Internal Medicine)',
        startDate: 'Jul 2021',
        endDate: 'Present',
        description:
          '• Managed inpatient census of 14–18 patients/day, coordinating care across specialists, nursing, pharmacy, and case management to ensure high-quality outcomes.\n• Standardized admission and discharge checklists to improve documentation completeness and reduce 30-day readmissions by 15%.\n• Led sepsis pathway adherence initiative, improving bundle compliance by 22% and time-to-antibiotics performance across the department.\n• Implemented anticoagulation safety huddles with nursing and pharmacists, reducing medication-related incidents by 20%.\n• Supervised residents and medical students; delivered weekly clinical teaching sessions and case-based rounds on complex internal medicine topics.',
      },
      {
        id: '2',
        company: 'Harborview Clinic Network',
        role: 'Primary Care Physician',
        startDate: 'Aug 2018',
        endDate: 'Jun 2021',
        description:
          '• Delivered longitudinal care for a diverse panel of 1,800+ patients with complex chronic conditions and preventive care needs.\n• Implemented diabetes care workflows (registry + outreach) increasing A1c control rates by 12% and improving patient engagement.\n• Built hypertension protocol and follow-up cadence using home BP monitoring and shared decision-making, resulting in a 10% improvement in BP control.\n• Partnered with behavioral health and social work to improve access, continuity, and adherence for high-risk patient populations.\n• Participated in clinic-wide quality improvement projects focused on patient access and satisfaction.',
      },
      {
        id: '3',
        company: 'Northlake Community Hospital',
        role: 'Hospitalist',
        startDate: 'Jul 2015',
        endDate: 'Jul 2018',
        description:
          '• Provided inpatient coverage across general medicine services, focusing on safe transitions of care and efficient hospital operations.\n• Collaborated with ICU and specialty consult services to manage complex cases and escalation pathways for critically ill patients.\n• Participated in morbidity and mortality reviews; developed action items and process updates to improve patient safety.\n• Assisted in the implementation of a new EMR system, providing peer support and feedback to the IT team.',
      },
      {
        id: '4',
        company: 'City Health Clinic',
        role: 'Medical Volunteer',
        startDate: 'Jan 2014',
        endDate: 'May 2015',
        description:
          '• Provided basic medical screenings and health education to underserved communities.\n• Assisted in the coordination of community health fairs and outreach programs.',
      }
    ],
    education: [
      {
        id: '1',
        school: 'University of Washington',
        degree: 'Residency, Internal Medicine',
        startDate: '2015',
        endDate: '2018',
        description: 'Chief Resident track; Quality & Safety committee member. Awarded "Resident of the Year" in 2017.',
      },
      {
        id: '2',
        school: 'Stanford University School of Medicine',
        degree: 'Doctor of Medicine (MD)',
        startDate: '2011',
        endDate: '2015',
        description: 'Honors in Clinical Medicine; research in hypertension outcomes. Member of the Alpha Omega Alpha Honor Medical Society.',
      },
      {
        id: '3',
        school: 'University of California, Los Angeles',
        degree: 'B.S. in Biology',
        startDate: '2007',
        endDate: '2011',
        description: 'Graduated Summa Cum Laude. Research assistant in the Department of Physiology.',
      }
    ],
    skills: [
      { id: '1', name: 'Patient Care', category: 'Clinical', level: 'Expert' },
      { id: '2', name: 'Diagnostic Reasoning', category: 'Clinical', level: 'Expert' },
      { id: '3', name: 'EMR (Epic)', category: 'Tools', level: 'Advanced' },
      { id: '4', name: 'Quality Improvement', category: 'Leadership', level: 'Advanced' },
      { id: '5', name: 'Care Coordination', category: 'Clinical', level: 'Expert' },
      { id: '6', name: 'Patient Safety', category: 'Leadership', level: 'Advanced' },
      { id: '7', name: 'Clinical Teaching', category: 'Leadership', level: 'Advanced' },
      { id: '8', name: 'Medical Research', category: 'Clinical', level: 'Advanced' },
      { id: '9', name: 'Interdisciplinary Collaboration', category: 'Leadership', level: 'Expert' }
    ],
    projects: [
      {
        id: '1',
        name: 'Sepsis Bundle Compliance Dashboard',
        description: 'Built a KPI dashboard and audit workflow to track sepsis bundle steps and close process gaps across multiple hospital units.',
      },
      {
        id: '2',
        name: 'Chronic Care Outreach Program',
        description: 'Designed outreach scripts and follow-up cadence for diabetes/hypertension patients to improve adherence and clinical outcomes.',
      },
      {
        id: '3',
        name: 'Anticoagulation Safety Initiative',
        description: 'Led a cross-functional team to implement new safety protocols for high-risk anticoagulation medications.',
      }
    ],
    photo: '/professional_women.jpg',
    accentColor: '#2563eb',
    skillStyle: 'categorized',
    fontFamily: 'Merriweather',
  },
  lawyer: {
    fullName: 'Michael Grant, JD',
    email: 'michael.grant@email.com',
    phone: '+1 (555) 808-1414',
    address: 'Boston, MA',
    linkedin: 'linkedin.com/in/michaelgrant-law',
    summary:
      'Corporate and commercial litigation attorney with 6+ years of experience advising clients on contract negotiation, dispute resolution, and regulatory compliance. Skilled at translating complex legal risk into pragmatic business decisions. Proven track record of achieving favorable outcomes in high-stakes litigation and streamlining legal operations. Committed to providing strategic, client-focused legal counsel and maintaining the highest standards of professional ethics.',
    experience: [
      {
        id: '1',
        company: 'Hamilton & Pierce LLP',
        role: 'Associate Attorney',
        startDate: 'Sep 2020',
        endDate: 'Present',
        description:
          '• Drafted and negotiated complex commercial agreements (SaaS, services, NDAs, MSAs, SOWs) for mid-market and enterprise clients.\n• Supported high-stakes litigation matters including discovery, deposition preparation, motion practice, and trial preparation.\n• Built internal clause library and review playbooks, reducing contract turnaround time by 25% and improving consistency.\n• Prepared client-ready risk summaries and redlines, translating legal exposure into practical business recommendations for executive leadership.\n• Collaborated with privacy and security counsel on data-processing terms, vendor assessments, and GDPR/CCPA compliance.',
      },
      {
        id: '2',
        company: 'Northeast Legal Aid',
        role: 'Staff Attorney (Clinic)',
        startDate: 'Aug 2018',
        endDate: 'Aug 2020',
        description:
          '• Represented low-income clients in housing, consumer protection, and employment matters; achieved favorable outcomes in 80%+ of cases.\n• Drafted pleadings, negotiated settlements, and coordinated with community partners for wrap-around support and advocacy.\n• Developed community workshops and intake triage process improving service throughput by 30% and reaching underserved populations.\n• Built templates for motions and correspondence to improve quality and consistency across the clinic.',
      },
      {
        id: '3',
        company: 'State Attorney General Internship',
        role: 'Legal Intern (Consumer Protection)',
        startDate: 'May 2017',
        endDate: 'Aug 2017',
        description:
          '• Researched statutory and regulatory frameworks related to consumer fraud and deceptive trade practices; summarized findings for senior attorneys.\n• Supported investigations into predatory lending practices and prepared memo drafts for case strategy discussions.\n• Assisted in the preparation of discovery requests and reviewed documents for relevance and privilege.',
      },
      {
        id: '4',
        company: 'Boston Law Review',
        role: 'Editor',
        startDate: 'Sep 2016',
        endDate: 'May 2018',
        description:
          '• Edited and cite-checked articles for publication in the Boston University School of Law Review.\n• Conducted independent legal research and wrote a note on emerging trends in corporate governance.',
      }
    ],
    education: [
      {
        id: '1',
        school: 'Boston University School of Law',
        degree: 'Juris Doctor (JD)',
        startDate: '2015',
        endDate: '2018',
        description: 'Law Review; Concentration in Business Law. Graduated in the top 10% of the class.',
      },
      {
        id: '2',
        school: 'Tufts University',
        degree: 'B.A. in Political Science',
        startDate: '2011',
        endDate: '2015',
        description: 'Graduated Magna Cum Laude. Member of the Phi Beta Kappa Society.',
      },
    ],
    skills: [
      { id: '1', name: 'Contract Drafting', category: 'Core', level: 'Expert' },
      { id: '2', name: 'Negotiation', category: 'Core', level: 'Advanced' },
      { id: '3', name: 'Legal Research (Westlaw)', category: 'Tools', level: 'Advanced' },
      { id: '4', name: 'Litigation Support', category: 'Core', level: 'Advanced' },
      { id: '5', name: 'Compliance', category: 'Core', level: 'Intermediate' },
      { id: '6', name: 'Due Diligence', category: 'Core', level: 'Intermediate' },
      { id: '7', name: 'Client Communication', category: 'Core', level: 'Expert' },
      { id: '8', name: 'Regulatory Analysis', category: 'Core', level: 'Advanced' },
      { id: '9', name: 'Project Management', category: 'Tools', level: 'Advanced' }
    ],
    projects: [
      {
        id: '1',
        name: 'Contract Review Playbook',
        description: 'Created clause-level fallback positions and redline guidance to standardize reviews and accelerate approvals across the firm.',
      },
      {
        id: '2',
        name: 'Legal Operations Audit',
        description: 'Conducted a comprehensive audit of internal legal processes and implemented new tools for matter management and document automation.',
      }
    ],
    photo: '/professional_men.jpg',
    accentColor: '#111827',
    skillStyle: 'bullets',
    fontFamily: 'Merriweather',
  },
  accountant: {
    fullName: 'Daniel Wong, CPA',
    email: 'daniel.wong@email.com',
    phone: '+1 (555) 606-9191',
    address: 'Los Angeles, CA',
    linkedin: 'linkedin.com/in/dwong-cpa',
    summary:
      'CPA with 6 years of experience in financial reporting, audit, and month-end close. Strong record of improving internal controls, streamlining reconciliations, and partnering with stakeholders to deliver accurate, timely financials. Expert in GAAP, SOX compliance, and financial analysis. Committed to maintaining the highest level of integrity and providing strategic financial insights that support business growth and operational efficiency.',
    experience: [
      {
        id: '1',
        company: 'West Coast Retail Group',
        role: 'Senior Accountant',
        startDate: 'Apr 2021',
        endDate: 'Present',
        description:
          '• Owned the monthly close process for revenue, COGS, and inventory; reduced close cycle from 8 to 5 business days through process automation.\n• Implemented standardized reconciliation templates and review checklists, improving accuracy and audit readiness across the department.\n• Partnered with FP&A to explain budget-to-actual variances and support forecasting with clear, data-driven narratives.\n• Supported annual external audit, prepared PBC schedules, and improved documentation for key accounts and complex transactions.\n• Streamlined journal entry preparation with standardized support and reviewer sign-off workflows, ensuring SOX compliance.',
      },
      {
        id: '2',
        company: 'Deloitte',
        role: 'Audit Associate',
        startDate: 'Sep 2018',
        endDate: 'Mar 2021',
        description:
          '• Executed audit procedures for public and private clients across retail and SaaS sectors; supported planning through fieldwork and wrap-up.\n• Documented internal controls and tested key SOX processes; surfaced remediation items for management and tracked resolution.\n• Prepared workpapers and walkthroughs with clear evidence trails and review notes; improved first-pass review acceptance by 20%.\n• Collaborated with client accounting teams to resolve complex accounting issues and ensure compliance with GAAP.',
      },
      {
        id: '3',
        company: 'ClearBooks Services',
        role: 'Accounting Intern',
        startDate: 'May 2017',
        endDate: 'Aug 2017',
        description:
          '• Assisted with AP/AR processing, bank reconciliations, and month-end support tasks for various small business clients.\n• Built Excel templates for recurring reconciliations to reduce manual errors and improve efficiency.\n• Supported the preparation of basic financial statements and tax filings.',
      },
      {
        id: '4',
        company: 'UCLA Accounting Society',
        role: 'Treasurer',
        startDate: 'Sep 2016',
        endDate: 'May 2018',
        description:
          '• Managed the budget and financial records for the student organization.\n• Coordinated fundraising events and processed reimbursements for members.',
      }
    ],
    education: [
      {
        id: '1',
        school: 'UCLA',
        degree: 'B.S. in Accounting',
        startDate: '2014',
        endDate: '2018',
        description: 'Graduated Magna Cum Laude. Recipient of the Accounting Excellence Scholarship.',
      },
      {
        id: '2',
        school: 'California Board of Accountancy',
        degree: 'Certified Public Accountant (CPA)',
        startDate: '2019',
        endDate: '2019',
        description: 'Active license; continuing professional education in audit, tax, and financial reporting.',
      },
    ],
    skills: [
      { id: '1', name: 'Financial Reporting', category: 'Core', level: 'Expert' },
      { id: '2', name: 'GAAP', category: 'Core', level: 'Advanced' },
      { id: '3', name: 'Reconciliations', category: 'Core', level: 'Expert' },
      { id: '4', name: 'SOX Controls', category: 'Core', level: 'Intermediate' },
      { id: '5', name: 'Excel', category: 'Tools', level: 'Expert' },
      { id: '6', name: 'Month-End Close', category: 'Core', level: 'Expert' },
      { id: '7', name: 'Audit Support', category: 'Core', level: 'Advanced' },
      { id: '8', name: 'Financial Analysis', category: 'Core', level: 'Advanced' },
      { id: '9', name: 'ERP (NetSuite)', category: 'Tools', level: 'Advanced' }
    ],
    projects: [
      {
        id: '1',
        name: 'Close Checklist & Reconciliation Pack',
        description: 'Created standardized close checklists and account reconciliation templates to reduce cycle time and improve review quality.',
      },
      {
        id: '2',
        name: 'Internal Controls Revamp',
        description: 'Led a project to document and test internal controls for a high-growth retail client, ensuring SOX compliance.',
      }
    ],
    photo: '/professional_men.jpg',
    accentColor: '#0f766e',
    skillStyle: 'categorized',
    fontFamily: 'Inter',
  },
  teacher: {
    fullName: 'Sophia Martinez',
    email: 'sophia.martinez@email.com',
    phone: '+1 (555) 505-1212',
    address: 'Denver, CO',
    linkedin: 'linkedin.com/in/sophiamartinez-edu',
    summary:
      'High school teacher with 7 years of experience designing inclusive curriculum, improving student outcomes, and collaborating with families and staff. Strong classroom leadership, data-informed instruction, and student-centered learning approach. Expert in differentiated instruction, project-based learning, and educational technology. Committed to fostering a supportive learning environment and helping every student reach their full potential.',
    experience: [
      {
        id: '1',
        company: 'Denver Public Schools',
        role: 'High School Teacher (English)',
        startDate: 'Aug 2019',
        endDate: 'Present',
        description:
          '• Designed and delivered standards-aligned English curriculum for grades 9–12, improving student pass rates by 14% and increasing engagement.\n• Implemented differentiated instruction and formative assessment cycles to support diverse learning needs, including ELL and IEP students.\n• Used data from benchmarks, exit tickets, and standardized tests to adjust instruction and targeted interventions on a weekly basis.\n• Led an after-school tutoring program serving 40+ students per semester; coordinated volunteers, resources, and progress tracking.\n• Collaborated with counselors, administrators, and families to create individualized support plans for students with attendance or performance risks.',
      },
      {
        id: '2',
        company: 'Front Range Charter Academy',
        role: 'Teacher (English / Humanities)',
        startDate: 'Aug 2017',
        endDate: 'Jul 2019',
        description:
          '• Built project-based learning units integrating writing, research, and presentation skills, resulting in a 20% increase in student project scores.\n• Created rubrics and exemplars to improve student writing quality and feedback clarity; implemented peer review routines.\n• Coordinated parent communication and progress plans for at-risk students, improving attendance by 8% and reducing behavioral incidents.\n• Served as a mentor teacher for new staff, providing guidance on classroom management and lesson planning.',
      },
      {
        id: '3',
        company: 'Summer Learning Initiative',
        role: 'Program Instructor',
        startDate: 'Jun 2016',
        endDate: 'Aug 2017',
        description:
          '• Taught intensive reading and writing workshops for middle school students; focused on literacy growth and building student confidence.\n• Designed weekly lesson plans and tracked student progress using simple assessment checkpoints and qualitative feedback.\n• Collaborated with other instructors to share best practices and coordinate program-wide events.',
      },
      {
        id: '4',
        company: 'Colorado Literacy Project',
        role: 'Volunteer Tutor',
        startDate: 'Jan 2014',
        endDate: 'May 2015',
        description:
          '• Provided one-on-one literacy support to adult learners in the community.\n• Assisted in the development of personalized learning plans and resources.',
      }
    ],
    education: [
      {
        id: '1',
        school: 'Colorado State University',
        degree: 'M.Ed. in Secondary Education',
        startDate: '2015',
        endDate: '2017',
        description: 'Focus on curriculum and instruction. Graduated with a 4.0 GPA.',
      },
      {
        id: '2',
        school: 'University of Colorado Boulder',
        degree: 'B.A. in English',
        startDate: '2011',
        endDate: '2015',
        description: 'Minor in Education. Member of the National English Honor Society.',
      },
    ],
    skills: [
      { id: '1', name: 'Curriculum Design', category: 'Core', level: 'Expert' },
      { id: '2', name: 'Classroom Management', category: 'Core', level: 'Expert' },
      { id: '3', name: 'Differentiated Instruction', category: 'Core', level: 'Advanced' },
      { id: '4', name: 'Student Assessment', category: 'Core', level: 'Advanced' },
      { id: '5', name: 'Family Engagement', category: 'Core', level: 'Advanced' },
      { id: '6', name: 'Student Support Planning', category: 'Core', level: 'Advanced' },
      { id: '7', name: 'Project-Based Learning', category: 'Core', level: 'Advanced' },
      { id: '8', name: 'Educational Technology', category: 'Tools', level: 'Advanced' },
      { id: '9', name: 'Literacy Instruction', category: 'Core', level: 'Expert' }
    ],
    projects: [
      {
        id: '1',
        name: 'Writing Workshop Curriculum',
        description: 'Developed a comprehensive 6-week writing workshop with rubrics, exemplars, and peer review routines to improve student outcomes.',
      },
      {
        id: '2',
        name: 'After-School Tutoring Program',
        description: 'Designed the structure, progress tracking, and parent communications for a consistent and effective student support program.',
      },
      {
        id: '3',
        name: 'Digital Literacy Initiative',
        description: 'Led a project to integrate new digital tools and resources into the English curriculum to enhance student learning.',
      }
    ],
    photo: '/professional_women.jpg',
    accentColor: '#ea580c',
    skillStyle: 'bullets',
    fontFamily: 'Inter',
  },
};