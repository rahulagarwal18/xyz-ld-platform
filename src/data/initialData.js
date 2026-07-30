export const USERS = [
  {
    id: 'admin',
    name: 'L&D Administrator',
    email: 'admin@xyz.com',
    role: 'Admin',
    department: 'Learning & Development',
    avatar: '👑',
    targetCategory: 'All'
  },
  {
    id: 'user_1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@xyz.com',
    role: 'Senior AI Engineer',
    department: 'Engineering',
    avatar: '👩‍💻',
    targetCategory: 'Engineering'
  },
  {
    id: 'user_2',
    name: 'Alex Rivera',
    email: 'alex.rivera@xyz.com',
    role: 'Group Product Manager',
    department: 'Product',
    avatar: '👨‍💼',
    targetCategory: 'Product'
  },
  {
    id: 'user_3',
    name: 'Priya Sharma',
    email: 'priya.sharma@xyz.com',
    role: 'HR Operations Lead',
    department: 'HR',
    avatar: '👩‍🏫',
    targetCategory: 'HR'
  }
];

export const INITIAL_CONFERENCES = [
  {
    id: 'conf-1',
    title: 'AI Ready Mindset',
    subtitle: 'Harnessing GenAI, Prompt Engineering & Enterprise LLM Workflows',
    category: 'Technology & AI',
    targetAudience: ['Engineering', 'Product', 'All Employees'],
    totalSeats: 100,
    registeredCount: 88,
    checkedInCount: 42,
    date: 'Aug 15, 2026',
    time: '10:00 AM - 01:00 PM EST',
    location: 'Main Auditorium & Global Virtual Stream',
    speaker: 'Dr. Elena Rostova (Chief AI Officer)',
    bannerTag: 'Featured Keynote 01',
    image: '/images/ai_mindset.jpg',
    description: 'Transform how you work with state-of-the-art AI automation, prompt architectures, and local model integrations customized for xyz operations.',
    status: 'Upcoming'
  },
  {
    id: 'conf-2',
    title: 'Leading at xyz',
    subtitle: 'Managerial Excellence, Cross-Functional Alignment & Team Empowerment',
    category: 'Leadership & Management',
    targetAudience: ['Leadership', 'Managers', 'HR', 'Product'],
    totalSeats: 60,
    registeredCount: 54,
    checkedInCount: 31,
    date: 'Aug 22, 2026',
    time: '02:00 PM - 05:00 PM EST',
    location: 'Executive Suite A & Live Webcast',
    speaker: 'Marcus Vance (VP of Operations)',
    bannerTag: 'Executive Leadership Series',
    image: '/images/leading_xyz.jpg',
    description: 'Master strategic decision-making, performance coaching, and fostering high-trust teams aligned with xyz strategic vision.',
    status: 'Upcoming'
  },
  {
    id: 'conf-3',
    title: 'Career at xyz',
    subtitle: 'Navigating Growth Paths, Mentorship Frameworks & Skill Elevation',
    category: 'Career & Personal Growth',
    targetAudience: ['All Employees', 'New Hires', 'HR'],
    totalSeats: 150,
    registeredCount: 62,
    checkedInCount: 15,
    date: 'Sep 05, 2026',
    time: '11:00 AM - 01:00 PM EST',
    location: 'Innovation Hall B & Global Stream',
    speaker: 'People Ops Leadership Team',
    bannerTag: 'Career Growth Summit',
    image: '/images/career_xyz.jpg',
    description: 'Discover internal career pathways, mentorship pairing, promotion criteria, and continuous learning funds at xyz.',
    status: 'Upcoming'
  },
  {
    id: 'conf-4',
    title: 'Cloud Native Architecture & Security',
    subtitle: 'Zero-Trust Models, Microservices Scalability & DevOps Automation',
    category: 'Engineering & Infrastructure',
    targetAudience: ['Engineering', 'DevOps', 'Security'],
    totalSeats: 80,
    registeredCount: 72,
    checkedInCount: 38,
    date: 'Sep 18, 2026',
    time: '09:30 AM - 12:30 PM EST',
    location: 'Tech Hub Room 402 & Teams Stream',
    speaker: 'David Thorne (Head of Infrastructure)',
    bannerTag: 'Deep Tech Series',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    description: 'An architectural deep dive into resilient cloud infrastructure, security compliance, and microservices design at xyz scale.',
    status: 'Upcoming'
  },
  {
    id: 'conf-5',
    title: 'Design Systems & Enterprise UX',
    subtitle: 'Crafting Intuitive Interfaces, Accessibility Standards & UI Tokens',
    category: 'Design & Product',
    targetAudience: ['Design', 'Product', 'Frontend'],
    totalSeats: 50,
    registeredCount: 22,
    checkedInCount: 10,
    date: 'Sep 28, 2026',
    time: '03:00 PM - 05:00 PM EST',
    location: 'Design Studio 3B & Figma Live',
    speaker: 'Chloe Lin (Lead Product Designer)',
    bannerTag: 'UX Design Summit',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    description: 'Learn how xyz design token system ensures seamless accessibility, brand consistency, and high-velocity frontend development.',
    status: 'Upcoming'
  }
];

