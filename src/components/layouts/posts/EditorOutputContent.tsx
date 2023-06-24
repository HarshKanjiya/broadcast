import dynamic from "next/dynamic";
import Image from "next/image";
import { FC } from "react";
import { createReactEditorJS } from "react-editor-js";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false }
);

interface EditorOutputContentProps {
  content: any;
}

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const EditorOutputContent: FC<EditorOutputContentProps> = ({ content }) => {
  const ReactEditorJS = createReactEditorJS();

  return (
    <ReactEditorJS defaultValue={content} holder="RENDERER"  />
  );
};

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;
  return (
    <div className="relative w-full min-h-[15rem]">
      <Image src={src} className="object-contain" fill alt="image" />
    </div>
  );
}

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className="bg-gray-800 rounded-md p-4 ">
      <code lang="javascript" className="text-gray-100 text-sm">
        {data.code}
      </code>
    </pre>
  );
}


EditorOutputContent.displayName = "EditorOutputContent";
export default EditorOutputContent;
