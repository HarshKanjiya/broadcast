"use client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { CommentVoteRequestValidator } from "@/lib/validators/votes";
import { usePrevious } from "@mantine/hooks";
import { CommentVote, VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { FC, useState } from "react";
import { toast } from "react-hot-toast";

interface CommentVotesProps {
    commentId: string;
    initialVoteAmt: number;
    initialVote?: Pick<CommentVote, "type">;
}

const CommentVotes: FC<CommentVotesProps> = ({
    commentId,
    initialVoteAmt,
    initialVote,
}) => {
    const [votesAmt, setVotesAmt] = useState<number>(initialVoteAmt);
    const [currentVote, setCurrentVote] = useState(initialVote);
    const prevVote = usePrevious(currentVote);

    const { mutate: vote } = useMutation({
        mutationFn: async (type: VoteType) => {
            const payload: CommentVoteRequestValidator = {
                voteType: type,
                commentId: commentId,
            };

            await axios.patch("/api/broadcast/post/comments/votes", payload);
        },
        onError: (err, voteType) => {
            if (voteType === "UP") setVotesAmt((prev) => prev - 1);
            else setVotesAmt((prev) => prev + 1);

            // reset current vote
            setCurrentVote(prevVote);

            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return toast.error("You have to Login to Vote the Thought");
                }
            }

            return toast.error("Your vote was not registered. Please try again.");
        },
        onMutate: (type) => {
            if (currentVote?.type === type) {
                // User is voting the same way again, so remove their vote
                setCurrentVote(undefined);
                if (type === "UP") setVotesAmt((prev) => prev - 1);
                else if (type === "DOWN") setVotesAmt((prev) => prev + 1);
            } else {
                // User is voting in the opposite direction, so subtract 2
                setCurrentVote({ type });
                if (type === "UP") setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
                else if (type === "DOWN")
                    setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
            }
        },
    });


    return (
        <div className="flex gap-1">
            <Button
                size="sm"
                variant="ghost"
                aria-label="up vote"
                className=" aspect-square focus:ring-0 h-fit w-fit focus:ring-offset-0 "
                onClick={() => {
                    vote("UP");
                }}
            >
                <ArrowBigUp
                    className={cn("h-5 w-5 text-zinc-700", {
                        "text-emerald-500 fill-emerald-500": currentVote?.type === "UP",
                    })}
                />
            </Button>
            <p className="text-center py-2 font-medium text-sm text-zinc-900 ">
                {votesAmt}
            </p>
            <Button
                size="sm"
                variant="ghost"
                aria-label="down vote"
                className={cn("aspect-square focus:ring-0 h-fit w-fit  focus:ring-offset-0", {
                    "text-emerald-500": currentVote?.type === "DOWN",
                })}
                onClick={() => {
                    vote("DOWN");
                }}
            >
                <ArrowBigDown
                    className={cn("h-5 w-5 text-zinc-700", {
                        "text-red-500 fill-red-500": currentVote?.type === "DOWN",
                    })}
                />
            </Button>
        </div>
    );
};

CommentVotes.displayName = "CommentVotes";
export default CommentVotes;
