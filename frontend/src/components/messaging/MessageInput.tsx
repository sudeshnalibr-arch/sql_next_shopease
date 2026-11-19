
"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  onSend: (body: string) => Promise<void> | void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  disabled?: boolean;
};

export default function MessageInput({
  onSend,
  onTypingStart,
  onTypingStop,
  disabled = false,
}: Props) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (value: string) => {
    setBody(value);

    if (value.trim()) {
      onTypingStart();
    } else {
      onTypingStop();
    }
  };

  const handleSubmit = async () => {
    const text = body.trim();

    if (!text || sending || disabled) return;

    try {
      setSending(true);
      await onSend(text);
      setBody("");
      onTypingStop();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex items-end gap-3 border-t bg-white p-4">
      <Textarea
        value={body}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Type your message..."
        rows={2}
        className="max-h-32 min-h-12 resize-none"
        disabled={disabled || sending}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            !event.shiftKey
          ) {
            event.preventDefault();
            void handleSubmit();
          }
        }}
      />

      <Button
        type="button"
        onClick={() => void handleSubmit()}
        disabled={!body.trim() || sending || disabled}
        className="bg-orange-500 hover:bg-orange-600"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
