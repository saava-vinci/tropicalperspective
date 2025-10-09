import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPaginatedPosts } from '../utils/markdownUtils';
import './Blog.css';

// Pagination Component
const Pagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage } = pagination;

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <nav className="pagination" aria-label="Blog pagination">
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
      
      <div className="pagination-controls">
        {hasPrevPage && (
          <button 
            onClick={() => onPageChange(prevPage)}
            className="pagination-btn prev"
            aria-label="Previous page"
          >
            ← Previous
          </button>
        )}
        
        <div className="pagination-numbers">
          {getPageNumbers().map(pageNum => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`pagination-btn number ${pageNum === currentPage ? 'active' : ''}`}
              aria-label={`Go to page ${pageNum}`}
            >
              {pageNum}
            </button>
          ))}
        </div>
        
        {hasNextPage && (
          <button 
            onClick={() => onPageChange(nextPage)}
            className="pagination-btn next"
            aria-label="Next page"
          >
            Next →
          </button>
        )}
      </div>
    </nav>
  );
};

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const postsPerPage = 10;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await getPaginatedPosts(currentPage, postsPerPage);
        setPosts(result.posts);
        setPagination(result.pagination);
      } catch (err) {
        console.error('Error loading posts:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="blog-page">
        <div className="container">
          <div className="loading">
            <h1>Loading...</h1>
            <p>Please wait while we load the blog posts.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-page">
        <div className="container">
          <div className="error">
            <h1>Error</h1>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="container">
        <header className="blog-header">
          <h1>All Posts</h1>
          <p>Explore all our articles on biotechnology, AI, innovation, and the future of work</p>
          {pagination && (
            <div className="blog-stats">
              Showing {posts.length} of {pagination.totalPosts} posts
            </div>
          )}
        </header>

        <div className="blog-content">
          {posts.length === 0 ? (
            <div className="no-posts">
              <h2>No posts found</h2>
              <p>There are no blog posts to display.</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map(post => (
                <article key={post.slug} className="post-card">
                  {post.image && (
                    <div className="post-image">
                      <Link to={`/post/${post.slug}`}>
                        <img src={post.image} alt={post.title} />
                      </Link>
                    </div>
                  )}
                  <div className="post-content">
                    <div className="post-meta">
                      <span className="post-category">{post.category}</span>
                      <span className="post-date">{post.date}</span>
                      <span className="post-read-time">{post.readTime}</span>
                    </div>
                    <h2 className="post-title">
                      <Link to={`/post/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <div className="post-author">
                      By {post.author}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {pagination && (
            <Pagination 
              pagination={pagination} 
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
