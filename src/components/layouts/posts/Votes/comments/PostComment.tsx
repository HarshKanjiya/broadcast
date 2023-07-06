"use client"
import UserAvatar from "@/components/layouts/profile/UserAvatar";
import { Comment, CommentVote, User } from "@prisma/client";
import moment from "moment";
import { useRef } from "react";


type ExtendedComment = Comment & {
    votes: CommentVote[]
    author: User
}

interface PostCommentProps {
    comment: ExtendedComment
}


const PostComment = ({ comment }: PostCommentProps) => {

    const commentRef = useRef<HTMLDivElement>(null)
    return <div ref={commentRef} className="flex flex-col " >
        <div className="flex items-center" >
            <UserAvatar
                className="h-8 w-8"
                user={{ image: comment.author.image || null, name: comment.author.name }}
            />
            <div className="ml-4 flex items-center gap-x-2" >
                <p className="text-sm  font-medium text-gray-900" >
                    {comment.author.name}
                </p>
                <p className="max-h-40 truncate text-xs text-zinc-500" >
                    {moment(comment.createdAt).toNow()}
                </p>
            </div>
        </div>
        <div>
            <p className="text-sm text-zinc-900 mt-2" >
                {comment.text}
            </p>
        </div>
    </div>;
};


PostComment.displayName = 'PostComment'
export default PostComment