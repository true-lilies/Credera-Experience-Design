import { useState } from 'react';
import './style.css';
import { getFriendsListData } from '../../services/profile';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '../avatar';

// Accepts true or "true", in case the API returns a string
const isTop = friend =>
  friend.topFriend === true || friend.topFriend === 'true';

const getLastName = name => name.trim().split(/\s+/).slice(-1)[0];

// Top friends first, then everyone by last name (copy so cached data isn't mutated)
const sortFriends = friends =>
  [...friends].sort((a, b) => {
    if (isTop(a) !== isTop(b)) return isTop(a) ? -1 : 1;
    return getLastName(a.name).localeCompare(getLastName(b.name));
  });

const matchesQuery = (friend, query) =>
  [friend.name, friend.jobTitle, friend.companyName]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(query);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16l-4-4"
    />
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      d="M6 6l12 12M18 6L6 18"
    />
  </svg>
);

export const ProfileFriends = ({ variant = 'card' }) => {
  // Hooks must run before the early return below
  const [query, setQuery] = useState('');
  const [compact, setCompact] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: getFriendsListData,
  });

  if (isLoading)
    return (
      <section id="profile-friends" className={variant === 'page' ? 'is-page' : undefined}>
        <div className="content-card fade-in">
          {variant !== 'page' && <h2 className="page-heading-2">Friends</h2>}
          <ul className="profile-friends-list">
            {[0, 1, 2, 3].map(item => (
              <li className="profile-list-item" key={item}>
                <div className="profile-list-item-avatar loading"></div>
                <div className="profile-list-item-info">
                  <div className="skeleton-block skeleton-block--half loading"></div>
                  <div className="skeleton-block--quarter loading"></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );

  const { friends } = data;
  const sortedFriends = sortFriends(friends);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleFriends = normalizedQuery
    ? sortedFriends.filter(friend => matchesQuery(friend, normalizedQuery))
    : sortedFriends;

  return (
    <section id="profile-friends" className={variant === 'page' ? 'is-page' : undefined}>
      <div className="content-card fade-in">
        {variant !== 'page' && <h2 className="page-heading-2">Friends</h2>}

        <div className="friends-toolbar">
          <div className="friends-search" role="search">
            <label htmlFor="friends-search-input" className="visually-hidden">
              Search friends by name, job title, or company
            </label>
            <span className="friends-search-icon">
              <SearchIcon />
            </span>
            <input
              id="friends-search-input"
              className="friends-search-input"
              type="search"
              placeholder="Search friends"
              autoComplete="off"
              value={query}
              onChange={event => setQuery(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Escape') setQuery('');
              }}
            />
            {query && (
              <button
                type="button"
                className="friends-search-clear"
                aria-label="Clear search"
                onClick={() => setQuery('')}
              >
                <ClearIcon />
              </button>
            )}
          </div>

          <button
            type="button"
            className="friends-density-toggle"
            aria-pressed={compact}
            onClick={() => setCompact(current => !current)}
          >
            Compact
          </button>
        </div>

        {/* Announced to screen readers whenever the results change */}
        <p className="friends-search-status" aria-live="polite">
          {normalizedQuery
            ? `${visibleFriends.length} of ${friends.length} friends`
            : `${friends.length} friends`}
        </p>

        {visibleFriends.length === 0 ? (
          <p className="friends-empty">
            No friends match &ldquo;{query.trim()}&rdquo;.
          </p>
        ) : (
          <ul
            className={`profile-friends-list${compact ? ' is-compact' : ''}`}
          >
            {visibleFriends.map(friend => (
              <li className="profile-list-item fade-in" key={friend.name}>
                <div
                  className={`profile-list-item-avatar ${isTop(friend) ? 'top-friend-avatar' : ''}`}
                >
                  <Avatar name={friend.name} src={friend.image} />
                  {isTop(friend) && (
                    <span
                      className="avatar-crown-badge"
                      title="Top Friend"
                      aria-hidden="true"
                    >
                      👑
                    </span>
                  )}
                </div>
                <div className="profile-list-item-info">
                  <div className="friend-name-row">
                    <p className="page-paragraph">{friend.name}</p>
                    {isTop(friend) && (
                      <span className="top-pill-badge" title="Top Friend">
                        TOP
                      </span>
                    )}
                  </div>
                  <p className="page-micro friend-job">
                    {friend.jobTitle} @ {friend.companyName}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};