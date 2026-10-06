import './style.css';
import { getProfileData } from '../../services/profile';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '../avatar';

export const ProfileHeader = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileData,
  });

  if (isLoading)
    return (
      <section id="profile-header">
        <div className="profile-header">
          <div className="profile-avatar">
            <img className="loading" src="" />
          </div>
          <div className="profile-info content-card">
            <h1 className="profile-info-name skeleton-block skeleton-block--half loading">
              <img src="" className="profile-underline" />
            </h1>
            <p className="page-paragraph page-paragraph--smoke skeleton-block skeleton-block--quarter loading"></p>
          </div>
        </div>
      </section>
    );

  const fullName = `${data?.firstName} ${data?.lastName}`;

  return (
    <section id="profile-header">
      <div className="profile-header">
        <div className="profile-avatar">
           <Avatar name={fullName} src={data?.image} />
        </div>
        <div className="profile-info content-card">
          <h1 className="profile-info-name">
            {fullName}
            <img src="/underline.svg" className="profile-underline" alt="" />
          </h1>
          <p className="page-paragraph page-paragraph--smoke">
            {data?.jobTitle} @ {data?.companyName}
          </p>
        </div>
      </div>
    </section>
  );
};