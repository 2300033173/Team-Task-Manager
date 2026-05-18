# 🗂 Team Task Manager

A modern, full-stack collaborative project management application built with React, Node.js, and MongoDB. Manage projects, assign tasks, and track team progress in real-time.

**Owner:** TADIMARRI VARDHINI REDDY

---

## 🚀 Features

### Admin Capabilities
- ✅ Create and manage projects
- ✅ Add/remove team members
- ✅ Create, edit, and delete tasks
- ✅ Assign tasks to team members
- ✅ View comprehensive dashboard analytics
- ✅ Track tasks per member
- ✅ Monitor overdue tasks

### Member Capabilities
- ✅ View assigned projects
- ✅ See all project tasks
- ✅ Update assigned tasks (status & description)
- ✅ Track personal task progress
- ✅ View personal dashboard
- ✅ Filter tasks (All Tasks / Assigned to Me)

### Core Features
- 🔐 JWT-based authentication with bcrypt password hashing
- 📊 Live dashboard with real-time statistics
- 📋 Kanban board with three task statuses (To Do, In Progress, Done)
- ⚠️ Overdue task alerts
- 👥 Role-based access control (Admin/Member)
- 🎨 Red & white modern UI with responsive design
- 📱 Mobile-friendly interface

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Vite** - Build tool
- **CSS3** - Styling (red & white theme)

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests
- **Morgan** - HTTP logging

### Deployment
- **Railway** - Cloud platform
- **Docker** - Containerization

---

## 📋 Project Structure

```
Team Task Manager app/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── projectController.js  # Project management
│   │   ├── taskController.js     # Task management
│   │   └── dashboardController.js # Dashboard data
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── projectAdmin.js       # Admin role check
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Project.js            # Project schema
│   │   ├── Task.js               # Task schema
│   │   └── Membership.js         # Project membership
│   ├── routes/
│   │   ├── auth.js               # Auth endpoints
│   │   ├── projects.js           # Project endpoints
│   │   └── dashboard.js          # Dashboard endpoints
│   ├── server.js                 # Express server
│   ├── seed.js                   # Database seeding
│   ├── Dockerfile                # Docker config
│   ├── Procfile                  # Railway config
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx        # Navigation bar
│   │   ├── pages/
│   │   │   ├── Landing.jsx       # Home page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Signup.jsx        # Signup page
│   │   │   ├── Dashboard.jsx     # User dashboard
│   │   │   ├── Projects.jsx      # Projects list
│   │   │   └── ProjectDetail.jsx # Project detail
│   │   ├── App.jsx               # Main app
│   │   ├── api.js                # API calls
│   │   ├── index.css             # Global styles
│   │   └── main.jsx              # React entry
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json                  # Root scripts
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB Atlas account (free tier available)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Team Task Manager app"
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Setup environment variables**

   **Backend** (`backend/.env`):
   ```
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/teamtaskmanager
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```

   **Frontend** (`frontend/.env`):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Seed demo data** (optional)
   ```bash
   cd backend
   node seed.js
   ```

### Development

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

### Demo Credentials

**Admin Account:**
- Email: `admin@demo.com`
- Password: `admin123`

**Member Account:**
- Email: `member@demo.com`
- Password: `member123`

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:projectId` - Get project details
- `POST /api/projects/:projectId/members` - Add member (Admin only)
- `DELETE /api/projects/:projectId/members/:userId` - Remove member (Admin only)

### Tasks
- `GET /api/projects/:projectId/tasks` - List project tasks
- `POST /api/projects/:projectId/tasks` - Create task (Admin only)
- `PUT /api/projects/:projectId/tasks/:taskId` - Update task
- `DELETE /api/projects/:projectId/tasks/:taskId` - Delete task (Admin only)
- `POST /api/projects/:projectId/tasks/:taskId/assign` - Assign task (Admin only)

### Dashboard
- `GET /api/dashboard/user` - Get user dashboard data
- `GET /api/dashboard/project/:projectId` - Get project dashboard data

---

## 🔐 Authentication & Security

- **JWT Tokens** - Stateless authentication
- **Password Hashing** - bcrypt with 10 salt rounds
- **CORS** - Configured for frontend origin
- **Authorization Middleware** - Role-based access control
- **Input Validation** - Server-side validation on all endpoints

---

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  name: String,
  description: String,
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

### Membership
```javascript
{
  projectId: ObjectId (Project),
  userId: ObjectId (User),
  role: String (Admin/Member),
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  projectId: ObjectId (Project),
  title: String,
  description: String,
  priority: String (Low/Medium/High),
  status: String (To Do/In Progress/Done),
  dueDate: Date,
  assignedTo: ObjectId (User),
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 UI/UX Design

- **Color Scheme:** Red (#d32f2f) & White with modern gradients
- **Responsive Design:** Mobile, tablet, and desktop support
- **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation
- **Performance:** Optimized images, lazy loading, efficient CSS

---

## 🚀 Deployment on Railway

1. **Create Railway account** at https://railway.app

2. **Connect GitHub repository**

3. **Set environment variables:**
   - `MONGO_URI` - MongoDB connection string
   - `JWT_SECRET` - JWT signing secret
   - `CLIENT_URL` - Frontend URL (e.g., https://your-app.railway.app)

4. **Deploy:**
   - Railway automatically deploys on push to main branch
   - Backend runs on Railway's Node.js environment
   - Frontend is built and served statically

---

## 📝 Usage Guide

### For Admins
1. Sign up or login as Admin
2. Create a new project
3. Add team members by email
4. Create tasks and assign to members
5. Monitor progress on dashboard
6. Update or delete tasks as needed

### For Members
1. Sign up or login as Member
2. Wait for Admin to add you to a project
3. View all project tasks
4. Click on tasks assigned to you
5. Update task status and description
6. Track your progress on personal dashboard

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify `MONGO_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database name is correct

### JWT Token Expired
- Clear browser localStorage
- Login again to get new token

### CORS Error
- Verify `CLIENT_URL` in backend `.env`
- Check frontend `VITE_API_URL` matches backend URL

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Change port in `vite.config.js`

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👤 Owner

**TADIMARRI VARDHINI REDDY**

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For support, email support@taskmanager.com or open an issue on GitHub.

---

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] File attachments for tasks
- [ ] Task comments and discussions
- [ ] Advanced filtering and search
- [ ] Export reports to PDF
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] Multi-language support

---

**Built with ❤️ by TADIMARRI VARDHINI REDDY**
