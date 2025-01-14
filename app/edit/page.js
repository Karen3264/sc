"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../context/storeContext";
import Conditional from "../../components/Conditional";
import { useAuth } from "../../context/authContext";
import ScribbleEditor from "./ScribbleEditor";
export default function EditScribble() {
  const { signUp, authLoading, setAuthLoading } = useAuth();
  const [conent, setContent] = useState();
  const { getDraft, saveScribble, publishScribble } = useStore();
  const [draft, setDraft] = useState();

  useEffect(() => {
    setAuthLoading(false);
    setup();
  }, []);

  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  const setup = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.get("id"));
    let d = await getDraft(urlParams.get("id"));
    console.log(d);
    d.id = urlParams.get("id");
    setDraft(d);
    setText(d.content);
  };

  const router = useRouter();

  const handleSaveDraft = async () => {
    await saveScribble(text, draft.id);
    console.log(draft);
    setStatus("Draft saved");
  };

  const handlePublish = async () => {
    await publishScribble(text, "test title", "status");
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
    />
  );
}
