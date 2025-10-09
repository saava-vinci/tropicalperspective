/**
 * Utility functions for blog posts
 */

import { 
  getAllPostsMetadata as getPostsData, 
  getPostBySlug as getPostData,
  getPaginatedPosts as getPaginatedPostsData,
  getTotalPostsCount as getTotalPostsCountData
} from '../data/posts';

/**
 * Get all blog posts metadata
 * @returns {Promise<Array>} - Array of post metadata objects
 */
export async function getAllPostsMetadata() {
  try {
    return getPostsData();
  } catch (error) {
    console.error('Error loading posts metadata:', error);
    return [];
  }
}

/**
 * Get paginated blog posts metadata
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Number of posts per page
 * @returns {Promise<Object>} - Object containing posts and pagination info
 */
export async function getPaginatedPosts(page = 1, limit = 10) {
  try {
    return getPaginatedPostsData(page, limit);
  } catch (error) {
    console.error('Error loading paginated posts:', error);
    return {
      posts: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0,
        postsPerPage: limit,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null
      }
    };
  }
}

/**
 * Get total number of posts
 * @returns {Promise<number>} - Total number of posts
 */
export async function getTotalPostsCount() {
  try {
    return getTotalPostsCountData();
  } catch (error) {
    console.error('Error getting total posts count:', error);
    return 0;
  }
}

/**
 * Get a specific post by slug
 * @param {string} slug - The post slug
 * @returns {Promise<Object|null>} - Post metadata and content or null if not found
 */
export async function getPostBySlug(slug) {
  try {
    return getPostData(slug);
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}
