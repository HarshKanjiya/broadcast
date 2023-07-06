import { getAuthSession } from "@/lib/AuthOptions";
import { db } from "@/lib/db";
import PostComment from "./Votes/comments/PostComment";
import CreateComment from "./Votes/comments/CreateComment";


interface CommentsSectionProps {
    postId: string
}


const CommentsSection = async ({ postId }: CommentsSectionProps) => {
    const sesssion = await getAuthSession()

    const comments = await db.comment.findMany({
        where: {
            postId: postId,
            replyToId: null
        },
        include: {
            replies: {
                include: {
                    author: true,
                    votes: true
                }
            },
            author: true,
            votes: true
        }
    })

    return <div className="flex flex-col mt-4 gap-y-4" >
        <hr className="w-full h-px my-6" />

        <CreateComment />

        <div className="flex flex-col  gap-y-6 mt-4" >
            {
                comments.filter((comments) => !comments.replyToId)
                    .reverse()
                    .map((topLvlCmt) => {
                        const topLvlCmtVoteAmt = topLvlCmt.votes.reduce((acc, vote) => {
                            if (vote.type === "UP") return acc + 1
                            if (vote.type === "DOWN") return acc - 1
                            return acc
                        }, 0)

                        const topLvlCmtVote = topLvlCmt.votes.find((vote) => vote.userId === sesssion?.user.id)


                        return (<div className="flex flex-col" key={topLvlCmt.id}>
                            <PostComment comment={topLvlCmt} />
                        </div>)
                    })
            }
        </div>
    </div>;
};


CommentsSection.displayName = 'CommentsSection'
export default CommentsSection