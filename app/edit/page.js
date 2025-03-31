"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../context/storeContext";
import Conditional from "../../components/Conditional";
import { useAuth } from "../../context/authContext";
import ScribbleEditor from "./ScribbleEditor";

export default function EditScribble() {
  const { signUp, authLoading, setAuthLoading } = useAuth();
  const [content, setContent] = useState();
  const { getDraft, saveScribble, publishScribble } = useStore();
  const [draft, setDraft] = useState();
  const [title, setTitle] = useState("");
  const [draftId, setDraftId] = useState(null);

  useEffect(() => {
    setAuthLoading(false);
    setup();
  }, []);

  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  const setup = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      console.log(id);
      let d = await getDraft(id);
      console.log(d);
      d.id = id;
      setDraft(d);
      setText(d.content);
      setTitle(d.title || "");
      setDraftId(id);
    }
  };

  const router = useRouter();

  const handleSaveDraft = async () => {
    try {
      const newDraftId = await saveScribble(text, draftId, title);
      setDraftId(newDraftId);
      setStatus("Draft saved");
      router.push("/drafts"); // Redirect to drafts page after saving
    } catch (error) {
      console.error("Error saving draft:", error);
      setStatus("Error saving draft");
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      setStatus("Please enter a title");
      return;
    }
    await publishScribble(text, title, "status", draftId);
    setStatus("Scribble published");
    router.push("/"); // Redirect to home or any other page
  };

  return (
    <ScribbleEditor
      text={text}
      onTextChange={setText}
      onSave={handleSaveDraft}
      onPublish={handlePublish}
      status={status}
      title={title}
      onTitleChange={setTitle}
    />
  );
}
