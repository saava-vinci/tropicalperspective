import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./BlogPost.css";
import { getPostBySlug, getAllPostsMetadata } from "../utils/markdownUtils";

// Related Posts Component
const RelatedPosts = ({ currentSlug }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const loadRelatedPosts = async () => {
      try {
        const allPosts = await getAllPostsMetadata();
        const related = allPosts
          .filter(p => p.slug !== currentSlug)
          .slice(0, 3);
        setRelatedPosts(related);
      } catch (error) {
        console.error('Error loading related posts:', error);
      }
    };

    loadRelatedPosts();
  }, [currentSlug]);

  return (
    <aside className="post-sidebar">
      <div className="sidebar-section">
        <h3>Related Posts</h3>
        <div className="related-posts">
          {relatedPosts.map(relatedPost => (
            <div key={relatedPost.slug} className="related-post">
              <Link to={`/post/${relatedPost.slug}`}>
                <h4>{relatedPost.title}</h4>
                <span className="related-post-date">{relatedPost.date}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const postData = await getPostBySlug(slug);
        if (postData) {
          setPost(postData);
          setContent(postData.content);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadPost();
    }
  }, [slug]);

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

  if (loading) {
    return (
      <div className="blog-post">
        <div className="container">
          <div className="loading">
            <h1>Loading...</h1>
            <p>Please wait while we load the post content.</p>
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

          <div className="post-body">
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

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

        <RelatedPosts currentSlug={post.slug} />
      </div>
    </div>
  );
};

export default BlogPost;