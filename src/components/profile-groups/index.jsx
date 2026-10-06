import { useRef, useState } from 'react';
import './style.css';
import { getProfileData } from '../../services/profile';
import { useQuery } from '@tanstack/react-query';



// Object order = display order (most active to least)
const ACTIVITY_LEVELS = {
  active: {
    color: '#52C1AD',
    textColor: '#1a1a1a',
    label: 'Active',
    description: 'Posting and engaging regularly',
    defaultOpen: true,
  },
  moderate: {
    color: '#58B1C9',
    textColor: '#1a1a1a',
    label: 'Moderate',
    description: 'Some recent activity',
    defaultOpen: true,
  },
  low: {
    color: '#C152A2',
    textColor: '#ffffff',
    label: 'Low',
    description: 'Rarely active lately',
    defaultOpen: false,
  },
  inactive: {
    color: '#C4C4C4',
    textColor: '#1a1a1a',
    label: 'Inactive',
    description: 'No recent activity',
    defaultOpen: false,
  },
};

const StarIcon = ({ filled = true }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 9l6 6 6-6"
    />
  </svg>
);

// Unknown or missing values fall back to "inactive"
const getLevelKey = group =>
  ACTIVITY_LEVELS[group.activity] ? group.activity : 'inactive';



const initialOpenState = {
  favorites: true,
  ...Object.fromEntries(
    Object.entries(ACTIVITY_LEVELS).map(([key, level]) => [
      key,
      level.defaultOpen,
    ]),
  ),
};

const GroupCard = ({
  group,
  index,
  isFavorite,
  onToggleFavorite,
  showActivity = false,
}) => {
  const level = ACTIVITY_LEVELS[getLevelKey(group)];

  return (
    <li
      className="profile-group-results-item group-enter"
      style={{ '--i': index }}
    >
      {/* The button is a sibling of the link, since a button can't live inside an <a> */}
      <div className="group-card-wrap">
        <a
          className="profile-group-results-card content-card group-card"
          href={group.href}
          title={`${level.label}: ${level.description}`}
        >
          <div className="profile-group-avatar">
            <img src={group.image} alt="" />
          </div>

          <div
            className="profile-group-content"
            style={{ backgroundColor: level.color, color: level.textColor }}
          >
            <p className="page-paragraph group-name">{group.name}</p>

            {/* The Favorites section mixes activity levels, so state it */}
            {showActivity && (
              <span className="profile-group-status">{level.label}</span>
            )}
          </div>
        </a>

        <button
          type="button"
          className="group-favorite-btn"
          aria-pressed={isFavorite}
          aria-label={`Favorite ${group.name}`}
          onClick={() => onToggleFavorite(group.id)}
        >
          <StarIcon filled={isFavorite} />
        </button>
      </div>
    </li>
  );
};

const GroupSection = ({
  id,
  indicator,
  title,
  count,
  description,
  isOpen,
  onToggle,
  children,
}) => {
  const bodyId = `group-section-${id}`;

  return (
    <div className="group-section">
      <h3 className="group-section-heading">
        <button
          type="button"
          className="group-section-toggle"
          aria-expanded={isOpen}
          aria-controls={bodyId}
          onClick={onToggle}
        >
          {indicator}
          <span className="group-section-title">{title}</span>
          <span className="group-section-count">{count}</span>
          <span className="group-section-desc">{description}</span>
          <span className={`group-section-chevron${isOpen ? ' is-open' : ''}`}>
            <ChevronIcon />
          </span>
        </button>
      </h3>

      <div
        id={bodyId}
        className={`group-section-body${isOpen ? ' is-open' : ''}`}
      >
        <div className="group-section-inner">
          <ul className="profile-group-results">{children}</ul>
        </div>
      </div>
    </div>
  );
};

export const ProfileGroups = () => {
  // Hooks must run before the early return below
  const [openSections, setOpenSections] = useState(initialOpenState);
  // null = the user hasn't changed anything yet, so use the API's favorites
  const [userFavorites, setUserFavorites] = useState(null);
  const initialFavoritesRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileData,
  });

  if (isLoading) {
    return (
      <section id="profile-groups">
        {/* ...your existing skeleton code, unchanged... */}
      </section>
    );
  }

  const { groups } = data;

// Start from the API's favorite flag once, then keep them stable
  if (!initialFavoritesRef.current) {
    initialFavoritesRef.current = groups
    .filter(group => group.favorite)
    .map(group => group.id);
  }

  // Array of ids in the order the user picked them
  const favoriteIds = userFavorites ?? initialFavoritesRef.current;

  const toggleFavorite = id =>
    setUserFavorites(current => {
      const base = current ?? initialFavoritesRef.current;
      return base.includes(id) ? base.filter(x => x !== id) : [...base, id];
    });

  const toggleSection = key =>
    setOpenSections(current => ({ ...current, [key]: !current[key] }));

  // Favorites keep selection order (no sorting)
  const favorites = favoriteIds
    .map(id => groups.find(group => group.id === id))
    .filter(Boolean);

  // Activity sections still contain every group of that level
  const activitySections = Object.entries(ACTIVITY_LEVELS)
    .map(([key, level]) => ({
      key,
      level,
      groups: groups
        .filter(group => getLevelKey(group) === key)
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter(section => section.groups.length > 0);

  return (
    <section id="profile-groups">
      <h2 className="page-heading-2">Groups</h2>

      <GroupSection
        id="favorites"
        indicator={
          <span className="group-section-star">
            <StarIcon />
          </span>
        }
        title="Favorites"
        count={favorites.length}
        description="Groups you've starred"
        isOpen={openSections.favorites}
        onToggle={() => toggleSection('favorites')}
      >
        {favorites.length === 0 ? (
          <li className="group-empty">
            No favorites yet. Tap the star on any group to add it here.
          </li>
        ) : (
          favorites.map((group, index) => (
            <GroupCard
              key={group.id}
              group={group}
              index={index}
              isFavorite
              showActivity
              onToggleFavorite={toggleFavorite}
            />
          ))
        )}
      </GroupSection>

      {activitySections.map(({ key, level, groups: sectionGroups }) => (
        <GroupSection
          key={key}
          id={key}
          indicator={
            <span
              className="group-section-dot"
              style={{ backgroundColor: level.color }}
            />
          }
          title={level.label}
          count={sectionGroups.length}
          description={level.description}
          isOpen={openSections[key]}
          onToggle={() => toggleSection(key)}
        >
          {sectionGroups.map((group, index) => (
            <GroupCard
              key={group.id}
              group={group}
              index={index}
              isFavorite={favoriteIds.includes(group.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </GroupSection>
      ))}
    </section>
  );
};