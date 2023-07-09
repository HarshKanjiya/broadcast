"use client"
import UserAvatar from "@/components/layouts/profile/UserAvatar";
import { Comment, CommentVote, User } from "@prisma/client";
import moment from "moment";
import { useRef, useState } from "react";
import CommentVotes from "./CommentVotes";
import { Button } from "@/components/ui/Button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/TextArea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/Comment";
import axios from "axios";
import { toast } from "react-hot-toast";


type ExtendedComment = Comment & {
    votes: CommentVote[]
    author: User

}

interface PostCommentProps {
    votesAmt: number
    currentVote: CommentVote | undefined
    postId: string
    comment: ExtendedComment
}


const PostComment = ({ comment, currentVote, postId, votesAmt }: PostCommentProps) => {

    const router = useRouter()
    const { data: session } = useSession()
    const [isReplying, setIsReplying] = useState<boolean>(false)
    const [input, setInput] = useState<string>("")

    const commentRef = useRef<HTMLDivElement>(null)

    const { isLoading, mutate: sendThought } = useMutation({
        mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
            const payload: CommentRequest = {
                postId, text, replyToId
            }
            const { data } = await axios.patch("/api/broadcast/post/comments", payload)
            return data as string
        },
        onError: () => {
            toast.error("Failed to add your Thought");
        },
        onSuccess: () => {
            router.refresh()
            setInput("")
            setIsReplying(false)
        },
    })

    return (
        <div ref={commentRef} className="flex flex-col " >
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
            <div className="flex gap-2 items-center" >
                <CommentVotes commentId={comment.id} initialVoteAmt={votesAmt} initialVote={currentVote} />
                <Button onClick={() => {
                    if (!session) return router.push("/signin")
                    setIsReplying(!isReplying)
                }} variant="ghost" size="xs" > <MessageSquare className="h-4 w-4 mr-1.5" /> reply</Button>

            </div>
            {
                isReplying ?
                    <div className='grid w-full gap-1.5 pt-2 ' >
                        <Label htmlFor='comment' > Your Thoughts</Label>
                        <Textarea id="comment" value={input} onChange={(e) => { setInput(e.target.value) }} placeholder='Your Thoughts' />
                        <div className="flex gap-2 justify-end items-center mt-1 " >
                            <Button tabIndex={-1} variant="subtle" onClick={() => { setIsReplying(false) }} >Cancel</Button>
                            <Button className='w-fit' isLoading={isLoading} disabled={input.length === 0 || false} onClick={() => {
                                if (!input) return
                                sendThought({ postId, text: input, replyToId: comment.replyToId ?? comment.id })
                            }} >ADD</Button>
                        </div>
                    </div>
                    : null
            }
        </div>
    );
};


PostComment.displayName = 'PostComment'
export default PostComment