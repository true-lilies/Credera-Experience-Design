import { Avatar } from '../avatar';
import { PostMeta } from './PostMeta';
import { PostBody } from './PostBody';

export const PostCard = ({ post }) => {
  const authorName = `${post.authorFirstName} ${post.authorLastName}`;

  return (
    <div className="content-card">
      <div className="post-author">
        <div className="post-author-avatar">
          <Avatar name={authorName} src={post.authorImage} />
        </div>
        <div className="post-author-info">
          <p className="page-paragraph">{authorName}</p>
          <p className="page-micro">
            {post.jobTitle} @ {post.companyName}
          </p>
          <PostMeta
            publishDate={post.publishDate}
            city={post.city}
            state={post.state}
          />
        </div>
      </div>
      <PostBody text={post.post} />
    </div>
  );
};