export const INITIAL_REGISTRATIONS = [
  {
    id: 'reg-101',
    conferenceId: 'conf-1',
    userId: 'user_1',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.jenkins@xyz.com',
    department: 'Engineering',
    mealPreference: 'Veg 🥗',
    needCab: true,
    cabPickupLocation: 'City Tech Park Shuttle Station',
    cabPickupSlot: '09:15 AM Batch',
    registeredAt: '2026-07-28T09:30:00Z',
    checkedIn: true,
    checkedInAt: '2026-08-15T09:45:00Z'
  },
  {
    id: 'reg-102',
    conferenceId: 'conf-1',
    userId: 'user_2',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@xyz.com',
    department: 'Product',
    mealPreference: 'Non-Veg 🍗',
    needCab: false,
    cabPickupLocation: 'N/A',
    cabPickupSlot: 'N/A',
    registeredAt: '2026-07-29T11:00:00Z',
    checkedIn: false,
    checkedInAt: null
  },
  {
    id: 'reg-103',
    conferenceId: 'conf-2',
    userId: 'user_2',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@xyz.com',
    department: 'Product',
    mealPreference: 'Vegan 🌿',
    needCab: true,
    cabPickupLocation: 'Main HQ Tower A',
    cabPickupSlot: '01:30 PM Batch',
    registeredAt: '2026-07-29T14:20:00Z',
    checkedIn: true,
    checkedInAt: '2026-08-22T01:45:00Z'
  },
  {
    id: 'reg-104',
    conferenceId: 'conf-3',
    userId: 'user_3',
    userName: 'Priya Sharma',
    userEmail: 'priya.sharma@xyz.com',
    department: 'HR',
    mealPreference: 'Jain 🍲',
    needCab: true,
    cabPickupLocation: 'North Metro Gate 2',
    cabPickupSlot: '10:15 AM Batch',
    registeredAt: '2026-07-30T08:10:00Z',
    checkedIn: false,
    checkedInAt: null
  }
];

export const INITIAL_EMAILS = [
  {
    id: 'email-1',
    type: 'Broadcast',
    recipientEmail: 'all-employees@xyz.com',
    recipientName: 'All xyz Employees',
    subject: '📢 Announcement: AI Ready Mindset & Leadership Series Open for Registration',
    preview: 'Learning & Development Department is excited to unveil 3 new flagship conferences...',
    content: `
      <h2>xyz Learning & Development Department</h2>
      <p>Dear Colleague,</p>
      <p>We are thrilled to announce our Q3 Conference & Workshop calendar! Whether you want to master AI tools, elevate your leadership skills, or map your career progression, xyz L&D has designed these programs for you:</p>
      <ul>
        <li><strong>AI Ready Mindset</strong> - Aug 15, 2026</li>
        <li><strong>Leading at xyz</strong> - Aug 22, 2026</li>
        <li><strong>Career at xyz</strong> - Sep 05, 2026</li>
      </ul>
      <p>Seats are strictly limited and filled on a first-come, first-served basis. Meal options and shuttle cabs can be requested during registration.</p>
      <p>Best regards,<br/><strong>xyz L&D Team</strong></p>
    `,
    timestamp: '2026-07-28T08:00:00Z',
    read: true,
    badgeColor: 'bg-[#0066cc]'
  },
  {
    id: 'email-2',
    type: 'Confirmation',
    recipientEmail: 'sarah.jenkins@xyz.com',
    recipientName: 'Sarah Jenkins',
    subject: '✅ Registration Confirmation: AI Ready Mindset',
    preview: 'Your seat for AI Ready Mindset is secured. Meal: Veg 🥗 | Cab: Yes (City Tech Park)...',
    content: `
      <h2>Registration Confirmation</h2>
      <p>Hi Sarah Jenkins,</p>
      <p>You are successfully registered for <strong>AI Ready Mindset</strong>!</p>
      <div style="background:#f4f6f9; padding:15px; border-radius:8px; margin:15px 0; border:1px solid #cbd5e1;">
        <p><strong>Date & Time:</strong> Aug 15, 2026 (10:00 AM - 01:00 PM EST)</p>
        <p><strong>Venue:</strong> Main Auditorium & Global Virtual Stream</p>
        <p><strong>Meal Preference:</strong> Veg 🥗</p>
        <p><strong>Cab Shuttle Booking:</strong> Confirmed (City Tech Park Shuttle Station @ 09:15 AM)</p>
      </div>
      <p>Please present your digital check-in badge upon arrival.</p>
      <p>Regards,<br/>xyz Learning and Devlopemnt department</p>
    `,
    timestamp: '2026-07-28T09:30:00Z',
    read: true,
    badgeColor: 'bg-emerald-600'
  }
];
