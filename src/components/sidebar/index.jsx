import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import './style.css';
import { getProfileData } from '../../services/profile';
import { Avatar } from '../avatar';
import { ThemeToggle } from '../theme/ThemeToggle';
import { useRoute } from '../router/useRoute';
import {
  ClearIcon,
  GroupsIcon,
  HomeIcon,
  MenuIcon,
  MessageIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from '../icons';

const COLLAPSE_KEY = 'sidebar';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '#home', Icon: HomeIcon },
  { id: 'profile', label: 'My Profile', href: '#profile-header', Icon: UserIcon },
  { id: 'friends', label: 'Friends', href: '#/friends', Icon: UsersIcon },
  { id: 'groups', label: 'Groups', href: '#profile-groups', Icon: GroupsIcon },
  { id: 'messages', label: 'Messages', Icon: MessageIcon, soon: true },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon, soon: true },
];

// Double chevron; CSS flips it when the sidebar is collapsed
const CollapseIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      className="sidebar-collapse-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 7l-5 5 5 5M18 7l-5 5 5 5"
    />
  </svg>
);

// index.html already set the attribute before first paint, so read it back
const getInitialCollapsed = () =>
  document.documentElement.getAttribute('data-sidebar') === 'collapsed';

export const Sidebar = () => {
  const [open, setOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(getInitialCollapsed); // desktop rail
  const [active, setActive] = useState('home');
  const route = useRoute();
  const current = route === 'friends' ? 'friends' : active;
  const menuRef = useRef(null);
  const closeRef = useRef(null);
  const wasOpen = useRef(false);

  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileData,
  });
  const fullName = data ? `${data.firstName} ${data.lastName}` : '';

  // The page's main column reads this attribute to shift over
  useEffect(() => {
    if (collapsed) {
      document.documentElement.setAttribute('data-sidebar', 'collapsed');
    } else {
      document.documentElement.removeAttribute('data-sidebar');
    }
  }, [collapsed]);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      window.localStorage.setItem(COLLAPSE_KEY, next ? 'collapsed' : 'expanded');
    } catch {
      // storage unavailable: the choice just won't persist
    }
  };

  // Escape closes the drawer
  useEffect(() => {
    if (!open) return;
    const onKeyDown = event => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Move focus into the drawer when it opens, back to the button when it closes
  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
    } else if (wasOpen.current) {
      menuRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <header className="topbar">
        <button
          ref={menuRef}
          type="button"
          className="topbar-menu"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="sidebar"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </button>
        <span className="topbar-title">{fullName || 'Profile'}</span>
      </header>

      {open && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        id="sidebar"
        className={`sidebar${open ? ' is-open' : ''}${collapsed ? ' is-collapsed' : ''}`}
      >
        <button
          ref={closeRef}
          type="button"
          className="sidebar-close"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <ClearIcon size={18} />
        </button>

        <div className="sidebar-profile">
          <div className="sidebar-avatar">
            <Avatar name={fullName || '?'} src={data?.image} />
          </div>
          <p className="sidebar-name">{fullName}</p>
          <p className="sidebar-role">
            {data ? `${data.jobTitle} @ ${data.companyName}` : ''}
          </p>
        </div>

        <nav className="sidebar-nav" aria-label="Main">
          <ul>
            {NAV_ITEMS.map(({ id, label, href, Icon, soon }) => (
              <li key={id}>
                {soon ? (
                  <span
                    className="sidebar-link is-soon"
                    title={collapsed ? `${label} (coming soon)` : undefined}
                  >
                    <Icon />
                    <span className="sidebar-label">{label}</span>
                    <span className="visually-hidden"> (coming soon)</span>
                    <span className="sidebar-soon" aria-hidden="true">
                      Soon
                    </span>
                  </span>
                ) : (
                  <a
                    className="sidebar-link"
                    href={href}
                    title={collapsed ? label : undefined}
                    aria-current={current === id ? 'page' : undefined}
                    onClick={() => {
                      if (id !== 'friends') setActive(id);
                      setOpen(false);
                    }}
                  >
                    <Icon />
                    <span className="sidebar-label">{label}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-collapse"
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : undefined}
            onClick={toggleCollapsed}
          >
            <CollapseIcon />
            <span className="sidebar-label">Collapse</span>
          </button>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
};