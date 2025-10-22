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
  
  {
    slug: "nobel-prizes-africa",
    title: "Nobel Season Reveals Africa's Curiosity Deficit!",
    excerpt: "Has Africa’s obsession with academic certificates silenced its curiosity?",
    category: "Education",
    date: "October 21, 2025",
    readTime: "5 min read",
    author: "Eric Kyambadde Kisaakye",
    image: "https://www.reuters.com/resizer/v2/P2QUP7QWNZMQNAMSON4OBLAIZQ.jpg?auth=0f37d8a74b5bb3d7848d88de39803bf3de9ec8a16d483d2fe59a583c713b80f2&width=4032&quality=80",
    content: `# Africa traded curiosity for certificates

Every October, the world pauses to celebrate the recipients of one of the world’s most coveted honor – the Nobel Prize. The Nobel season is when humanity honors those individuals who dared to ask questions not many thoughts to ask, and who stayed long enough with the unknown until it revealed something new.

But for Africa, October often feels like a quiet and uncomfortable reminder; a wakeup report card. Once again, the names were announced and Africa’s presence was faint. Apart from a few remarkable laureates in Peace (14) and Literature (7) awarded in the past; including Nelson Mandela, Wangari Maathai, Wole Soyinka, Nadine Gordimer – the continent remains largely silent in the hard-core sciences: Physics, Chemistry, Physiology and Medicine, and Economics. In these fields the continent has only managed to produce Max Theiler (Physiology or Medicine, 1951), Allan M. Cormack (Physiology or Medicine, 1979), Aaron Klug (Chemistry, 1982), Claude Cohen-Tannoudji (Physics, 1997), Ahmed Zewali (Chemistry, 1999), Serge Haroche (2012), Michael Levitt (Chemistry, 2013). However, none of these was affiliated to an African research institution at the time of winning their award.

For many shortcomings we have pointed to history or systemic bias, but the truth is more painful. Africa has not been excluded, but rather it opted out. This is because the continent has in many ways shunned the basic sciences. We have turned our backs on the science of discovery. Our schools and universities are wired to produce professionals, not thinkers. We chase degrees like badges of honor, but rarely pursue the curiosity that births new knowledge. We memorize theories but seldom question their roots. In the process, we have built a system that worships certificates, but crucifies curiosity.

This is not merely an academic issue; it is a philosophical failure. True scientific advancement begins with a culture that values discovery over imitation, understanding over application, and ground-level truth over borrowed theories. Africa’s struggle is not a lack of potential but a failure to cultivate a generation of thinkers who pursue knowledge for its own sake. 

The result is visible in our innovation landscape. We import technologies instead of inventing them. We apply other people’s models instead of designing our own. And when October comes, we are left watching as others receive medals for questions we never thought to ask.

![Alt text](https://vividmaps.com/wp-content/uploads/2015/10/nobel-laureates.jpg)
*Figure 1: Number of Nobel Laureates in scientific disciplines per 10 million people (Source: vividmaps.com).*

This is not about prizes. The Nobel is merely a mirror, reflecting where humanity’s deepest investments in knowledge are happening. It shows which societies value the pursuit of truth for its own sake, and which ones are content with using discoveries made elsewhere.

Africa’s crisis is not a lack of talent; it is a cultural neglect of basic science, the kind that does not promise immediate profit but shapes how we understand life, nature, and possibility.
If the continent is to rise, it must rekindle its childlike wonder — the courage to ask why. It must cultivate laboratories of imagination as passionately as it builds skyscrapers. Because a society that loses curiosity also loses its creativity.

So yes, October is a wake-up call — not to compete for medals, but to rethink Africa’s approach towards research and how best we can essentially be key players to the global knowledge pool. Obviously, there are so many other really critical barriers but I believe that the day Africa begins to value curiosity as much as it values academic certificates, we shall have fulfilled the minimum requirements for discovery.

*Banner image credit: Reuters*
`
  },

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
