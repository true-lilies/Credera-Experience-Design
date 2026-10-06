import './style.css';
import { getProfileData } from '../../services/profile';
import { useQuery } from '@tanstack/react-query';

export const ProfileGroups = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileData,
  });

  if (isLoading)
    return (
      <section id="profile-groups">
        <h2 className="page-heading-2">Groups</h2>
        <ul className="profile-group-results fade-in">
          <li className="profile-group-results-item">
            <div className="profile-group-results-card content-card skeleton-card">
              <div className="skeleton-img loading"></div>
              <div className="skeleton-block loading"></div>
            </div>
          </li>
          <li className="profile-group-results-item">
            <div className="profile-group-results-card content-card skeleton-card">
              <div className="skeleton-img loading"></div>
              <div className="skeleton-block loading"></div>
            </div>
          </li>
          <li className="profile-group-results-item">
            <div className="profile-group-results-card content-card skeleton-card">
              <div className="skeleton-img loading"></div>
              <div className="skeleton-block loading"></div>
            </div>
          </li>
          <li className="profile-group-results-item">
            <div className="profile-group-results-card content-card skeleton-card">
              <div className="skeleton-img loading"></div>
              <div className="skeleton-block loading"></div>
            </div>
          </li>
        </ul>
      </section>
    );

  const { groups } = data;

  return (
    <section id="profile-groups">
      <h2 className="page-heading-2">Groups</h2>
      <ul className="profile-group-results fade-in">
        {groups.map(group => (
          <li className="profile-group-results-item" key={group.id}>
            <a
              className="profile-group-results-card content-card fade-in"
              href={group.href}
            >
              <div className="profile-group-avatar">
                <img src={group.image} />
              </div>
              <div className="profile-group-content">
                <p className="page-paragraph">{group.name}</p>
              </div>
            </a>
            {/* <pre>{JSON.stringify(group, null, 2)}</pre> */}
          </li>
        ))}
      </ul>
    </section>
  );
};
