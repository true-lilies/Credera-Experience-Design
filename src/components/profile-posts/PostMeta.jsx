const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const relativeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
});

const RELATIVE_UNITS = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
];

const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

const getRelativeTime = date => {
  const diffSeconds = (date.getTime() - Date.now()) / 1000;

  for (const [unit, seconds] of RELATIVE_UNITS) {
    if (Math.abs(diffSeconds) >= seconds) {
      return relativeFormatter.format(Math.round(diffSeconds / seconds), unit);
    }
  }
  return 'just now';
};

// Joins city and state, and never leaves a dangling comma
const formatLocation = (city, state) => [city, state].filter(Boolean).join(', ');

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
    <path
      fill="currentColor"
      d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm-2 8h14v10H5V10z"
    />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
    />
  </svg>
);

export const PostMeta = ({ publishDate, city, state }) => {
  const date = publishDate ? new Date(publishDate) : null;
  const hasValidDate = date && !Number.isNaN(date.getTime());
  const location = formatLocation(city, state);

  if (!hasValidDate && !location) return null;

  const isStale = hasValidDate && Date.now() - date.getTime() > ONE_YEAR_MS;

  return (
    <ul className={`post-meta${isStale ? ' is-stale' : ''}`}>
      {hasValidDate && (
        <li className="post-meta-item">
          <CalendarIcon />
          <time dateTime={publishDate}>
            {dateFormatter.format(date)}
            <span className="post-meta-relative">
              {' '}
              · {getRelativeTime(date)}
            </span>
          </time>
        </li>
      )}

      {location && (
        <li className="post-meta-item">
          <PinIcon />
          <span>{location}</span>
        </li>
      )}
    </ul>
  );
};