import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { getAllPostsMetadata } from '../utils/markdownUtils';






const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [subscriptionError, setSubscriptionError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const allPosts = await getAllPostsMetadata();
        console.log('Loaded posts:', allPosts); // Debug log
        setPosts(allPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Get featured posts (first 3 posts with images)
  const featuredPosts = posts.filter(post => post.image).slice(0, 3);
  
  // Get recent posts (all posts, excluding featured ones)
  const recentPosts = posts.filter(post => !featuredPosts.some(featured => featured.slug === post.slug)).slice(0, 3);

  // Debug logs
  console.log('Featured posts:', featuredPosts);
  console.log('Recent posts:', recentPosts);

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscriptionError('Please enter your email address');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionError('');
    setSubscriptionMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/email/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || null
        })
      });

      const data = await response.json();

      if (data.success) {
        setSubscriptionMessage(data.message);
        setEmail('');
        setName('');
      } else {
        setSubscriptionError(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscriptionError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="home">
        <div className="container">
          <div className="loading">
            <h1>Loading...</h1>
            <p>Please wait while we load the latest posts.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-logo">
              <img src={process.env.PUBLIC_URL + "/logo.png"} alt="TROPICAL PERSPECTIVE" className="hero-logo-image" />
            </div>

            <p>Tropical Perspective distills a pure African philosophy toward science, innovation, 
              entrepreneurship, education, and AI — inspiring a new generation to craft Africa-centered 
              solutions for the continent’s toughest challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="featured-posts">
        <div className="container">
          <div className="section-header">
            <h2>Featured Posts</h2>
            <Link to="/blog" className="view-all-link">View All Posts →</Link>
          </div>
          <div className="posts-grid">
            {featuredPosts.map(post => (
              <article key={post.slug} className="post-card featured">
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
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
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
          <div className="section-header">
            <h2>Recent Posts</h2>
            <Link to="/blog" className="view-all-link">View All Posts →</Link>
          </div>
          <div className="posts-list">
            {recentPosts.map(post => (
              <article key={post.slug} className="post-item">
                <div className="post-content">
                  <div className="post-meta">
                    <span className="post-category">{post.category}</span>
                    <span className="post-date">{post.date}</span>
                    <span className="post-read-time">{post.readTime}</span>
                  </div>
                  <h3 className="post-title">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
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
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="text" 
                placeholder="Your name (optional)" 
                className="newsletter-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="newsletter-button"
                disabled={isSubscribing}
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            
            {subscriptionMessage && (
              <div className="subscription-message success">
                {subscriptionMessage}
              </div>
            )}
            
            {subscriptionError && (
              <div className="subscription-message error">
                {subscriptionError}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;




