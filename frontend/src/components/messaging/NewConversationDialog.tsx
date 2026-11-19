
"use client";

import { useState } from "react";
import { MessageSquarePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  useCreateConversation,
} from "@/features/messaging/message.queries";

type Props = {
  role: "admin" | "manager" | "staff" | "customer";
  onCreated: (conversationId: number) => void;
};

export default function NewConversationDialog({
  role,
  onCreated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [title, setTitle] = useState("");

  const createConversation = useCreateConversation();

  const isCustomer = role === "customer";

  const handleSubmit = async () => {
    try {
      if (!isCustomer && !recipientId.trim()) {
        toast.error("Please enter a recipient ID.");
        return;
      }

      const conversation = await createConversation.mutateAsync(
        isCustomer
          ? {
              type: "support",
              title: title.trim() || "Customer Support",
            }
          : {
              type: "internal",
              recipientId: Number(recipientId),
            }
      );

      toast.success("Conversation created successfully.");

      setOpen(false);
      setRecipientId("");
      setTitle("");

      onCreated(conversation.id);
    } catch (error) {
      console.error("Conversation creation error:", error);
      toast.error("Unable to create conversation.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          {isCustomer ? "Contact Support" : "New Message"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isCustomer
              ? "Contact ShopEase Support"
              : "Start a New Conversation"}
          </DialogTitle>

          <DialogDescription>
            {isCustomer
              ? "Create a conversation with our support team."
              : "Enter the user ID of the person you want to message."}
          </DialogDescription>
        </DialogHeader>

        {isCustomer ? (
          <div className="space-y-2">
            <Label htmlFor="support-title">
              Subject
            </Label>

            <Input
              id="support-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Order assistance"
              maxLength={150}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="recipient-id">
              Recipient User ID
            </Label>

            <Input
              id="recipient-id"
              type="number"
              min="1"
              value={recipientId}
              onChange={(event) =>
                setRecipientId(event.target.value)
              }
              placeholder="Enter recipient ID"
            />
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={createConversation.isPending}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          {createConversation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Conversation"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
