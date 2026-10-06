import './style.css';
import { getProfileData } from '../../services/profile';
import { useQuery } from '@tanstack/react-query';
import { PostsCarousel } from './PostCarousel';

export const ProfilePosts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileData,
  });

  if (isLoading) {
    return (
      <section id="profile-posts">
        <h2 className="page-heading-2">Pinned Posts</h2>
        <div className="profile-post-results">
          <div className="content-card fade-in">
            <div className="post-author">
              <div className="post-author-avatar loading"></div>
              <div className="post-author-info">
                <div className="skeleton-block skeleton-block--half loading"></div>
                <div className="skeleton-block skeleton-block--quarter loading"></div>
              </div>
            </div>
            <div className="post-content skeleton-block loading"></div>
          </div>
        </div>
      </section>
    );
  }

  // Use the array if present, else fall back to the single post.
  // Sort a copy newest to oldest so cached data isn't mutated.
  const posts = [
    ...(data.pinnedPosts ?? (data.pinnedPost ? [data.pinnedPost] : [])),
  ].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

  return (
    <section id="profile-posts">
      <h2 className="page-heading-2">Pinned Posts</h2>
      <div className="profile-post-results">
        {posts.length === 0 ? (
          <p className="page-micro">No pinned posts yet.</p>
        ) : (
          <PostsCarousel posts={posts} />
        )}
      </div>
    </section>
  );
};