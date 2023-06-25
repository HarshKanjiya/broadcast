import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { FC, useRef } from "react";
import moment from "moment";
import EditorOutputContent from "./EditorOutputContent";
import PostVoteClient from "./Votes/PostVoteClient";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  broadcastName?: string;
  post: Post & {
    author: User;
    votes: Vote[];
  };
  commentAmt: number;
  votesAmt: number;
  currentVote?: PartialVote;
}

const Post: FC<PostProps> = ({
  broadcastName,
  post,
  commentAmt,
  votesAmt: votesAmt,
  currentVote,
}) => {
  const pRef = useRef<HTMLDivElement>(null);
  return (
    <div className="rounded-md overflow-hidden bg-white shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px]">
      <div className="px-3 sm:px-6 py-2 sm:py-4 flex-col sm:flex-row flex w-full justify-between">
        <PostVoteClient
          postId={post.id}
          initialVoteAmt={votesAmt}
          initialVote={currentVote?.type}
        />
        <div className="flex-1 w-full ">
          <div className="max-h-40 sm:mt-1 text-xs text-gray-500 ">
            {broadcastName ? (
              <>
                <a
                  className="underline text-zinc-900 text-sm underline-offset-2"
                  href={`/broadcast/${broadcastName}`}
                >
                  brodcast/ {broadcastName}
                </a>
                <span className="px-2">•</span>
              </>
            ) : null}
            <span className="pr-4">Posted by {post.author.name}</span>
            {/* {formatTimeToNow(post.createdAt)} */}
            {moment(post.createdAt).fromNow()}
          </div>
          <a href={`/broadcast/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>
          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={pRef}
          >
            <EditorOutputContent content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 z-20 text-sm p-3 sm:px-6 w-full">
        <a
          className="w-fit flex items-center gap-2"
          href={`/broadcast/${broadcastName}/post/${post.id}`}
        >
          <MessageSquare className="h-4 w-4" />
          {commentAmt} comments
        </a>
      </div>
    </div>
  );
};

Post.displayName = "Post";
export default Post;
