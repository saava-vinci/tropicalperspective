/**
 * Blog posts data
 * This file contains all blog post metadata and content
 */

export const posts = [
  {
    slug: "foundation-tropicalperspective",
    title: "Welcome to Tropical Perspective",
    excerpt: "The purpose behind Tropical Perspective and why now",
    category: "Intro",
    date: "March 03, 2025",
    readTime: "5 min read",
    author: "Eric Kyambadde Kisaakye",
    image: "https://www.montmarte.com/cdn/shop/articles/7._d.issa.c_sketch_of_rectangular_prisms_with_many_guiding_lines_of_perspective.jpg?v=1693535361",
    content: `# What should you expect from Tropical Perspective?

I’ve launched Tropical Perspective, and I couldn’t be more excited!
It’s more than a blog — it’s a movement.

The mission is simple yet profound: to ferment and distill a pure African philosophy and approach to 
science, innovation, entrepreneurship, education, and AI. Through this lens, Tropical Perspective seeks 
to inspire a generational mindset shift — one that redefines how Africa formulates solutions to its most 
deep-seated challenges.

Our focus spans critical areas shaping the continent’s future: health, food security, education, 
unemployment, sustainable bioeconomies, AI, and the future of work.

Welcome to a space where African insight meets global innovation — and where ideas grow into tools for 
transformation.

Welcome to Tropical Perspective. Let’s shape the future together, one post at a time.`
  },
  /*
  {
    slug: "sustainable-cities",
    title: "Building Sustainable Cities",
    excerpt: "How urban planning and technology can create more livable, environmentally friendly cities.",
    category: "Innovation",
    date: "March 10, 2024",
    readTime: "7 min read",
    author: "Your Name",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=600&fit=crop",
    content: `# Building Sustainable Cities

As the world's population continues to urbanize, the challenge of creating sustainable cities has never been more important. Cities consume 75% of the world's energy and produce 80% of greenhouse gas emissions, making them crucial battlegrounds in the fight against climate change.

## The Challenge

Urban areas face multiple interconnected challenges:

- Rising temperatures and extreme weather events
- Air pollution and public health concerns
- Resource scarcity and waste management
- Social inequality and access to services

## Innovative Solutions

Fortunately, cities around the world are implementing innovative solutions:

### Green Infrastructure

From green roofs to urban forests, cities are integrating nature into their built environment. These solutions provide multiple benefits: reducing heat island effects, improving air quality, and creating recreational spaces.

### Smart Technology

IoT sensors, data analytics, and AI are helping cities optimize everything from traffic flow to energy consumption. Smart grids, intelligent transportation systems, and predictive maintenance are becoming standard features of modern cities.

### Circular Economy

Cities are moving toward circular economy models where waste becomes a resource. From composting programs to material recovery facilities, urban areas are finding ways to close resource loops.

## Looking Forward


## Why stay tuned?
![Alt text](https://upload.wikimedia.org/wikipedia/commons/5/50/SpinachRuBisCO.png)
*Figure 1: RuBisCO enzyme from spinach, a key player in photosynthesis.*

The transformation of cities is not just about technology—it's about people. Successful sustainable cities prioritize human well-being, social equity, and community engagement. The cities of the future will be places where people want to live, work, and play.`
  },
  */
];

/**
 * Get all blog posts metadata
 * @returns {Array} - Array of post metadata objects
 */
export function getAllPostsMetadata() {
  return posts
    .map(post => {
      const { content, ...metadata } = post;
      return metadata;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get paginated blog posts metadata
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Number of posts per page
 * @returns {Object} - Object containing posts, pagination info
 */
export function getPaginatedPosts(page = 1, limit = 10) {
  const allPosts = getAllPostsMetadata();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedPosts = allPosts.slice(startIndex, endIndex);
  
  return {
    posts: paginatedPosts,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalPosts: totalPosts,
      postsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    }
  };
}

/**
 * Get total number of posts
 * @returns {number} - Total number of posts
 */
export function getTotalPostsCount() {
  return posts.length;
}

/**
 * Get a specific post by slug
 * @param {string} slug - The post slug
 * @returns {Object|null} - Post metadata and content or null if not found
 */
export function getPostBySlug(slug) {
  const post = posts.find(p => p.slug === slug);
  return post || null;
}
