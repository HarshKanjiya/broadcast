"use client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { PostVoteRequestValidator } from "@/lib/validators/votes";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface PostVoteClientProps {
  postId: string;
  initialVoteAmt: number;
  initialVote?: VoteType | null;
}

const PostVoteClient: FC<PostVoteClientProps> = ({
  initialVoteAmt,
  postId,
  initialVote,
}) => {
  const [voteAmt, setVoteAmt] = useState<number>(initialVoteAmt);
  const [currentVote, setCurrentVote] = useState<any>(initialVoteAmt);
  const prevVote = usePrevious(currentVote);

  const {} = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequestValidator = {
        postId: postId,
        voteType,
      };
      const { data } = await axios.patch("/api/broadcast/post/vote", payload);
    },
  });

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  return (
    <div className="flex sm:flex-col sm:items-center gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      <Button
        size="sm"
        variant="ghost"
        aria-label="up vote"
        className=" aspect-square focus:ring-0 h-fit w-fit"
      >
        <ArrowBigUp
          className={
            (cn("h-5 w-5 text-zinc-100"),
            currentVote === "UP" ? "text-emerald-500 fill-emerald-500" : "")
          }
        />
      </Button>
      <p className="text-center py-2 font-medium text-sm text-zinc-900 ">
        {voteAmt}
      </p>
      <Button
        size="sm"
        variant="ghost"
        aria-label="down vote"
        className=" aspect-square focus:ring-0 h-fit w-fit"
      >
        <ArrowBigDown
          className={
            (cn("h-5 w-5 text-zinc-100"),
            currentVote === "DOWN" ? "text-red-500 fill-red-500" : "")
          }
        />
      </Button>
    </div>
  );
};

PostVoteClient.displayName = "PostVoteClient";
export default PostVoteClient;
