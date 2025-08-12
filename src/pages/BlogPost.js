import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './BlogPost.css';

const BlogPost = () => {
  const { id } = useParams();

  // Mock blog post data - in a real app, this would come from an API
  const blogPosts = {
    1: {
      id: 1,
      title: "The Future of Artificial Intelligence",
      excerpt: "Exploring how AI will transform our world in the coming decades and what we need to prepare for.",
      content: `
        <p>Artificial Intelligence has been a topic of fascination and concern for decades. From science fiction to reality, AI has evolved from simple rule-based systems to complex neural networks that can perform tasks once thought to be uniquely human.</p>
        
        <h2>The Current State of AI</h2>
        <p>Today, we're seeing AI applications in almost every industry. From healthcare to finance, transportation to entertainment, AI is becoming an integral part of our daily lives. Machine learning algorithms are helping doctors diagnose diseases, financial institutions detect fraud, and autonomous vehicles navigate our roads.</p>
        
        <h2>What's Next?</h2>
        <p>As we look to the future, several key trends are emerging:</p>
        <ul>
          <li><strong>General AI:</strong> Moving beyond narrow AI to systems that can perform any intellectual task that a human can.</li>
          <li><strong>AI Ethics:</strong> Ensuring AI systems are fair, transparent, and accountable.</li>
          <li><strong>Human-AI Collaboration:</strong> Creating systems that augment human capabilities rather than replace them.</li>
        </ul>
        
        <h2>Preparing for the Future</h2>
        <p>The key to thriving in an AI-driven future is education and adaptation. We need to:</p>
        <ul>
          <li>Invest in AI literacy for everyone</li>
          <li>Develop new skills that complement AI capabilities</li>
          <li>Create policies that ensure AI benefits all of society</li>
        </ul>
        
        <p>The future of AI is not predetermined. It's up to us to shape it in a way that maximizes benefits while minimizing risks. The choices we make today will determine the world we live in tomorrow.</p>
      `,
      category: "Technology",
      date: "March 15, 2024",
      readTime: "5 min read",
      author: "Your Name",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop"
    },
    2: {
      id: 2,
      title: "Building Sustainable Cities",
      excerpt: "How urban planning and technology can create more livable, environmentally friendly cities.",
      content: `
        <p>As the world's population continues to urbanize, the challenge of creating sustainable cities has never been more important. Cities consume 75% of the world's energy and produce 80% of greenhouse gas emissions, making them crucial battlegrounds in the fight against climate change.</p>
        
        <h2>The Challenge</h2>
        <p>Urban areas face multiple interconnected challenges:</p>
        <ul>
          <li>Rising temperatures and extreme weather events</li>
          <li>Air pollution and public health concerns</li>
          <li>Resource scarcity and waste management</li>
          <li>Social inequality and access to services</li>
        </ul>
        
        <h2>Innovative Solutions</h2>
        <p>Fortunately, cities around the world are implementing innovative solutions:</p>
        
        <h3>Green Infrastructure</h3>
        <p>From green roofs to urban forests, cities are integrating nature into their built environment. These solutions provide multiple benefits: reducing heat island effects, improving air quality, and creating recreational spaces.</p>
        
        <h3>Smart Technology</h3>
        <p>IoT sensors, data analytics, and AI are helping cities optimize everything from traffic flow to energy consumption. Smart grids, intelligent transportation systems, and predictive maintenance are becoming standard features of modern cities.</p>
        
        <h3>Circular Economy</h3>
        <p>Cities are moving toward circular economy models where waste becomes a resource. From composting programs to material recovery facilities, urban areas are finding ways to close resource loops.</p>
        
        <h2>Looking Forward</h2>
        <p>The transformation of cities is not just about technology—it's about people. Successful sustainable cities prioritize human well-being, social equity, and community engagement. The cities of the future will be places where people want to live, work, and play.</p>
      `,
      category: "Innovation",
      date: "March 10, 2024",
      readTime: "7 min read",
      author: "Your Name",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=600&fit=crop"
    }
  };

  const post = blogPosts[id];

  if (!post) {
    return (
      <div className="blog-post">
        <div className="container">
          <div className="post-not-found">
            <h1>Post Not Found</h1>
            <p>The blog post you're looking for doesn't exist.</p>
            <Link to="/" className="back-link">← Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post">
      <div className="container">
        <article className="post-content">
          <header className="post-header">
            <div className="post-meta">
              <span className="post-category">{post.category}</span>
              <span className="post-date">{post.date}</span>
              <span className="post-read-time">{post.readTime}</span>
            </div>
            <h1 className="post-title">{post.title}</h1>
            <p className="post-excerpt">{post.excerpt}</p>
            <div className="post-author">
              <span>By {post.author}</span>
            </div>
          </header>

          <div className="post-image">
            <img src={post.image} alt={post.title} />
          </div>

          <div 
            className="post-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className="post-footer">
            <div className="share-buttons">
              <h3>Share this post</h3>
              <div className="share-links">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Check out this article: ${window.location.href}`)}`}>
                  Email
                </a>
              </div>
            </div>
          </footer>
        </article>

        <aside className="post-sidebar">
          <div className="sidebar-section">
            <h3>Related Posts</h3>
            <div className="related-posts">
              {Object.values(blogPosts)
                .filter(p => p.id !== post.id)
                .slice(0, 3)
                .map(relatedPost => (
                  <div key={relatedPost.id} className="related-post">
                    <Link to={`/post/${relatedPost.id}`}>
                      <h4>{relatedPost.title}</h4>
                      <span className="related-post-date">{relatedPost.date}</span>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPost; 