import React from 'react';
import { Layout } from './components/layout';
import { Navigation } from './components/navigation';
import { ProfileHeader } from './components/profile-header';
import { ProfilePosts } from './components/profile-posts';
import { ProfileGroups } from './components/profile-groups';
import { ProfileFriends } from './components/profile-friends';
import { Footer } from './components/footer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import './main.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Navigation />
        <div className="content-grid container">
          <div className="content-grid-block--main">
            <ProfileHeader />
            <ProfilePosts />
            <ProfileGroups />
          </div>
          <div className="content-grid-block--friends">
            <ProfileFriends />
          </div>
        </div>
        <Footer />
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
