import * as React from "react";
import { useState, useEffect } from "react";
import "./global.css";

const Portfolio = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    document.querySelectorAll(".fade-in").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <nav className="container">
          <h1>
            <i className="fas fa-code"></i> John Doe
          </h1>
          <ul>
            <li>
              <a href="#about">
                <i className="fas fa-user"></i> About
              </a>
            </li>
            <li>
              <a href="#skills">
                <i className="fas fa-cogs"></i> Skills
              </a>
            </li>
            <li>
              <a href="#projects">
                <i className="fas fa-project-diagram"></i> Projects
              </a>
            </li>
            <li>
              <a href="#testimonials">
                <i className="fas fa-quote-left"></i> Testimonials
              </a>
            </li>
            <li>
              <a href="#education">
                <i className="fas fa-graduation-cap"></i> Education
              </a>
            </li>
            <li>
              <a href="#contact">
                <i className="fas fa-envelope"></i> Contact
              </a>
            </li>
          </ul>
          <button
            className="toggle-btn"
            onClick={toggleDarkMode}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <div className={`toggle-switch ${isDarkMode ? "dark" : "light"}`}>
              {/* {isDarkMode ? (
                <div className={`toggle-icon moon `}>🌙</div>
              ) : (
                <div className={`toggle-icon sun `}>☀️</div>
              )} */}
              {/*  */}
              {/*  */}
              <div className="toggle-circle">{isDarkMode ? "🌙" : "☀️"}</div>
            </div>
          </button>
        </nav>
      </header>

      <main>
        {/* About Section */}
        <section id="about" className="about-section fade-in">
          <div className="container">
            <h2>
              <i className="fas fa-user-circle"></i> About Me
            </h2>
            <div className="about-content">
              <div className="about-text">
                <p>
                  Experienced Full Stack Developer with 3 years of expertise in
                  MERN stack technologies. Passionate about building scalable
                  web applications and solving complex problems. Skilled in
                  developing RESTful APIs, managing databases, and creating
                  responsive user interfaces.
                </p>
              </div>
              <div className="about-image">
                <svg
                  className="avatar"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="var(--primary-color)"
                  />
                  <circle
                    cx="100"
                    cy="85"
                    r="40"
                    fill="var(--background-light)"
                  />
                  <path
                    d="M60 140 Q100 180 140 140"
                    fill="var(--background-light)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="skills-section fade-in">
          <div className="container">
            <h2>
              <i className="fas fa-laptop-code"></i> My Skills
            </h2>
            <div className="skills-grid">
              {[
                { name: "MongoDB", icon: "fas fa-database" },
                { name: "Express.js", icon: "fab fa-node-js" },
                { name: "React", icon: "fab fa-react" },
                { name: "Node.js", icon: "fab fa-node" },
                { name: "JavaScript", icon: "fab fa-js" },
                { name: "TypeScript", icon: "fas fa-code" },
                { name: "RESTful APIs", icon: "fas fa-server" },
                { name: "Git", icon: "fab fa-git-alt" },
                { name: "Docker", icon: "fab fa-docker" },
              ].map((skill) => (
                <div key={skill.name} className="skill-item">
                  <i className={`${skill.icon} skill-icon`}></i>
                  <span className="skill-name">{skill.name}</span>
                  <div className="skill-bar">
                    <div
                      className="skill-level"
                      style={{ width: `${Math.random() * 30 + 70}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects-section fade-in">
          <div className="container">
            <h2>
              <i className="fas fa-code-branch"></i> My Projects
            </h2>
            <div className="project-grid">
              <div className="project-card">
                <h3>
                  <i className="fas fa-shopping-cart"></i> E-commerce Platform
                </h3>
                <p>
                  A full-stack e-commerce solution with user authentication,
                  product management, and payment integration.
                </p>
                <p>
                  <strong>Tech Stack:</strong> React, Node.js, Express, MongoDB,
                  Stripe API
                </p>
                <a href="#" className="project-link">
                  <i className="fas fa-external-link-alt"></i> View Project
                </a>
              </div>
              <div className="project-card">
                <h3>
                  <i className="fas fa-tasks"></i> Task Management App
                </h3>
                <p>
                  A collaborative task management application with real-time
                  updates and team features.
                </p>
                <p>
                  <strong>Tech Stack:</strong> React, Redux, Node.js, Express,
                  MongoDB, Socket.io
                </p>
                <a href="#" className="project-link">
                  <i className="fas fa-external-link-alt"></i> View Project
                </a>
              </div>
              <div className="project-card">
                <h3>
                  <i className="fas fa-chart-line"></i> Analytics Dashboard
                </h3>
                <p>
                  A data visualization dashboard for business metrics with
                  customizable widgets and reports.
                </p>
                <p>
                  <strong>Tech Stack:</strong> React, D3.js, Node.js, Express,
                  MongoDB, RESTful API
                </p>
                <a href="#" className="project-link">
                  <i className="fas fa-external-link-alt"></i> View Project
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="testimonials-section fade-in">
          <div className="container">
            <h2>
              <i className="fas fa-comments"></i> Testimonials
            </h2>
            <div className="testimonial-grid">
              <div className="testimonial-card">
                <i className="fas fa-quote-left quote-icon"></i>
                <p className="testimonial-text">
                  "John is an exceptional developer who consistently delivers
                  high-quality code. His expertise in the MERN stack has been
                  invaluable to our team."
                </p>
                <p className="testimonial-author">
                  - Sarah Johnson, Project Manager at TechCorp
                </p>
              </div>
              <div className="testimonial-card">
                <i className="fas fa-quote-left quote-icon"></i>
                <p className="testimonial-text">
                  "Working with John was a pleasure. He's not only skilled in
                  development but also great at communicating complex technical
                  concepts to non-technical stakeholders."
                </p>
                <p className="testimonial-author">
                  - Mike Chen, CTO at StartupX
                </p>
              </div>
              <div className="testimonial-card">
                <i className="fas fa-quote-left quote-icon"></i>
                <p className="testimonial-text">
                  "John's problem-solving skills and attention to detail make
                  him stand out. He's always eager to learn and implement new
                  technologies."
                </p>
                <p className="testimonial-author">
                  - Emily Davis, Senior Developer at InnovateTech
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="education-section fade-in">
          <div className="container">
            <h2>
              <i className="fas fa-university"></i> Education
            </h2>
            <div className="education-timeline">
              <div className="education-item">
                <h3>
                  <i className="fas fa-laptop-code"></i> Bachelor's Degree in
                  Computer Science
                </h3>
                <p>
                  <i className="fas fa-calendar-alt"></i> Tech University,
                  2016-2020
                </p>
                <p>
                  Focused on web development, algorithms, and database
                  management. Graduated with honors.
                </p>
              </div>
              <div className="education-item">
                <h3>
                  <i className="fas fa-certificate"></i> Full Stack Web
                  Development Bootcamp
                </h3>
                <p>
                  <i className="fas fa-calendar-alt"></i> CodeCamp Academy, 2020
                </p>
                <p>
                  Intensive 12-week program covering modern web development
                  practices and MERN stack technologies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section fade-in">
          <div className="container">
            <h2>
              <i className="fas fa-paper-plane"></i> Contact Me
            </h2>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">
                  <i className="fas fa-user"></i> Name
                </label>
                <input type="text" id="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  <i className="fas fa-envelope"></i> Email
                </label>
                <input type="email" id="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">
                  <i className="fas fa-comment"></i> Message
                </label>
                <textarea id="message" rows={4} required></textarea>
              </div>
              <button type="submit" className="submit-button">
                <i className="fas fa-send"></i> Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} John Doe. All rights reserved.
          </p>
          <div className="social-icons">
            <a href="#" className="social-icon">
              <i className="fab fa-github"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
