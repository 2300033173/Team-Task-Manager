require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User       = require('./models/User');
const Project    = require('./models/Project');
const Membership = require('./models/Membership');
const Task       = require('./models/Task');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clean existing seed data
  await User.deleteMany({ email: { $in: ['admin@demo.com', 'member@demo.com', 'member2@demo.com'] } });
  const oldProjects = await Project.find({ name: { $in: [
    'Website Redesign', 'Mobile App Launch', 'Marketing Campaign',
    'Backend API Upgrade', 'Data Analytics Dashboard'
  ]}});
  const oldIds = oldProjects.map(p => p._id);
  await Membership.deleteMany({ projectId: { $in: oldIds } });
  await Task.deleteMany({ projectId: { $in: oldIds } });
  await Project.deleteMany({ _id: { $in: oldIds } });
  console.log('Cleaned old seed data');

  // Create users
  const hash = (pw) => bcrypt.hash(pw, 10);
  const admin   = await User.create({ name: 'Admin User',   email: 'admin@demo.com',   password: await hash('admin123') });
  const member1 = await User.create({ name: 'Alice Johnson', email: 'member@demo.com',  password: await hash('member123') });
  const member2 = await User.create({ name: 'Bob Smith',     email: 'member2@demo.com', password: await hash('member123') });
  console.log('Users created');

  // Helper to create project + memberships
  const createProject = async (name, description, extraMembers = []) => {
    const project = await Project.create({ name, description, createdBy: admin._id });
    await Membership.create({ projectId: project._id, userId: admin._id,   role: 'Admin' });
    for (const m of extraMembers) {
      await Membership.create({ projectId: project._id, userId: m, role: 'Member' });
    }
    return project;
  };

  const today = new Date();
  const daysFromNow = (n) => new Date(today.getTime() + n * 86400000);

  // ── Project 1: Website Redesign ──
  const p1 = await createProject(
    'Website Redesign',
    'Complete overhaul of the company website with modern UI/UX design.',
    [member1._id, member2._id]
  );
  await Task.insertMany([
    { projectId: p1._id, title: 'Design new homepage mockup',     description: 'Create Figma mockups for the new homepage layout', priority: 'High',   status: 'Done',        dueDate: daysFromNow(-5), assignedTo: member1._id, createdBy: admin._id },
    { projectId: p1._id, title: 'Implement responsive navbar',    description: 'Build mobile-friendly navigation component',       priority: 'High',   status: 'In Progress', dueDate: daysFromNow(3),  assignedTo: member1._id, createdBy: admin._id },
    { projectId: p1._id, title: 'Write homepage copy',            description: 'Draft all text content for the new homepage',      priority: 'Medium', status: 'To Do',       dueDate: daysFromNow(7),  assignedTo: member2._id, createdBy: admin._id },
    { projectId: p1._id, title: 'SEO optimization',               description: 'Add meta tags, sitemap and structured data',       priority: 'Medium', status: 'To Do',       dueDate: daysFromNow(10), assignedTo: member2._id, createdBy: admin._id },
    { projectId: p1._id, title: 'Cross-browser testing',          description: 'Test on Chrome, Firefox, Safari and Edge',         priority: 'Low',    status: 'To Do',       dueDate: daysFromNow(14), assignedTo: member1._id, createdBy: admin._id },
    { projectId: p1._id, title: 'Fix broken links audit',         description: 'Scan and fix all 404 errors on current site',      priority: 'High',   status: 'In Progress', dueDate: daysFromNow(-2), assignedTo: member2._id, createdBy: admin._id },
  ]);

  // ── Project 2: Mobile App Launch ──
  const p2 = await createProject(
    'Mobile App Launch',
    'Launch the iOS and Android version of our task management app.',
    [member1._id, member2._id]
  );
  await Task.insertMany([
    { projectId: p2._id, title: 'Set up React Native project',    description: 'Initialize RN project with navigation and state',  priority: 'High',   status: 'Done',        dueDate: daysFromNow(-10), assignedTo: member1._id, createdBy: admin._id },
    { projectId: p2._id, title: 'Build login & signup screens',   description: 'Implement auth screens with form validation',      priority: 'High',   status: 'Done',        dueDate: daysFromNow(-7),  assignedTo: member1._id, createdBy: admin._id },
    { projectId: p2._id, title: 'Integrate push notifications',   description: 'Set up Firebase Cloud Messaging for alerts',       priority: 'Medium', status: 'In Progress', dueDate: daysFromNow(5),   assignedTo: member2._id, createdBy: admin._id },
    { projectId: p2._id, title: 'App Store submission',           description: 'Prepare screenshots, description and submit',      priority: 'High',   status: 'To Do',       dueDate: daysFromNow(20),  assignedTo: member1._id, createdBy: admin._id },
    { projectId: p2._id, title: 'Beta testing with 10 users',     description: 'Recruit testers and collect feedback',             priority: 'Medium', status: 'To Do',       dueDate: daysFromNow(12),  assignedTo: member2._id, createdBy: admin._id },
    { projectId: p2._id, title: 'Fix crash on Android 12',        description: 'Investigate and fix reported crash on startup',    priority: 'High',   status: 'In Progress', dueDate: daysFromNow(-1),  assignedTo: member2._id, createdBy: admin._id },
  ]);

  // ── Project 3: Marketing Campaign ──
  const p3 = await createProject(
    'Marketing Campaign',
    'Q4 digital marketing campaign across social media and email.',
    [member1._id]
  );
  await Task.insertMany([
    { projectId: p3._id, title: 'Create social media calendar',   description: 'Plan 30 days of posts for Instagram, Twitter, LinkedIn', priority: 'High',   status: 'Done',        dueDate: daysFromNow(-8),  assignedTo: member1._id, createdBy: admin._id },
    { projectId: p3._id, title: 'Design email newsletter',        description: 'HTML email template for monthly newsletter',             priority: 'Medium', status: 'In Progress', dueDate: daysFromNow(4),   assignedTo: member1._id, createdBy: admin._id },
    { projectId: p3._id, title: 'Set up Google Ads campaign',     description: 'Configure PPC campaign with $500 budget',               priority: 'High',   status: 'To Do',       dueDate: daysFromNow(6),   assignedTo: member1._id, createdBy: admin._id },
    { projectId: p3._id, title: 'Write 4 blog posts',             description: 'SEO-focused articles for the company blog',             priority: 'Medium', status: 'To Do',       dueDate: daysFromNow(15),  assignedTo: member1._id, createdBy: admin._id },
    { projectId: p3._id, title: 'Analyze Q3 campaign results',    description: 'Pull metrics and create performance report',            priority: 'Low',    status: 'Done',        dueDate: daysFromNow(-3),  assignedTo: member1._id, createdBy: admin._id },
  ]);

  // ── Project 4: Backend API Upgrade ──
  const p4 = await createProject(
    'Backend API Upgrade',
    'Migrate REST API to GraphQL and improve performance by 40%.',
    [member2._id]
  );
  await Task.insertMany([
    { projectId: p4._id, title: 'Audit existing REST endpoints',  description: 'Document all current API routes and payloads',     priority: 'High',   status: 'Done',        dueDate: daysFromNow(-12), assignedTo: member2._id, createdBy: admin._id },
    { projectId: p4._id, title: 'Set up GraphQL schema',          description: 'Define types, queries and mutations',              priority: 'High',   status: 'In Progress', dueDate: daysFromNow(2),   assignedTo: member2._id, createdBy: admin._id },
    { projectId: p4._id, title: 'Add Redis caching layer',        description: 'Cache frequent DB queries with Redis',             priority: 'Medium', status: 'To Do',       dueDate: daysFromNow(8),   assignedTo: member2._id, createdBy: admin._id },
    { projectId: p4._id, title: 'Write API documentation',        description: 'Update Swagger/OpenAPI docs for all endpoints',    priority: 'Low',    status: 'To Do',       dueDate: daysFromNow(18),  assignedTo: member2._id, createdBy: admin._id },
    { projectId: p4._id, title: 'Load testing with k6',           description: 'Run performance tests and fix bottlenecks',        priority: 'High',   status: 'To Do',       dueDate: daysFromNow(-4),  assignedTo: member2._id, createdBy: admin._id },
  ]);

  // ── Project 5: Data Analytics Dashboard ──
  const p5 = await createProject(
    'Data Analytics Dashboard',
    'Build an internal analytics dashboard for business KPIs.',
    [member1._id, member2._id]
  );
  await Task.insertMany([
    { projectId: p5._id, title: 'Define KPI metrics with team',   description: 'Workshop to agree on 10 key business metrics',    priority: 'High',   status: 'Done',        dueDate: daysFromNow(-15), assignedTo: member1._id, createdBy: admin._id },
    { projectId: p5._id, title: 'Connect to PostgreSQL data warehouse', description: 'Set up read-only DB connection for analytics', priority: 'High',   status: 'Done',        dueDate: daysFromNow(-9),  assignedTo: member2._id, createdBy: admin._id },
    { projectId: p5._id, title: 'Build revenue chart component',  description: 'Line chart showing monthly revenue trends',       priority: 'High',   status: 'In Progress', dueDate: daysFromNow(3),   assignedTo: member1._id, createdBy: admin._id },
    { projectId: p5._id, title: 'User activity heatmap',          description: 'Show daily active users on a calendar heatmap',   priority: 'Medium', status: 'In Progress', dueDate: daysFromNow(6),   assignedTo: member2._id, createdBy: admin._id },
    { projectId: p5._id, title: 'Export to PDF feature',          description: 'Allow dashboard export as PDF report',            priority: 'Low',    status: 'To Do',       dueDate: daysFromNow(22),  assignedTo: member1._id, createdBy: admin._id },
    { projectId: p5._id, title: 'Role-based data access',         description: 'Restrict sensitive metrics to admin users only',  priority: 'High',   status: 'To Do',       dueDate: daysFromNow(-6),  assignedTo: member2._id, createdBy: admin._id },
  ]);

  console.log('\n✅ Seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  DEMO LOGIN CREDENTIALS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  👑 Admin   → admin@demo.com   / admin123');
  console.log('  👤 Member1 → member@demo.com  / member123');
  console.log('  👤 Member2 → member2@demo.com / member123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  5 projects, 27 tasks seeded');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
