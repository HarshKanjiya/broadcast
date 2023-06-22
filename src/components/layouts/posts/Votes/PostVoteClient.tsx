"use client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { PostVoteRequestValidator } from "@/lib/validators/votes";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

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

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequestValidator = {
        postId: postId,
        voteType,
      };
      const { data } = await axios.patch("/api/broadcast/post/vote", payload);
      return data as string;
    },
    onError: (err, VoteType) => {
      // @ts-ignore
      if (VoteType === "UP") setVoteAmt((prev) => prev - 1);
      else setVoteAmt((prev) => prev + 1);

      setCurrentVote(prevVote);
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error("You need to login to Vote the Post!");
        }
      }

      return toast.error("Your vote wasn't registerd, please try again!");
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined)
        if (type === 'UP') setVoteAmt((prev) => prev - 1)
        else if (type === 'DOWN') setVoteAmt((prev) => prev + 1)
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentVote(type)
        if (type === 'UP') setVoteAmt((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'DOWN')
          setVoteAmt((prev) => prev - (currentVote ? 2 : 1))
      }
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
        onClick={() => {
          vote("UP");
        }}
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
        onClick={() => {
          vote("DOWN");
        }}
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
