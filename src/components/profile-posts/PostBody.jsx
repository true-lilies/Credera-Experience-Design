import { useEffect, useId, useRef, useState } from 'react';

export const PostBody = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const textRef = useRef(null);
  const textId = useId();

  // Only show the toggle when the text is actually cut off
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const measure = () => {
      if (expanded) return; // can't measure truncation while expanded
      setCanExpand(el.scrollHeight > el.clientHeight + 1);
    };

    measure();

    // Re-measure if the card is resized (window resize, rotation, etc.)
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, expanded]);

  return (
    <div className="post-body">
      <p
        id={textId}
        ref={textRef}
        className={`page-body post-content post-text fade-in${
          expanded ? ' is-expanded' : ''
        }`}
      >
        {text}
      </p>

      {canExpand && (
        <button
          type="button"
          className="post-toggle"
          aria-expanded={expanded}
          aria-controls={textId}
          onClick={() => setExpanded(current => !current)}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
};