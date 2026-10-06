import { useEffect, useState } from 'react';

// Tiny hash router: "#/friends" shows the friends page, anything else
// (including section anchors like "#profile-groups") shows the home page.
export const FRIENDS_HASH = '#/friends';

const readRoute = () =>
  window.location.hash === FRIENDS_HASH ? 'friends' : 'home';

export const useRoute = () => {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
};