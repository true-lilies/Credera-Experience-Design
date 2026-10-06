import { useRef, useState } from 'react';
import { PostCard } from './PostCard';

// Max number of times the user can move right from the first post
const MAX_SWIPES = 5;
const SWIPE_THRESHOLD = 50; // px

const getKey = post =>
  `${post.authorFirstName}-${post.authorLastName}-${post.publishDate}`;

const ArrowIcon = ({ direction }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d={direction === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
    />
  </svg>
);

export const PostsCarousel = ({ posts }) => {
  const [index, setIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const touchStartX = useRef(null);

  const maxIndex = Math.min(posts.length - 1, MAX_SWIPES);
  const slides = posts.slice(0, maxIndex + 1);
  const atStart = index === 0;
  const atEnd = index >= maxIndex;

  const goPrev = () => setIndex(current => Math.max(0, current - 1));
  const goNext = () => setIndex(current => Math.min(maxIndex, current + 1));

  const handleTouchStart = event => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = event => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (delta <= -SWIPE_THRESHOLD) goNext();
    if (delta >= SWIPE_THRESHOLD) goPrev();
  };

  const handleKeyDown = event => {
    if (event.key === 'ArrowLeft') goPrev();
    if (event.key === 'ArrowRight') goNext();
  };

  if (showAll) {
    return (
      <div className="posts-all">
        <ul className="posts-all-list">
          {posts.map(post => (
            <li key={getKey(post)}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
        <div className="posts-footer">
          <button
            type="button"
            className="posts-show-all"
            onClick={() => setShowAll(false)}
          >
            Show less
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="posts-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Pinned posts"
      onKeyDown={handleKeyDown}
    >
      <div className="posts-carousel-row">
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Previous post"
          aria-disabled={atStart}
          onClick={goPrev}
        >
          <ArrowIcon direction="left" />
        </button>

        <div
          className="posts-viewport"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="posts-track"
            style={{ transform: `translateX(-${index * 100}%)` }}
            aria-live="polite"
          >
            {slides.map((post, slideIndex) => {
              const isCurrent = slideIndex === index;

              return (
                <div
                  key={getKey(post)}
                  className="posts-slide"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${slideIndex + 1} of ${slides.length}`}
                  aria-hidden={!isCurrent}
                  // Keeps off-screen slides out of the tab order
                  inert={isCurrent ? undefined : ''}
                >
                  <PostCard post={post} />
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="carousel-arrow"
          aria-label="Next post"
          aria-disabled={atEnd}
          onClick={goNext}
        >
          <ArrowIcon direction="right" />
        </button>
      </div>

      <div className="posts-footer">
        {slides.length > 1 && (
          <span className="posts-counter">
            {index + 1} / {slides.length}
          </span>
        )}

        {posts.length > 1 && (
          <button
            type="button"
            className="posts-show-all"
            onClick={() => setShowAll(true)}
          >
            Show all ({posts.length})
          </button>
        )}
      </div>
    </div>
  );
};