"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import AddCommentForm from "./AddCommentForm";
import { CommentWithAuthorAndReplies } from "./CommentSection";

interface CommentItemProps {
  comment: CommentWithAuthorAndReplies;
  articleId: string;
  onCommentPosted: () => void;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  articleId,
  onCommentPosted,
  depth = 0,
}) => {
  const { user: currentUser } = useUser();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [editError, setEditError] = useState<string | null>(null);

  // State for likes
  const [optimisticLikesCount, setOptimisticLikesCount] = useState(comment.likesCount);
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);

  useEffect(() => {
    setOptimisticLikesCount(comment.likesCount);
    if (currentUser && comment.commentLikes) {
      setIsLikedByCurrentUser(
        comment.commentLikes.some((like) => like.userId === currentUser.userId)
      );
    } else {
      setIsLikedByCurrentUser(false);
    }
  }, [comment.likesCount, comment.commentLikes, currentUser]);

  const canEdit =
    currentUser &&
    currentUser.userId === comment.author?.id &&
    new Date().getTime() - new Date(comment.createdAt).getTime() <
      15 * 60 * 1000;

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onCommentPosted();
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editedContent.trim()) return;
    setEditError(null);

    try {
      const response = await fetch(
        `http://localhost:3001/comments/${comment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: editedContent }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        let errorMsg = `Error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {
          /* Ignore */
        }
        throw new Error(errorMsg);
      }
      onCommentPosted();
      setIsEditing(false);
    } catch (err) {
      const typedError =
        err instanceof Error ? err : new Error("Failed to update comment.");
      setEditError(typedError.message);
    }
  };

  const handleLikeUnlike = async () => {
    if (!currentUser) {
      setLikeError("You must be logged in to like a comment.");
      return;
    }
    setLikeError(null);

    const originalLikesCount = optimisticLikesCount;
    const originalIsLiked = isLikedByCurrentUser;

    // Optimistic update
    setIsLikedByCurrentUser(!originalIsLiked);
    setOptimisticLikesCount(originalIsLiked ? originalLikesCount - 1 : originalLikesCount + 1);

    const endpoint = `http://localhost:3001/comments/${comment.id}/${originalIsLiked ? 'unlike' : 'like'}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
        },
        credentials: "include",
      });

      if (!response.ok) {
        let errorMsg = `Error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch { /* Ignore */ }
        throw new Error(errorMsg);
      }
      onCommentPosted(); 
    } catch (err) {
      const typedError =
        err instanceof Error ? err : new Error("Failed to like/unlike comment.");
      setLikeError(typedError.message);
      // Rollback optimistic update on error
      setIsLikedByCurrentUser(originalIsLiked);
      setOptimisticLikesCount(originalLikesCount);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div
      className={`py-4 ${depth > 0 ? "ml-8 pl-4 border-l-2 border-gray-200" : ""}`}
      id={`comment-${comment.id}`}
    >
      <div className="flex items-start space-x-3">
        <Image
          src={comment.author?.imageUrl || "/avatar.svg"}
          alt={comment.author?.name || "User"}
          width={depth > 0 ? 32 : 40}
          height={depth > 0 ? 32 : 40}
          className="rounded-full flex-shrink-0 mt-1"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1">
            <span className="font-semibold mr-2 text-sm text-gray-900 truncate">
              {comment.author?.name || "Anonymous"}
            </span>
            <span className="text-xs text-gray-500 flex items-center">
              <span
                className="material-icons-outlined mr-1"
                style={{ fontSize: "0.875rem" }}
              >
                calendar_today
              </span>
              {formatDate(comment.createdAt)}
            </span>
          </div>

          {!isEditing ? (
            <p className="text-sm text-gray-700 whitespace-pre-line break-words">
              {comment.content}
            </p>
          ) : (
            <form onSubmit={handleEditSubmit} className="mt-1">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={3}
                className="w-full p-2 border text-black rounded-md focus:ring-2 focus:ring-[#FC4308] focus:border-transparent text-sm"
                required
              />
              {editError && (
                <p className="text-red-500 text-xs mt-1">{editError}</p>
              )}
              <div className="flex items-center justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(comment.content);
                    setEditError(null);
                  }}
                  className="px-3 py-1 text-xs font-medium text-gray-700 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-medium text-white bg-[#FC4308] rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC4308]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {!isEditing && (
            <div className="mt-2 flex items-center space-x-4">
              {/* Like Button */}
              {currentUser && (
                <button
                  onClick={handleLikeUnlike}
                  className={`flex items-center text-xs py-1 px-2 rounded-md transition-colors duration-150 ${
                    isLikedByCurrentUser
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  aria-pressed={isLikedByCurrentUser}
                >
                  <span
                    className="material-icons-outlined mr-1"
                    style={{ fontSize: "1rem" }} // Ajustez la taille si nécessaire
                  >
                    {isLikedByCurrentUser ? 'favorite' : 'favorite_border'}
                  </span>
                  {optimisticLikesCount} {isLikedByCurrentUser ? "Liked" : "Like"}
                </button>
              )}
              {!currentUser && (
                 <div className="flex items-center text-xs text-gray-500 py-1 px-2">
                    <span className="material-icons-outlined mr-1" style={{ fontSize: "1rem" }}>favorite_border</span>
                    {optimisticLikesCount} Like
                 </div>
              )}


              {/* Reply Button */}
              {currentUser && currentUser.userId !== comment.author?.id && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-xs py-1 px-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition-colors duration-150"
                >
                  {showReplyForm ? "Cancel" : "Reply"}
                </button>
              )}
              {/* Edit Button */}
              {canEdit && (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditedContent(comment.content);
                    setEditError(null);
                  }}
                  className="text-xs text-green-600 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
          )}
          {likeError && <p className="text-red-500 text-xs mt-1">{likeError}</p>}
        </div>
      </div>

      {showReplyForm && (
        <div className="mt-3 ml-8 pl-4">
          <AddCommentForm
            articleId={articleId}
            parentId={comment.id}
            onCommentPosted={handleReplySuccess}
            isReplyForm={true}
            replyingToAuthorName={comment.author?.name}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              articleId={articleId}
              onCommentPosted={onCommentPosted}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
