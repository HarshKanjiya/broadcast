"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateBroadcastPayload } from "@/lib/validators/broadcast";
import { toast } from "react-hot-toast";

const Page: FC = ({}) => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const {
    mutate: createBroadcast,
    isLoading,
    // isError,
    // isSuccess,
  } = useMutation({
    mutationFn: async () => {
      const payload: CreateBroadcastPayload = {
        name: name,
      };
      const { data } = await axios.post("/api/broadcast", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return setErr("Please chose different Name this one already Exists");
        }
        if (err.response?.status === 422) {
          return setErr("Name must be between 3 to 28 characters");
        }
        if (err.response?.status === 401) {
          return toast.error("Please, login to Create your Broadcast");
        }
      }
      toast.error("Failed to Create Broadcast Network");
    },
    onSuccess: (data) => {
      toast.success("Your Broadcast Network has been Created!");
      router.push(`/broadcast/${data}`);
    },
  });

  return (
    <div className=" md:container  flex items-center h-full max-w-3xl mx-auto ">
      <div className="relative bg-white w-full h-fit p-4 pt-5 rounded-lg space-y-5 ">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create new Broadcast</h1>
        </div>

        <hr className="bg-zinc-500 h-px" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p>Broadcast names cannot be changegd after created.</p>
          <div className="relative mt-4">
            <p className="absolute text-sm left-4 w-8 top-[11px] grid place-items-center text-zinc-400 ">
              broadcast/
            </p>
            <Input
              className="pl-[5.6rem]"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
            {err && (
              <p className=" text-sm text-red-300 py-0.5 block md:absolute ">
                {err}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="subtle"
            onClick={() => {
              router.back();
            }}
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={name.trim().length === 0 || isLoading}
            onClick={() => createBroadcast()}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

Page.displayName = "Page";
export default Page;
