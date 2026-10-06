import { useState } from 'react';
import './style.css';

// Dark enough that white initials pass contrast (about 5:1 or better)
const PALETTE = [
  '#2F6F8F',
  '#2E7D6B',
  '#8E3B7A',
  '#B4532A',
  '#5B4B9A',
  '#3F6B3A',
  '#A33B4B',
  '#35607A',
];

// "Stuart Raymond" -> "SR", "Cher" -> "C", "" -> "?"
export const getInitials = name => {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';

  const first = Array.from(parts[0])[0];
  if (parts.length === 1) return first.toUpperCase();

  const last = Array.from(parts[parts.length - 1])[0];
  return (first + last).toUpperCase();
};

// Same name always gets the same color
const getColor = name => {
  let hash = 0;
  for (const char of name ?? '') {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
};

export const Avatar = ({ name = '', src, className = '' }) => {
  // Remember which src failed so a broken URL also falls back to initials
  const [failedSrc, setFailedSrc] = useState(null);
  const showImage = Boolean(src) && failedSrc !== src;

  if (showImage) {
    return (
      <img
        className={`avatar avatar-img ${className}`}
        src={src}
        alt=""
        onError={() => setFailedSrc(src)}
      />
    );
  }

  return (
    <span
      className={`avatar avatar-initials ${className}`}
      style={{ backgroundColor: getColor(name) }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
};