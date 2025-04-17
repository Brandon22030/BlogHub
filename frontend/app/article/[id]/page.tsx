"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Author {
  name: string;
  imageUrl?: string;
}

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: Author;
}

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    // Fetch article data
    fetch(`http://localhost:3001/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
        setLoading(false);
      });
    // Fetch related articles (example endpoint)
    fetch(`http://localhost:3001/articles/related/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // Defensive: handle both array and object (e.g. { data: [...] })
        if (Array.isArray(data)) {
          setRelated(data);
        } else if (Array.isArray(data?.data)) {
          setRelated(data.data);
        } else {
          setRelated([]);
        }
      });
  }, [id]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!article) return <div className="flex justify-center items-center min-h-screen">Article not found.</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto py-10">
      {/* Left: Main Article */}
      <div className="flex-1 bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">{article.title}</h1>
        {article.imageUrl && (
          <div className="w-full mb-6">
            <Image
              src={article.imageUrl.startsWith("/uploads/") ? `http://localhost:3001${article.imageUrl}` : article.imageUrl}
              alt={article.title}
              width={900}
              height={400}
              className="rounded-xl w-full h-[350px] object-cover"
            />
          </div>
        )}
        <div
  className="text-md text-gray-800 leading-relaxed whitespace-pre-line"
  dangerouslySetInnerHTML={{ __html: article.content }}
/>
      </div>

      {/* Right: Sidebar */}
      <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-8">
        {/* Top: Buttons */}
        <div className="flex gap-2 mb-4">
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-lg py-2 px-3 font-semibold text-gray-700">Share</button>
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-lg py-2 px-3 font-semibold text-gray-700">Marking</button>
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-lg py-2 px-3 font-semibold text-gray-700">Comments</button>
        </div>
        {/* Author Card */}
        <div className="bg-white rounded-xl shadow flex flex-col items-center p-5 mb-4">
          <Image
            src={article.author.imageUrl || "/avatar.png"}
            alt={article.author.name}
            width={60}
            height={60}
            className="rounded-full mb-3"
          />
          <div className="font-semibold text-lg text-gray-900 mb-2">{article.author.name}</div>
          <button className="bg-[#F81539] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#d81233] transition">Follow</button>
        </div>
        {/* Related Articles */}
        <div>
          <h3 className="font-bold text-lg mb-3 text-gray-800">Similar Articles</h3>
          <div className="flex flex-col gap-4">
            {related.map((rel) => (
              <Link key={rel.id} href={`/article/${rel.id}`} className="flex gap-3 items-center bg-gray-50 rounded-lg p-2 hover:bg-gray-100">
                <Image
                  src={rel.imageUrl?.startsWith("/uploads/") ? `http://localhost:3001${rel.imageUrl}` : rel.imageUrl || "/avatar.png"}
                  alt={rel.title}
                  width={50}
                  height={50}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900 line-clamp-2">{rel.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
