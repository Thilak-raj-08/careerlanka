// CareerLanka Database Seed Script
// Run: node prisma/seed.js

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clean existing data (optional)
  console.log('🧹 Cleaning existing seed data...')
  await prisma.application.deleteMany()
  await prisma.savedJob.deleteMany()
  await prisma.job.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.education.deleteMany()
  await prisma.workExperience.deleteMany()
  await prisma.studentProfile.deleteMany()
  await prisma.companyProfile.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // ============================================
  // CREATE ADMIN USER
  // ============================================
  console.log('👑 Creating admin user...')
  const adminPassword = await bcrypt.hash('Admin@2026', 12)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@careerlanka.com',
      password: adminPassword,
      name: 'CareerLanka Admin',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log(`✅ Admin created: ${admin.email}`)

  // ============================================
  // CREATE COMPANIES (5)
  // ============================================
  console.log('🏢 Creating companies...')

  const companiesData = [
    {
      email: 'hr@wso2.com',
      password: 'Company@2026',
      name: 'WSO2 Lanka',
      companyName: 'WSO2 Lanka',
      industry: 'Information Technology',
      size: '500+',
      foundedYear: 2005,
      website: 'https://wso2.com',
      tagline: 'The open source technology provider',
      description: 'WSO2 is a leading provider of enterprise-grade open source middleware. We help organizations build digital experiences using API management, identity management, and integration platforms.',
      location: 'Colombo, Sri Lanka',
      phone: '+94 11 763 9612',
    },
    {
      email: 'careers@ifs.com',
      password: 'Company@2026',
      name: 'IFS Sri Lanka',
      companyName: 'IFS Sri Lanka',
      industry: 'Information Technology',
      size: '500+',
      foundedYear: 1983,
      website: 'https://ifs.com',
      tagline: 'Enterprise software solutions',
      description: 'IFS develops and delivers enterprise software for customers around the world who manufacture and distribute goods, build and maintain assets, and manage service-focused operations.',
      location: 'Colombo, Sri Lanka',
      phone: '+94 11 437 9000',
    },
    {
      email: 'jobs@virtusa.com',
      password: 'Company@2026',
      name: 'Virtusa Sri Lanka',
      companyName: 'Virtusa Sri Lanka',
      industry: 'IT Services & Consulting',
      size: '500+',
      foundedYear: 1996,
      website: 'https://virtusa.com',
      tagline: 'Engineering first',
      description: 'Virtusa is a global provider of digital engineering and IT outsourcing services. We help companies bring innovations to market faster through agile engineering.',
      location: 'Colombo, Sri Lanka',
      phone: '+94 11 470 9100',
    },
    {
      email: 'hr@99x.io',
      password: 'Company@2026',
      name: '99X Technology',
      companyName: '99X Technology',
      industry: 'Software Development',
      size: '201-500',
      foundedYear: 2008,
      website: 'https://99x.io',
      tagline: 'Build digital products that scale',
      description: 'We are a leading Sri Lankan software product engineering company focused on building scalable digital products for global ISVs and growth-stage startups.',
      location: 'Colombo, Sri Lanka',
      phone: '+94 11 244 5444',
    },
    {
      email: 'careers@syscolabs.com',
      password: 'Company@2026',
      name: 'Sysco LABS',
      companyName: 'Sysco LABS',
      industry: 'Food Technology',
      size: '500+',
      foundedYear: 2014,
      website: 'https://syscolabs.lk',
      tagline: 'Building the future of food',
      description: 'Sysco LABS is the technology innovation arm of Sysco - the global leader in foodservice distribution. We leverage technology to transform the food industry.',
      location: 'Colombo, Sri Lanka',
      phone: '+94 11 269 0700',
    },
  ]

  const companies = []
  for (const data of companiesData) {
    const hashedPassword = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: 'COMPANY',
        emailVerified: new Date(),
        companyProfile: {
          create: {
            companyName: data.companyName,
            industry: data.industry,
            size: data.size,
            foundedYear: data.foundedYear,
            website: data.website,
            tagline: data.tagline,
            description: data.description,
            location: data.location,
            phone: data.phone,
            email: data.email,
            status: 'APPROVED',
            verifiedAt: new Date(),
          },
        },
      },
      include: { companyProfile: true },
    })
    companies.push(user.companyProfile)
    console.log(`✅ Company created: ${data.companyName}`)
  }

  // ============================================
  // CREATE JOBS (10)
  // ============================================
  console.log('💼 Creating jobs...')

  const jobsData = [
    {
      companyIndex: 0, // WSO2
      title: 'Software Engineering Intern',
      slug: 'software-engineering-intern-wso2',
      description: 'Join our team as a Software Engineering Intern and work on cutting-edge open source projects. You will collaborate with experienced engineers, contribute to real products used by enterprises worldwide, and gain hands-on experience with modern technologies.',
      requirements: 'Currently pursuing or recently completed a degree in Computer Science, Software Engineering, or related field. Strong programming fundamentals in Java, JavaScript, or Python. Familiarity with Git, REST APIs, and basic database concepts. Excellent problem-solving and communication skills.',
      benefits: 'Mentorship from senior engineers, stipend, flexible working hours, conversion to full-time opportunity, free meals, gym access.',
      type: 'INTERNSHIP',
      locationType: 'HYBRID',
      location: 'Colombo, Sri Lanka',
      category: 'Software Development',
      salaryMin: 35000,
      salaryMax: 50000,
      skills: ['Java', 'JavaScript', 'Git', 'REST APIs', 'SQL'],
      experienceMin: 0,
      educationLevel: "Bachelor's or HND",
      isFeatured: true,
    },
    {
      companyIndex: 0, // WSO2
      title: 'Frontend Developer (React)',
      slug: 'frontend-developer-react-wso2',
      description: 'We are looking for a passionate Frontend Developer to build modern user interfaces for our identity and API management platforms. You will work with React, TypeScript, and modern web technologies.',
      requirements: 'At least 2 years of experience with React. Strong knowledge of TypeScript, HTML5, CSS3, and JavaScript ES6+. Experience with state management (Redux/Zustand). Understanding of REST APIs and webpack.',
      type: 'FULL_TIME',
      locationType: 'ONSITE',
      location: 'Colombo, Sri Lanka',
      category: 'Software Development',
      salaryMin: 150000,
      salaryMax: 250000,
      skills: ['React', 'TypeScript', 'CSS3', 'Redux', 'REST APIs'],
      experienceMin: 2,
      educationLevel: "Bachelor's",
    },
    {
      companyIndex: 1, // IFS
      title: 'Junior Full Stack Developer',
      slug: 'junior-full-stack-developer-ifs',
      description: 'Looking for a Junior Full Stack Developer to join our enterprise software team. You will work on both frontend and backend, building features for our flagship products.',
      requirements: 'Fresh graduate or 0-1 year experience. Knowledge of React, Node.js, and PostgreSQL. Understanding of OOP and design patterns. Strong analytical skills.',
      type: 'FULL_TIME',
      locationType: 'HYBRID',
      location: 'Colombo, Sri Lanka',
      category: 'Software Development',
      salaryMin: 80000,
      salaryMax: 120000,
      skills: ['React', 'Node.js', 'PostgreSQL', 'OOP', 'TypeScript'],
      experienceMin: 0,
      educationLevel: "Bachelor's",
      isFeatured: true,
    },
    {
      companyIndex: 1, // IFS
      title: 'UI/UX Design Intern',
      slug: 'ui-ux-design-intern-ifs',
      description: 'Design intuitive interfaces for enterprise applications. Work with designers and product managers to deliver world-class user experiences.',
      requirements: 'Pursuing degree in Design, HCI, or related field. Proficiency in Figma. Portfolio of design work. Understanding of design systems and user research.',
      type: 'INTERNSHIP',
      locationType: 'ONSITE',
      location: 'Colombo, Sri Lanka',
      category: 'Design',
      salaryMin: 25000,
      salaryMax: 40000,
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
      experienceMin: 0,
      educationLevel: 'Diploma or HND',
    },
    {
      companyIndex: 2, // Virtusa
      title: 'Backend Developer (Java)',
      slug: 'backend-developer-java-virtusa',
      description: 'Build scalable backend services using Java and Spring Boot. Work on microservices architecture for global clients.',
      requirements: '3+ years Java experience. Spring Boot, Microservices, AWS/Azure. Strong understanding of databases (SQL and NoSQL).',
      type: 'FULL_TIME',
      locationType: 'HYBRID',
      location: 'Colombo, Sri Lanka',
      category: 'Software Development',
      salaryMin: 200000,
      salaryMax: 350000,
      skills: ['Java', 'Spring Boot', 'Microservices', 'AWS', 'MySQL'],
      experienceMin: 3,
      educationLevel: "Bachelor's",
    },
    {
      companyIndex: 2, // Virtusa
      title: 'QA Engineer Intern',
      slug: 'qa-engineer-intern-virtusa',
      description: 'Join our QA team and learn manual + automation testing. Work on real client projects.',
      requirements: 'Currently studying or recently graduated in IT/CS. Knowledge of testing concepts. Basic programming knowledge a plus.',
      type: 'INTERNSHIP',
      locationType: 'ONSITE',
      location: 'Colombo, Sri Lanka',
      category: 'Quality Assurance',
      salaryMin: 30000,
      salaryMax: 45000,
      skills: ['Manual Testing', 'Selenium', 'JIRA', 'API Testing'],
      experienceMin: 0,
      educationLevel: 'Diploma or HND',
    },
    {
      companyIndex: 3, // 99X
      title: 'Junior React Developer',
      slug: 'junior-react-developer-99x',
      description: 'Build amazing web applications for our global product companies. Work in agile teams with passionate engineers.',
      requirements: '0-2 years React experience. Strong CSS skills. Familiarity with TypeScript and modern build tools.',
      type: 'FULL_TIME',
      locationType: 'REMOTE',
      location: null,
      category: 'Software Development',
      salaryMin: 90000,
      salaryMax: 140000,
      skills: ['React', 'TypeScript', 'CSS3', 'Tailwind CSS', 'Git'],
      experienceMin: 0,
      educationLevel: "Bachelor's or HND",
      isUrgent: true,
      isFeatured: true,
    },
    {
      companyIndex: 3, // 99X
      title: 'DevOps Engineer',
      slug: 'devops-engineer-99x',
      description: 'Manage CI/CD pipelines, cloud infrastructure, and ensure high availability of our products.',
      requirements: '2+ years DevOps experience. AWS/Azure expertise. Docker, Kubernetes, Terraform. CI/CD with GitHub Actions or Jenkins.',
      type: 'FULL_TIME',
      locationType: 'HYBRID',
      location: 'Colombo, Sri Lanka',
      category: 'DevOps',
      salaryMin: 250000,
      salaryMax: 400000,
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
      experienceMin: 2,
      educationLevel: "Bachelor's",
    },
    {
      companyIndex: 4, // Sysco LABS
      title: 'Mobile Developer (React Native)',
      slug: 'mobile-developer-react-native-sysco',
      description: 'Build mobile apps used by thousands of foodservice professionals daily. Work on iOS and Android with React Native.',
      requirements: '2+ years React Native experience. Knowledge of native iOS/Android development. Experience with Redux, REST APIs, and offline-first design.',
      type: 'FULL_TIME',
      locationType: 'ONSITE',
      location: 'Colombo, Sri Lanka',
      category: 'Mobile Development',
      salaryMin: 180000,
      salaryMax: 280000,
      skills: ['React Native', 'JavaScript', 'iOS', 'Android', 'Redux'],
      experienceMin: 2,
      educationLevel: "Bachelor's",
    },
    {
      companyIndex: 4, // Sysco LABS
      title: 'Data Engineering Intern',
      slug: 'data-engineering-intern-sysco',
      description: 'Help build data pipelines that process millions of food orders. Learn from senior data engineers.',
      requirements: 'CS/IT student in final year. Python knowledge. SQL fundamentals. Interest in big data and ETL.',
      type: 'INTERNSHIP',
      locationType: 'HYBRID',
      location: 'Colombo, Sri Lanka',
      category: 'Data Engineering',
      salaryMin: 40000,
      salaryMax: 55000,
      skills: ['Python', 'SQL', 'ETL', 'Pandas', 'AWS'],
      experienceMin: 0,
      educationLevel: "Bachelor's or HND",
      isFeatured: true,
    },
  ]

  for (const job of jobsData) {
    const { companyIndex, ...jobData } = job
    await prisma.job.create({
      data: {
        ...jobData,
        companyId: companies[companyIndex].id,
        status: 'ACTIVE',
        postedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000), // random in last 14 days
        closesAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        viewCount: Math.floor(Math.random() * 500),
      },
    })
    console.log(`✅ Job created: ${job.title}`)
  }

  console.log('\n🎉 Seed completed successfully!\n')
  console.log('📊 Summary:')
  console.log('   - 1 Admin user')
  console.log('   - 5 Companies (all approved)')
  console.log('   - 10 Jobs (all active)')
  console.log('\n🔑 Login credentials:')
  console.log('   Admin: admin@careerlanka.com / Admin@2026')
  console.log('   Company: hr@wso2.com / Company@2026')
  console.log('   (All companies use password: Company@2026)\n')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })