import { useEffect, useId, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import './style.css';
import { getProfileData } from '../../services/profile';
import { Avatar } from '../avatar';
import { PostMeta } from '../profile-posts/PostMeta';
import {
  CalendarIcon,
  ClearIcon,
  GifIcon,
  PhotoIcon,
  SmileIcon,
} from '../icons';

const MAX_LENGTH = 500;
const MAX_FILE_MB = 8;

const FEELINGS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '🤩', label: 'Excited' },
  { emoji: '🙏', label: 'Grateful' },
  { emoji: '💪', label: 'Motivated' },
  { emoji: '😎', label: 'Relaxed' },
  { emoji: '🤔', label: 'Thoughtful' },
  { emoji: '🥳', label: 'Celebrating' },
  { emoji: '😴', label: 'Tired' },
];

const eventFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const formatEventWhen = value => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : eventFormatter.format(date);
};

export const PostComposer = () => {
  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileData,
  });
  const fullName = data ? `${data.firstName} ${data.lastName}` : '';

  const [text, setText] = useState('');
  const [media, setMedia] = useState(null); // { kind, url, name }
  const [feeling, setFeeling] = useState(null);
  const [attachedEvent, setAttachedEvent] = useState(null);
  const [eventDraft, setEventDraft] = useState({ title: '', when: '' });
  const [panel, setPanel] = useState(null); // 'feeling' | 'event' | null
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [posts, setPosts] = useState([]);

  const photoInputRef = useRef(null);
  const gifInputRef = useRef(null);
  const toolsRef = useRef(null);
  const urlsRef = useRef(new Set());
  const textId = useId();

  // Release any object URLs when the component unmounts
  useEffect(() => {
    const urls = urlsRef.current;
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, []);

  // Close the Feeling / Event popovers on outside click or Escape
  useEffect(() => {
    if (!panel) return;
    const onPointerDown = event => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setPanel(null);
      }
    };
    const onKeyDown = event => {
      if (event.key === 'Escape') setPanel(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [panel]);

  const discardUrl = url => {
    URL.revokeObjectURL(url);
    urlsRef.current.delete(url);
  };

  const handleFile = (kind, event) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // lets the same file be chosen again
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    if (!isImage || (kind === 'gif' && file.type !== 'image/gif')) {
      setError(
        kind === 'gif'
          ? 'Please choose a GIF file.'
          : 'Please choose an image file.',
      );
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Files must be under ${MAX_FILE_MB} MB.`);
      return;
    }

    if (media) discardUrl(media.url);
    const url = URL.createObjectURL(file);
    urlsRef.current.add(url);
    setMedia({ kind, url, name: file.name });
    setError('');
  };

  const removeMedia = () => {
    if (media) discardUrl(media.url);
    setMedia(null);
  };

  const chooseFeeling = item => {
    setFeeling(item);
    setPanel(null);
  };

  const saveEvent = () => {
    if (!eventDraft.title.trim() || !eventDraft.when) {
      setError('Add an event name and a date.');
      return;
    }
    setAttachedEvent({ title: eventDraft.title.trim(), when: eventDraft.when });
    setEventDraft({ title: '', when: '' });
    setPanel(null);
    setError('');
  };

  const canPost = Boolean(text.trim() || media || feeling || attachedEvent);

  const submit = event => {
    event.preventDefault();
    if (!canPost) return;

    const post = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      text: text.trim(),
      media, // the object URL now belongs to the post
      feeling,
      event: attachedEvent,
      createdAt: new Date().toISOString(),
    };

    setPosts(current => [post, ...current]);
    setText('');
    setMedia(null);
    setFeeling(null);
    setAttachedEvent(null);
    setPanel(null);
    setError('');
    setStatus('Your post was published.');
  };

  const deletePost = post => {
    if (post.media) discardUrl(post.media.url);
    setPosts(current => current.filter(item => item.id !== post.id));
    setStatus('Post deleted.');
  };

  const togglePanel = name =>
    setPanel(current => (current === name ? null : name));

  return (
    <section id="post-composer" aria-label="Create a post">
      <form className="composer content-card" onSubmit={submit}>
        <div className="composer-top">
          <div className="composer-avatar">
            <Avatar name={fullName || '?'} src={data?.image} />
          </div>
          <div className="composer-field">
            <label htmlFor={textId} className="visually-hidden">
              Write a post
            </label>
            <textarea
              id={textId}
              className="composer-textarea"
              rows={2}
              maxLength={MAX_LENGTH}
              placeholder="What's on your mind?"
              value={text}
              onChange={event => setText(event.target.value)}
            />
          </div>
        </div>

        {(feeling || attachedEvent) && (
          <ul className="composer-chips">
            {feeling && (
              <li className="composer-chip">
                <span>
                  Feeling {feeling.emoji} {feeling.label}
                </span>
                <button
                  type="button"
                  aria-label="Remove feeling"
                  onClick={() => setFeeling(null)}
                >
                  <ClearIcon size={12} />
                </button>
              </li>
            )}
            {attachedEvent && (
              <li className="composer-chip">
                <span>
                  {attachedEvent.title} · {formatEventWhen(attachedEvent.when)}
                </span>
                <button
                  type="button"
                  aria-label="Remove event"
                  onClick={() => setAttachedEvent(null)}
                >
                  <ClearIcon size={12} />
                </button>
              </li>
            )}
          </ul>
        )}

        {media && (
          <div className="composer-media">
            <img
              src={media.url}
              alt={`Preview of attached ${media.kind}: ${media.name}`}
            />
            <button
              type="button"
              className="composer-media-remove"
              aria-label={`Remove attached ${media.kind}`}
              onClick={removeMedia}
            >
              <ClearIcon size={14} />
            </button>
          </div>
        )}

        {error && (
          <p className="composer-error" role="alert">
            {error}
          </p>
        )}

        <div className="composer-bar">
          <div className="composer-tools" ref={toolsRef}>
            <input
              ref={photoInputRef}
              hidden
              type="file"
              accept="image/*"
              onChange={event => handleFile('photo', event)}
            />
            <input
              ref={gifInputRef}
              hidden
              type="file"
              accept="image/gif"
              onChange={event => handleFile('gif', event)}
            />

            <button
              type="button"
              className="composer-tool"
              onClick={() => photoInputRef.current?.click()}
            >
              <PhotoIcon />
              <span>Photo</span>
            </button>

            <button
              type="button"
              className="composer-tool"
              onClick={() => gifInputRef.current?.click()}
            >
              <GifIcon />
              <span>GIF</span>
            </button>

            <div className="composer-pop-wrap">
              <button
                type="button"
                className="composer-tool"
                aria-expanded={panel === 'feeling'}
                onClick={() => togglePanel('feeling')}
              >
                <SmileIcon />
                <span>Feeling</span>
              </button>
              {panel === 'feeling' && (
                <div
                  className="composer-pop"
                  role="group"
                  aria-label="How are you feeling?"
                >
                  <div className="composer-feelings">
                    {FEELINGS.map(item => (
                      <button
                        key={item.label}
                        type="button"
                        className="composer-feeling"
                        onClick={() => chooseFeeling(item)}
                      >
                        <span aria-hidden="true">{item.emoji}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="composer-pop-wrap">
              <button
                type="button"
                className="composer-tool"
                aria-expanded={panel === 'event'}
                onClick={() => togglePanel('event')}
              >
                <CalendarIcon />
                <span>Event</span>
              </button>
              {panel === 'event' && (
                <div
                  className="composer-pop"
                  role="group"
                  aria-label="Add an event"
                  onKeyDown={event => {
                    // Enter in these inputs saves the event, not the whole post
                    if (
                      event.key === 'Enter' &&
                      event.target.tagName === 'INPUT'
                    ) {
                      event.preventDefault();
                      saveEvent();
                    }
                  }}
                >
                  <label htmlFor={`${textId}-event-title`}>Event name</label>
                  <input
                    id={`${textId}-event-title`}
                    type="text"
                    maxLength={60}
                    value={eventDraft.title}
                    onChange={event =>
                      setEventDraft(current => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                  />
                  <label htmlFor={`${textId}-event-when`}>Date and time</label>
                  <input
                    id={`${textId}-event-when`}
                    type="datetime-local"
                    value={eventDraft.when}
                    onChange={event =>
                      setEventDraft(current => ({
                        ...current,
                        when: event.target.value,
                      }))
                    }
                  />
                  <div className="composer-pop-actions">
                    <button
                      type="button"
                      className="composer-btn-secondary"
                      onClick={() => setPanel(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="composer-btn-primary"
                      onClick={saveEvent}
                    >
                      Add event
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="composer-submit">
            {text.length > MAX_LENGTH - 80 && (
              <span className="composer-count">
                {MAX_LENGTH - text.length} left
              </span>
            )}
            <button
              type="submit"
              className="composer-post"
              disabled={!canPost}
            >
              Post
            </button>
          </div>
        </div>
      </form>

      <p className="visually-hidden" role="status">
        {status}
      </p>

      {posts.length > 0 && (
        <ul className="user-posts">
          {posts.map(post => (
            <li className="user-post content-card fade-in" key={post.id}>
              <div className="user-post-header">
                <div className="user-post-avatar">
                  <Avatar name={fullName || '?'} src={data?.image} />
                </div>
                <div className="user-post-author">
                  <p className="page-paragraph">
                    {fullName}
                    {post.feeling && (
                      <span className="user-post-feeling">
                        {' '}
                        is feeling {post.feeling.emoji} {post.feeling.label}
                      </span>
                    )}
                  </p>
                  <PostMeta publishDate={post.createdAt} />
                </div>
                <button
                  type="button"
                  className="user-post-delete"
                  aria-label="Delete post"
                  onClick={() => deletePost(post)}
                >
                  <ClearIcon />
                </button>
              </div>

              {post.text && (
                <p className="page-body user-post-text">{post.text}</p>
              )}

              {post.media && (
                <img
                  className="user-post-media"
                  src={post.media.url}
                  alt={`Attached ${post.media.kind}: ${post.media.name}`}
                />
              )}

              {post.event && (
                <div className="user-post-event">
                  <CalendarIcon />
                  <div className="user-post-event-text">
                    <strong>{post.event.title}</strong>
                    <span>{formatEventWhen(post.event.when)}</span>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};