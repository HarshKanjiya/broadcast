"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CreateBroadcastPayload } from "@/lib/validators/broadcast";

const Page: FC = ({}) => {
  const router = useRouter();
  const [name, setName] = useState<string>("");

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
            <p className="absolute text-sm left-4 w-8 inset-y-0 grid place-items-center text-zinc-400 ">
              broadcast/
            </p>
            <Input
              className="pl-[5.6rem]"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
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
            disabled={name.trim().length === 0}
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
