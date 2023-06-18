"use client"
import { FC } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface EditorProps {}

const Editor: FC<EditorProps> = ({}) => {
  const lol = () => {
    console.log("object :>> ");
  };

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form id="broadcast-post-form" className="w-full" onSubmit={lol}>
        <div className="prose prose-stone dark:prose-invert ">
          <TextareaAutosize
            placeholder="title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
        </div>
      </form>
    </div>
  );
};

Editor.displayName = "Editor";
export default Editor;
