"use client";

import React, { useState, useEffect, useCallback } from "react";
import AddCommentForm from "./AddCommentForm";
import CommentItem from "./CommentItem"; // Import CommentItem
import Image from "next/image";

// Define the structure of a comment based on the backend schema
export interface Author {
  // Export Author type
  id: string;
  name: string;
  imageUrl?: string | null;
}

export interface CommentWithAuthorAndReplies {
  // Export and rename to match CommentItem
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  replies?: CommentWithAuthorAndReplies[];
  parentId?: string | null; // Add parentId as it's part of the backend response for replies
  likesCount: number;
  commentLikes: Array<{ userId: string; /* other fields from CommentLike if needed */ }>;
}

interface CommentSectionProps {
  articleId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const [comments, setComments] = useState<CommentWithAuthorAndReplies[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use fetch API
      const response = await fetch(
        `https://bloghub-8ljb.onrender.com/comments/article/${articleId}`
      );

      if (!response.ok) {
        // Try to get error message from backend response, otherwise use status text
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {
          // Ignore if response body is not JSON or other error occurs during json parsing
        }
        throw new Error(errorMsg);
      }

      const data: CommentWithAuthorAndReplies[] = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      const error =
        err instanceof Error ? err : new Error("An unknown error occurred");
      setError(error.message || "Failed to load comments.");
    } finally {
      setIsLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
  }, [articleId, fetchComments]);

  return (
    <div className="mt-8 p-4 bg-slate-50 rounded-lg shadow">
      <div className="flex gap-[6px] items-center mb-5">
        <Image src="/red_ops.svg" alt="reed_ops" width={4} height={4} />
        <h2 className="text-xl font-semibold* text-gray-700">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Add Comment Form */}
      <AddCommentForm articleId={articleId} onCommentPosted={fetchComments} />

      {isLoading && <p className="text-gray-600">Loading comments...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && !error && comments.length === 0 && (
        <p className="text-gray-500">
          No comments yet. Be the first to comment!
        </p>
      )}

      {/* Comment List - using CommentItem */}
      {!isLoading && !error && comments.length > 0 && (
        <div className="space-y-4 mt-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
              onCommentPosted={fetchComments} // Pass fetchComments to refresh list
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
