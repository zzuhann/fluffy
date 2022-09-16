import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import styled from "styled-components";
import "./petArticle.css";
import parse from "html-react-parser";
import {
  FaHeading,
  FaBold,
  FaStrikethrough,
  FaRedo,
  FaUndo,
} from "react-icons/fa";
import { TbHeading, TbBlockquote } from "react-icons/tb";
import { MdFormatListBulleted, MdHorizontalRule } from "react-icons/md";
import { AiOutlineOrderedList } from "react-icons/ai";

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
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        <FaHeading />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        <TbHeading />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <MdFormatListBulleted />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        <AiOutlineOrderedList />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        <TbBlockquote />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <MdHorizontalRule />
      </button>
      <button onClick={() => editor.chain().focus().undo().run()}>
        <FaUndo />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()}>
        <FaRedo />
      </button>
    </div>
  );
};

export const PetArticle: React.FC<{
  setAddArticleInfo: Dispatch<
    SetStateAction<{ title: string; context: string }>
  >;
  addArticleInfo: {
    title: string;
    context: string;
  };
}> = ({ setAddArticleInfo, addArticleInfo }) => {
  // useEffect(() => {
  //   setAddArticleInfo({ ...addArticleInfo, context: "" });
  // }, []);
  const editor = useEditor({
    extensions: [StarterKit],
    content: `${addArticleInfo.context}`,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setAddArticleInfo((pre) => {
        return { ...pre, context: html };
      });
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
  setEditArticleContext: Dispatch<
    SetStateAction<{ title: string; context: string }>
  >;
  editArticleContext: {
    title: string;
    context: string;
  };
}> = ({ editArticleContext, setEditArticleContext }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: `${editArticleContext.context}`,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditArticleContext((pre) => {
        return { ...pre, context: html };
      });
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
