"use client";

import React, { useState, useCallback } from "react";
import { useUser } from "@/context/UserContext"; // Import the useUser hook
import Image from "next/image";

interface AddCommentFormProps {
  articleId: string;
  onCommentPosted: () => void; // Callback to refresh comments list
  parentId?: string; // Optional: for replies
  isReplyForm?: boolean; // Optional: to adjust UI for replies
  replyingToAuthorName?: string; // Optional: to customize placeholder
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({
  articleId,
  onCommentPosted,
  parentId,
  isReplyForm = false,
  replyingToAuthorName,
}) => {
  const { user } = useUser(); // Get user state from context
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!user || !newComment.trim()) return; // Ensure user is logged in and comment is not empty

      setIsSubmitting(true);
      setError(null);

      try {
        const response = await fetch(`https://bloghub-8ljb.onrender.com/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newComment,
            articleId: articleId,
            parentId: parentId, // Include parentId if present
          }),
          credentials: "include", // Send httpOnly cookie automatically
        });

        if (!response.ok) {
          let errorMsg = `Error: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
          } catch {
            /* Ignore if body isn't JSON */
          }
          throw new Error(errorMsg);
        }

        // Success
        setNewComment(""); // Clear the form
        onCommentPosted(); // Notify parent to refresh comments
      } catch (err) {
        console.error("Error posting comment:", err);
        const typedError =
          err instanceof Error ? err : new Error("Failed to post comment.");
        setError(typedError.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, newComment, articleId, parentId, onCommentPosted],
  );

  // Don't render the form if the user is not logged in
  if (!user) {
    return (
      <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm text-center text-gray-600">
        Please{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          log in
        </a>{" "}
        to post a comment.
        {/* TODO: Link to login page or show login modal */}
      </div>
    );
  }

  // Render the form if the user is logged in
  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 border rounded-lg bg-white shadow-sm"
    >
      <div className="flex items-start space-x-3">
        {/* User Avatar */}
        <Image
          src={user.imageUrl || "/avatar.svg"} // Use a default avatar if none provided
          alt={user.userName || "User"}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              isReplyForm
                ? `Replying to ${replyingToAuthorName || "comment"}...`
                : `Commenting as ${user.userName}... What are your thoughts?`
            }
            rows={isReplyForm ? 2 : 3} // Smaller textarea for replies
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-800 ${isReplyForm ? "text-xs" : ""}`}
            required
            disabled={isSubmitting}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className={`px-4 py-2 bg-[#FC4308] text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out ${isSubmitting || !newComment.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddCommentForm;
