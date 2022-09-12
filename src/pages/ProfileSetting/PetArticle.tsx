import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import styled from "styled-components";
import "./petArticle.css";
import parse from "html-react-parser";

const EditorInput = styled.div`
  position: absolute;
  width: 600px;
  height: 500px;
  border: solid 1px black;
`;

const MenuBar: React.FC<{ editor: Editor | null }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="menuBar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        strike
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button onClick={() => editor.chain().focus().undo().run()}>undo</button>
      <button onClick={() => editor.chain().focus().redo().run()}>redo</button>
    </div>
  );
};

export const PetArticle: React.FC<{
  setAddArticleInfo: (value: { title: string; context: string }) => void;
  addArticleInfo: {
    title: string;
    context: string;
  };
}> = ({ setAddArticleInfo, addArticleInfo }) => {
  useEffect(() => {
    setAddArticleInfo({ ...addArticleInfo, context: "" });
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: `${addArticleInfo.context}`,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setAddArticleInfo({ ...addArticleInfo, context: html });
    },
  });

  return (
    <div className="textEditor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

const MirrorTitle = styled.div`
  font-size: 30px;
  font-weight: bold;
  margin-top: 30px;
`;
const ProseMirror = styled.div``;

export const ContextDetails: React.FC<{
  addArticleInfo: {
    title: string;
    context: string;
  };
}> = ({ addArticleInfo }) => {
  return (
    <>
      <MirrorTitle>文章預覽</MirrorTitle>
      <ProseMirror className="ProseMirror">
        {parse(addArticleInfo.context)}
      </ProseMirror>
    </>
  );
};

export const EditPetArticle: React.FC<{
  setEditArticleContext: (value: { title: string; context: string }) => void;
  editArticleContext: {
    title: string;
    context: string;
  };
}> = ({ editArticleContext, setEditArticleContext }) => {
  // useEffect(() => {
  //   setEditArticleContext({ ...editArticleContext, context: "" });
  // }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: `${editArticleContext.context}`,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditArticleContext({ ...editArticleContext, context: html });
    },
  });

  return (
    <div className="textEditor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export const EditContextDetails: React.FC<{
  editArticleContext: {
    title: string;
    context: string;
  };
}> = ({ editArticleContext }) => {
  return (
    <>
      <MirrorTitle>文章預覽</MirrorTitle>
      <ProseMirror className="ProseMirror">
        {parse(editArticleContext.context)}
      </ProseMirror>
    </>
  );
};
