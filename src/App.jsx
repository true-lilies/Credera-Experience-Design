import React, { useEffect } from 'react';
import { Layout } from './components/layout';
import { Navigation } from './components/navigation';
import { Sidebar } from './components/sidebar';
import { ProfileHeader } from './components/profile-header';
import { PostComposer } from './components/post-composer';
import { ProfilePosts } from './components/profile-posts';
import { ProfileGroups } from './components/profile-groups';
import { ProfileFriends } from './components/profile-friends';
import { FriendsPage } from './components/friends-page';
import { Footer } from './components/footer';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { useRoute } from './components/router/useRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import './main.css';
import './theme.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const route = useRoute();

  // Coming back from the Friends page, jump to the section that was clicked
  useEffect(() => {
    if (route !== 'home') return;
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, [route]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Layout>
          <div className="app-shell">
            <Sidebar />
            <main id="home" className="app-main">
              {route === 'friends' ? (
                <FriendsPage />
              ) : (
                <>
                  <Navigation />
                  <div className="app-grid">
                    <div className="app-feed">
                      <ProfileHeader />
                      <PostComposer />
                      <ProfilePosts />
                      <ProfileGroups />
                    </div>
                    <div className="app-friends">
                      <ProfileFriends />
                    </div>
                  </div>
                </>
              )}
              <Footer />
            </main>
          </div>
        </Layout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;