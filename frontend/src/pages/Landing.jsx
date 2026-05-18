import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Centered Navbar */}
      <nav className="landing-nav" style={{ justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <a href="#home" onClick={() => scrollToSection('home')} style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>Home</a>
          <a href="#faq" onClick={() => scrollToSection('faq')} style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>Q&A</a>
          <div className="landing-nav-brand">🗂 Task Manager</div>
          <a href="#about" onClick={() => scrollToSection('about')} style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>About Us</a>
          <a href="#contact" onClick={() => scrollToSection('contact')} style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>Contact</a>
        </div>
      </nav>

      {/* Hero Section - Special & Unique */}
      <div className="landing-wrapper" id="home" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #ffebee 50%, #f5f5f5 100%)', paddingTop: '100px' }}>
        <div className="landing-hero">
          <div style={{ fontSize: '80px', marginBottom: '20px', animation: 'pulse 2s infinite' }}>🚀</div>
          <h1 className="landing-title" style={{ fontSize: '48px', background: 'linear-gradient(135deg, #d32f2f, #b71c1c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
            Team Task Manager
          </h1>
          <p className="landing-subtitle" style={{ fontSize: '18px', fontWeight: 500 }}>
            Empower your team. Organize your projects. Achieve your goals.<br />
            <span style={{ color: '#d32f2f', fontWeight: 700 }}>Real-time collaboration. Zero complexity.</span>
          </p>
        </div>

        {/* Feature Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '900px', margin: '50px auto', width: '100%' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(211,47,47,0.1)', border: '2px solid #ffebee' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
            <h3 style={{ color: '#d32f2f', marginBottom: '8px', fontWeight: 700 }}>Live Dashboard</h3>
            <p style={{ fontSize: '13px', color: '#666' }}>Track progress in real-time with beautiful analytics and insights.</p>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(211,47,47,0.1)', border: '2px solid #ffebee' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
            <h3 style={{ color: '#d32f2f', marginBottom: '8px', fontWeight: 700 }}>Team Collab</h3>
            <p style={{ fontSize: '13px', color: '#666' }}>Assign tasks, manage members, and collaborate seamlessly.</p>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(211,47,47,0.1)', border: '2px solid #ffebee' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚡</div>
            <h3 style={{ color: '#d32f2f', marginBottom: '8px', fontWeight: 700 }}>Lightning Fast</h3>
            <p style={{ fontSize: '13px', color: '#666' }}>Built with modern tech. Deployed globally. Always available.</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '60px' }}>
          <button className="btn btn-primary" onClick={() => navigate('/login?role=admin')} style={{ padding: '14px 32px', fontSize: '16px', fontWeight: 700 }}>
            👑 Admin Login
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/login?role=member')} style={{ padding: '14px 32px', fontSize: '16px', fontWeight: 700, background: '#388e3c' }}>
            👤 Member Login
          </button>
        </div>

        {/* Demo Credentials */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', maxWidth: '600px', margin: '0 auto 40px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '2px solid #d32f2f' }}>
          <h3 style={{ color: '#d32f2f', marginBottom: '12px', fontSize: '14px', fontWeight: 700 }}>🎯 Try Demo Credentials</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12px' }}>
            <div>
              <strong style={{ color: '#d32f2f' }}>Admin Account:</strong>
              <p style={{ color: '#666', margin: '4px 0' }}>📧 admin@demo.com</p>
              <p style={{ color: '#666' }}>🔑 admin123</p>
            </div>
            <div>
              <strong style={{ color: '#388e3c' }}>Member Account:</strong>
              <p style={{ color: '#666', margin: '4px 0' }}>📧 member@demo.com</p>
              <p style={{ color: '#666' }}>🔑 member123</p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="landing-features" style={{ marginBottom: '40px' }}>
          <div className="feature-item"><span className="feature-icon">⚛️</span><span>React 18</span></div>
          <div className="feature-item"><span className="feature-icon">🟢</span><span>Node.js</span></div>
          <div className="feature-item"><span className="feature-icon">🍃</span><span>MongoDB</span></div>
          <div className="feature-item"><span className="feature-icon">🔐</span><span>JWT Auth</span></div>
          <div className="feature-item"><span className="feature-icon">🚀</span><span>Railway</span></div>
        </div>
      </div>

      {/* FAQ Section */}
      <section id="faq" style={{ background: 'white', padding: '60px 20px', borderTop: '3px solid #d32f2f' }}>
        <div className="container">
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '30px', color: '#1a1a1a' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="card">
              <h3 style={{ color: '#d32f2f', marginBottom: '8px' }}>What is Team Task Manager?</h3>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>A collaborative platform for teams to create projects, assign tasks, and track progress in real-time with role-based access control.</p>
            </div>
            <div className="card">
              <h3 style={{ color: '#d32f2f', marginBottom: '8px' }}>How do I create a project?</h3>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>Sign in as Admin, go to Projects, click "New Project", fill in the details, and you're done. You automatically become the Admin.</p>
            </div>
            <div className="card">
              <h3 style={{ color: '#d32f2f', marginBottom: '8px' }}>Can members create tasks?</h3>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>No, only Admins can create tasks. Members can view all tasks and update only those assigned to them.</p>
            </div>
            <div className="card">
              <h3 style={{ color: '#d32f2f', marginBottom: '8px' }}>How do I add team members?</h3>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>As Admin, open a project, click "Add Member", enter their email, and they'll be added as a Member to that project.</p>
            </div>
            <div className="card">
              <h3 style={{ color: '#d32f2f', marginBottom: '8px' }}>What are task statuses?</h3>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>Tasks have three statuses: To Do, In Progress, and Done. Members can update the status of their assigned tasks.</p>
            </div>
            <div className="card">
              <h3 style={{ color: '#d32f2f', marginBottom: '8px' }}>Is my data secure?</h3>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>Yes! We use JWT authentication, bcrypt password hashing, and MongoDB for secure data storage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ background: '#f8f8f8', padding: '60px 20px', borderTop: '3px solid #d32f2f' }}>
        <div className="container">
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '30px', color: '#1a1a1a' }}>About Us</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.8', marginBottom: '16px' }}>
                Team Task Manager is a modern, lightweight project management tool designed for teams of all sizes. Built with cutting-edge technology, it provides a seamless experience for managing projects and tasks.
              </p>
              <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.8', marginBottom: '16px' }}>
                Our mission is to simplify team collaboration and make project management accessible to everyone. Whether you're a startup or an enterprise, we've got you covered.
              </p>
              <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#d32f2f' }}>100%</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Open Source</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#d32f2f' }}>24/7</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Available</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#d32f2f' }}>∞</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Scalable</div>
                </div>
              </div>
            </div>
            <div className="card">
              <h3 style={{ color: '#d32f2f', marginBottom: '12px' }}>Tech Stack</h3>
              <ul style={{ listStyle: 'none', fontSize: '13px', color: '#666' }}>
                <li style={{ padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>⚛️ React 18 - Frontend</li>
                <li style={{ padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>🟢 Node.js/Express - Backend</li>
                <li style={{ padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>🍃 MongoDB - Database</li>
                <li style={{ padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>🔐 JWT - Authentication</li>
                <li style={{ padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>🚀 Railway - Deployment</li>
                <li style={{ padding: '6px 0' }}>🎨 Custom CSS - Styling</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ background: 'white', padding: '60px 20px', borderTop: '3px solid #d32f2f' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '30px', color: '#1a1a1a', textAlign: 'center' }}>Get in Touch</h2>
          <div className="card">
            <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="Your name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea placeholder="Your message..." rows={4} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
            </form>
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f0f0f0', textAlign: 'center', fontSize: '13px', color: '#888' }}>
              📧 support@taskmanager.com | 📱 +1 (555) 123-4567
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', color: 'white', padding: '30px 20px', textAlign: 'center', fontSize: '12px' }}>
        <p>© 2024 Team Task Manager. Built with React, Node.js & MongoDB. Deployed on Railway.</p>
        <p style={{ marginTop: '8px', color: '#999' }}>Owner: TADIMARRI VARDHINI REDDY</p>
      </footer>
    </div>
  );
}
