import { FC } from "react";

interface PostProps {}

const Post: FC<PostProps> = ({}) => {
  return <div>Post</div>;
};

Post.displayName = "Post";
export default Post;
