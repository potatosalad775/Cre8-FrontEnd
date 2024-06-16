import React from "react";
import { useEditor, EditorContent, EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import classes from "./Editor.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faStrikethrough,
  faListUl,
  faListOl,
  faMinus,
  faRotateLeft,
  faRotateRight,
  faUnderline,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
} from "@fortawesome/free-solid-svg-icons";
import { Divider } from "@mui/material";

const MenuBar = ({editor}) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={classes.editorMenuBar}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <FontAwesomeIcon icon={faBold} fixedWidth />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <FontAwesomeIcon icon={faStrikethrough} fixedWidth />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
      >
        <FontAwesomeIcon icon={faUnderline} fixedWidth />
      </button>
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{ "border-color": "#aeaba7" }}
      />
      <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <FontAwesomeIcon icon={faAlignLeft} fixedWidth />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <FontAwesomeIcon icon={faAlignCenter} fixedWidth />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <FontAwesomeIcon icon={faAlignRight} fixedWidth />
      </button>
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{ "border-color": "#aeaba7" }}
      />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <FontAwesomeIcon icon={faListUl} fixedWidth />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        <FontAwesomeIcon icon={faListOl} fixedWidth />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <FontAwesomeIcon icon={faMinus} fixedWidth />
      </button>
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{ "border-color": "#aeaba7" }}
      />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <FontAwesomeIcon icon={faRotateLeft} fixedWidth />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <FontAwesomeIcon icon={faRotateRight} fixedWidth />
      </button>
    </div>
  );
};

export const TestEditor = () => {
  const editor = useEditor({
    extensions: extensions,
    content: "Hello!",
  });

  return (
    <div className={`${classes.editor}`}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor}/>
    </div>
  );
};

export const ProfileEditor = ({ profileAbout, setProfileAbout }) => {
  const editor = useEditor({
    extensions: extensions,
    content: profileAbout ? {
      "type": "doc",
      "content": profileAbout,
    } : "",
    onUpdate: ({editor}) => {
      const json = editor.getJSON()
      const data = json.content
      //console.log(profileAbout)
      //console.log(data)
      setProfileAbout(data);
    }
  });

  return (
    <div className={`${classes.editor} ${classes.profileEditor}`}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor}/>
    </div>
  );
};

export const ReadOnlyEditor = ({ content }) => {
  const editor = useEditor({
    editable: false,
    extensions: extensions,
    content: content ? {
      "type": "doc",
      "content": content,
    } : "",
  });

  return (
    <div className={`${classes.editor} ${classes.profileEditor}`}>
      <EditorContent editor={editor}/>
    </div>
  );
};

const extensions = [
  StarterKit,
  Underline,
  TextAlign.configure({
    types: ["paragraph"],
    alignments: ["left", "center", "right"],
  }),
  Link.configure({
    openOnClick: true,
    autolink: true,
    rel: "noopener noreferrer",
  }),
];
