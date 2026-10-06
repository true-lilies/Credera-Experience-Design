import './style.css';
import { getProfileData } from '../../services/profile';
import { useQuery } from '@tanstack/react-query';

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

  const { pinnedPost } = data;

  return (
    <section id="profile-posts">
      <h2 className="page-heading-2">Pinned Posts</h2>
      <div className="profile-post-results">
        <div className="content-card">
          <div className="post-author fade-in">
            <div className="post-author-avatar fade-in"></div>
            <div className="post-author-info fade-in">
              <p className="page-paragraph">
                {pinnedPost.authorFirstName} {pinnedPost.authorLastName}
              </p>
              <p className="page-micro">
                {pinnedPost.jobTitle} @ {pinnedPost.companyName}
              </p>
            </div>
          </div>
          <p className="page-body post-content fade-in">{pinnedPost.post}</p>
        </div>
      </div>
    </section>
  );
};
