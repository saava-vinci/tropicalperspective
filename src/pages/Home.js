import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const featuredPosts = [
    {
      id: 1,
      title: "The Future of Artificial Intelligence",
      excerpt: "Exploring how AI will transform our world in the coming decades and what we need to prepare for.",
      category: "Technology",
      date: "March 15, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Building Sustainable Cities",
      excerpt: "How urban planning and technology can create more livable, environmentally friendly cities.",
      category: "Innovation",
      date: "March 10, 2024",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "The Power of Reading",
      excerpt: "Why reading remains one of the most important skills in the digital age.",
      category: "Education",
      date: "March 5, 2024",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop"
    }
  ];

  const recentPosts = [
    {
      id: 4,
      title: "Climate Change Solutions",
      excerpt: "Innovative approaches to addressing the climate crisis.",
      category: "Environment",
      date: "March 1, 2024",
      readTime: "6 min read"
    },
    {
      id: 5,
      title: "Digital Privacy in 2024",
      excerpt: "How to protect your data in an increasingly connected world.",
      category: "Technology",
      date: "February 25, 2024",
      readTime: "8 min read"
    },
    {
      id: 6,
      title: "The Future of Work",
      excerpt: "How remote work and automation are reshaping employment.",
      category: "Society",
      date: "February 20, 2024",
      readTime: "5 min read"
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-logo">
              <img src={process.env.PUBLIC_URL + "/logo.png"} alt="TROPICAL PERSPECTIVE" className="hero-logo-image" />
            </div>

            <p>Tropical Perspective is where innovation, biotechnology, AI, and the future of work meet African insight. 
              I share ideas on building sustainable bioeconomies, AI-ready education, and technological progress—all 
              through the lens of an African mind shaping solutions for the continent and beyond.
            </p>
            {/*<div className="hero-stats">
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Articles</span>
              </div>
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Readers</span>
              </div>
              <div className="stat">
                <span className="stat-number">5</span>
                <span className="stat-label">Years</span>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="featured-posts">
        <div className="container">
          <h2>Featured Posts</h2>
          <div className="posts-grid">
            {featuredPosts.map(post => (
              <article key={post.id} className="post-card featured">
                <div className="post-image">
                  <img src={post.image} alt={post.title} />
                </div>
                <div className="post-content">
                  <div className="post-meta">
                    <span className="post-category">{post.category}</span>
                    <span className="post-date">{post.date}</span>
                    <span className="post-read-time">{post.readTime}</span>
                  </div>
                  <h3 className="post-title">
                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="recent-posts">
        <div className="container">
          <h2>Recent Posts</h2>
          <div className="posts-list">
            {recentPosts.map(post => (
              <article key={post.id} className="post-item">
                <div className="post-content">
                  <div className="post-meta">
                    <span className="post-category">{post.category}</span>
                    <span className="post-date">{post.date}</span>
                    <span className="post-read-time">{post.readTime}</span>
                  </div>
                  <h3 className="post-title">
                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section" id="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Get the latest posts and insights delivered to your inbox.</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-button">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 