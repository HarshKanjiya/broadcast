"use client";
import { Button } from "@/components/ui/Button";
import { SubsciptionPayload } from "@/lib/validators/broadcast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, startTransition } from "react";
import { toast } from "react-hot-toast";

interface SubscibeLeaveTogglerProps {
  broadcastId: string;
  broadcastName: string;
  isSubscribed: boolean;
}

const SubscibeLeaveToggler: FC<SubscibeLeaveTogglerProps> = ({
  broadcastId,
  broadcastName,
  isSubscribed,
}) => {
  const router = useRouter();

  const { mutate: subscribe, isLoading: subscribeLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubsciptionPayload = {
        broadcastId: broadcastId,
      };
      const { data } = await axios.post("/api/broadcast/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error("Please, login to subscribe to this Network");
        }
      }
      return toast.error("Failed to subscribe to this Network!");
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast.success(`Subscribed to ${broadcastName} Netowrk`);
    },
  });

  const { mutate: unsubscribe, isLoading: unsubscribeLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubsciptionPayload = {
        broadcastId: broadcastId,
      };
      const { data } = await axios.post("/api/broadcast/unsubscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error("Please, Login to unsubscribe to this Network");
        }
      }
      return toast.error("Failed to unsubscribe this Network!");
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast.success(`${broadcastName} Netowrk Unsubscribed`);
    },
  });

  return isSubscribed ? (
    <Button
      className=" w-full mt-1 mb-3"
      onClick={() => unsubscribe()}
      isLoading={unsubscribeLoading}
    >
      Leave
    </Button>
  ) : (
    <Button
      className=" w-full mt-1 mb-3"
      onClick={() => subscribe()}
      isLoading={subscribeLoading}
    >
      Join
    </Button>
  );
};

SubscibeLeaveToggler.displayName = "SubscibeLeaveToggler";
export default SubscibeLeaveToggler;
