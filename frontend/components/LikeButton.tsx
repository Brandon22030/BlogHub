import { useState } from "react";

interface LikeButtonProps {
  articleId: string;
  initialLiked: boolean;
  initialLikes: number;
  className?: string;
}

export default function LikeButton({
  articleId,
  initialLiked,
  initialLikes,
  className = "",
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  const handleLikeToggle = async () => {
    if (loading) return;
    setLoading(true);
    const status = liked ? 0 : 1;
    const res = await fetch(
      `http://localhost:3001/articles/${articleId}/like`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      },
    );
    if (res.ok) {
      const updated = await res.json();
      setLiked(status === 1);
      setLikes(updated.likes);
    }
    setLoading(false);
  };

  return (
    <button
      className={`flex items-center gap-1 text-xs focus:outline-none transition-colors ${
        liked
          ? "text-[#FC4308] hover:text-gray-500 group-hover:text-[#FC4308]"
          : "text-gray-500 hover:text-[#FC4308] group-hover:text-gray-500"
      } ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLikeToggle();
      }}
      aria-label={liked ? "Dislike" : "Like"}
      disabled={loading}
    >
      {liked ? (
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          className="inline text-red-500 group-hover:text-red-500"
        >
          <path d="M8 14s6-4.35 6-7.5A3.5 3.5 0 0 0 8 4.5 3.5 3.5 0 0 0 2 6.5C2 9.65 8 14 8 14z" />
          <line x1="4" y1="12" x2="12" y2="4" stroke="red" strokeWidth="2" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          fill="currentColor"
          className="inline text-red-500 group-hover:text-red-500"
        >
          <path d="M8 14s6-4.35 6-7.5A3.5 3.5 0 0 0 8 4.5 3.5 3.5 0 0 0 2 6.5C2 9.65 8 14 8 14z" />
        </svg>
      )}
      {likes} like{likes !== 1 ? "s" : ""}
    </button>
  );
}
