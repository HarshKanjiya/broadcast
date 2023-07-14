"use client";
import { Button } from "@/components/ui/Button";
import { uploadFiles } from "@/lib/UploadThing";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import type EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";

interface EditorProps {
  broadcastId: string;
  broadcastName: string;
}

const Editor: FC<EditorProps> = ({ broadcastId, broadcastName }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      title: "",
      content: "",
      broadcastId: broadcastId,
    },
  });

  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const _titleRef = useRef<HTMLTextAreaElement>();
  const pathname = usePathname();
  const router = useRouter();

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;

    const Header = (await import("@editorjs/header")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const Embed = (await import("@editorjs/embed")).default;
    // const Table = (await import("@editorjs/table")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const Image = (await import("@editorjs/image")).default;
    // const LinkTool = (await import("@editorjs/link")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          list: List,
          code: Code,
          embed: Embed,
          // table: Table,
          inlineCode: InlineCode,
          // linkTool: {
          //   class: LinkTool,
          //   inlineToolbar:true,
          //   config: {
          //     // endpoint: "/api/link",
          //   },  
          // },
          image: {
            class: Image,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], "imageUploader");
                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
        },
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        // @ts-ignore
        toast.error(value as string);
      }
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
    };

    setTimeout(() => {
      _titleRef.current?.focus();
    }, 0);

    if (isMounted) {
      init();
      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  const { mutate: submitPost, isLoading } = useMutation({
    mutationFn: async (data: PostCreationRequest) => {
      const payload: PostCreationRequest = data;
      const { data: res } = await axios.post(
        "/api/broadcast/post/create",
        payload
      );
      return res as string;
    },
    onError: () => {
      toast.error("Oops, something is'nt Right!");
    },
    onSuccess: () => {
      const newPathname = pathname.split("/").slice(0, -1).join("/");
      router.push(newPathname);
      router.refresh();
      toast.success(`Your post created on ${broadcastName} Network`);
    },
  });

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await ref.current?.save();

    const palyload: PostCreationRequest = {
      broadcastId,
      title: data.title,
      content: blocks,
    };

    submitPost(palyload);
  }

  if (!isMounted) {
    return null;
  }

  const { ref: titleRef, ...rest } = register("title");

  return (
    <>
      <div className="w-full  p-4 bg-white rounded-lg border border-zinc-200">
        <form
          id="broadcast-post-form"
          className="w-full flex justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="prose prose-stone dark:prose-invert bg-red">
            <TextareaAutosize
              ref={(e) => {
                titleRef(e);
                //@ts-ignore
                _titleRef.current = e;
              }}
              {...rest}
              placeholder="title"
              className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            />
            <div id="editor" className="min-h-[450px] " />
          </div>
        </form>
      </div>
      <div className="w-full flex justify-end">
        <Button
          isLoading={isLoading}
          type="submit"
          className="w-full "
          form="broadcast-post-form"
        >
          Post
        </Button>
      </div>
    </>
  );
};

Editor.displayName = "Editor";
export default Editor;
