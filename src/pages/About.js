import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      <div className="container">
        <div className="about-content">
          <header className="about-header">
            <h1>About Me</h1>
            <p className="about-subtitle">Molecular biologist, educator, and visionary thinker bridging science, education, and entrepreneurship across Africa.</p>
          </header>

          <div className="about-grid">
            <div className="about-main">
              <div className="about-section">
                <h2>Who I Am</h2>
                <p>
                  I'm Eric Kyambadde — a molecular biologist, former assistant lecturer of biotechnology, and pharmaceutical industry professional turned visionary thinker. My journey bridges science, education, governance, and entrepreneurship across Africa.
                </p>
                <p>
                  With experience in biotech research, academia, and pharmaceutical sector, I've come to believe that biology is more than a subject — it's a toolkit for innovation, economic transformation, and solving Africa's most pressing challenges.
                </p>
              </div>

              <div className="about-section">
                <h2>What I Write About</h2>
                <div className="topics-grid">
                  <div className="topic">
                    <h3>Biotechnology</h3>
                    <p>Exploring the intersection of molecular biology, healthcare innovation, and Africa's bioeconomy potential.</p>
                  </div>
                  <div className="topic">
                    <h3>Education Reform</h3>
                    <p>Examining how to transform educational systems to prepare Africa's youth for the future of work.</p>
                  </div>
                  <div className="topic">
                    <h3>Healthcare Innovation</h3>
                    <p>Analyzing pharmaceutical industry trends and healthcare solutions tailored for African contexts.</p>
                  </div>
                  <div className="topic">
                    <h3>African Bioeconomy</h3>
                    <p>Envisioning a thriving African bioeconomy—rooted in science, powered by youth, and built for the 21st century.</p>
                  </div>
                </div>
              </div>

              <div className="about-section">
                <h2>My Approach</h2>
                <p>
                  Through TROPICAL PERSPECTIVE, I share original insights at the intersection of biotechnology, healthcare, education reform, and the future of work. I write to spark conversations, challenge outdated models, and envision a thriving African bioeconomy.
                </p>
                <p>
                  Every post is researched, thoughtful, and aimed at sparking meaningful dialogue about Africa's future. Whether you're a scientist, educator, entrepreneur, or just curious about Africa's potential, there's something here for you.
                </p>
                <p>
                  Welcome to my mind in motion.
                </p>
              </div>
            </div>

            <aside className="about-sidebar">
              <div className="sidebar-section">
                <h3>Get in Touch</h3>
                <p>I'm always interested in hearing from readers. Whether you have feedback, ideas, or just want to connect, feel free to reach out.</p>
                <div className="contact-links">
                  <a href="mailto:eric@tropicalperspective.com" className="contact-link">
                    <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M0 3v18h24V3H0zm21.518 2L12 12.713 2.482 5h19.036zM2 19V7.183l10 8.104 10-8.104V19H2z"/>
                    </svg>
                    <span>Email</span>
                  </a>
                  <a href="https://twitter.com/erickyambadde" target="_blank" rel="noopener noreferrer" className="contact-link">
                    <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>@erickyambadde</span>
                  </a>
                  <a href="https://linkedin.com/in/erickyambadde" target="_blank" rel="noopener noreferrer" className="contact-link">
                    <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>erickyambadde</span>
                  </a>
                </div>
              </div>

              <div className="sidebar-section">
                <h3>Newsletter</h3>
                <p>Stay updated with my latest posts and insights. No spam, just thoughtful content.</p>
                <form className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="newsletter-input"
                  />
                  <button type="submit" className="newsletter-button">
                    Subscribe
                  </button>
                </form>
              </div>

              <div className="sidebar-section">
                <h3>Recent Posts</h3>
                <div className="recent-posts-list">
                  <a href="/post/1" className="recent-post-link">
                    <span>The Future of Artificial Intelligence</span>
                    <small>March 15, 2024</small>
                  </a>
                  <a href="/post/2" className="recent-post-link">
                    <span>Building Sustainable Cities</span>
                    <small>March 10, 2024</small>
                  </a>
                  <a href="/post/3" className="recent-post-link">
                    <span>The Power of Reading</span>
                    <small>March 5, 2024</small>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 