import { useEffect, useRef } from 'react';
import { ProfileFriends } from '../profile-friends';
import './style.css';

export const FriendsPage = () => {
  const headingRef = useRef(null);

  // New page: start at the top, tell the tab and screen readers where we are
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Friends | Profile';
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="friends-page">
      <a className="friends-page-back" href="#home">
        <span aria-hidden="true">←</span> Back to profile
      </a>
      <h1 ref={headingRef} tabIndex={-1} className="friends-page-title">
        Friends
      </h1>
      <ProfileFriends variant="page" />
    </div>
  );
};