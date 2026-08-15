"use client";

import { useEffect, useState } from "react";


const TABS = [
  { key: "amir", label: "امیر" },
  { key: "ali", label: "علی" },
  { key: "reza", label: "رضا" },
];

export default function Home() {

  const [activeTab, setActiveTab] = useState("amir");
  const [text, setText] = useState("");
  const [ideas, setIdeas] = useState([]);


  useEffect(() => {
    let cancelled = false;

    fetch(`/api/ideas?tab=${activeTab}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setIdeas(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setIdeas([]);
      });
    return () => { cancelled = true; };

  }, [activeTab])



  async function addIdea(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tab: activeTab, text }),
    });

    if (res.ok) {
      const newIdea = await res.json();
      setIdeas([newIdea, ...ideas]);
      setText("");
    }

  }

  async function deleteIdea(id) {
    const res = await fetch(`/api/ideas?tab=${activeTab}&id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) setIdeas(ideas.filter((idea) => idea.id !== id));
  }

  return (
    <div className="p-6 bg-zinc-950 font-sans ">
      <div className="max-w-2xl mx-auto">

        <div className="flex gap-2 mb-6 bg-zinc-900 p-1 rounded-xl">

          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-md transition ${activeTab === tab.key
                ? "bg-emerald-600 text-white"
                : "text-neutral-400 hover:text-neutral-200"
                }`}
            >
              {tab.label}
            </button>
          ))}

        </div>

        <form
          onSubmit={addIdea}
          className="mb-8">

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ایده کسب وکار خود را وارد کنید..."
            rows={4}
            className="bg-zinc-900 w-full border border-zinc-800 px-4 py-3 text-sm mb-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none "
          />
          
          <button
            type="submit"
            disabled={!text.trim()}
            className="w-full bg-emerald-600 py-3 rounded-xl hover:bg-emerald-500 text-white transition-colors font-medium disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer">
            افزودن ایده
          </button>
        </form>

        {/* Ideas List */}
        <div className="space-y-4">

          {ideas.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">هنوز ایده‌ای ثبت نشده</p>

          ) : (
            ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-zinc-900 border border-emerald-600 rounded-xl overflow-hidden"
              >
                <div
                  className="px-5 py-4 border-b border-zinc-800">
                  <p
                    className="text-sm leading-relaxed whitespace-pre-wrap">
                    {idea.text}
                  </p>
                </div>
                <div
                  className="px-5 py-3 flex items-center justify-between bg-zinc-900/50">
                  <span
                    className="text-xs text-zinc-500">
                    {new Date(idea.createdAt).toLocaleString("fa-IR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    onClick={() => deleteIdea(idea.id)}
                    className="bg-red-400 text-sm cursor-pointer text-white px-2 py-1 rounded-lg">
                    حذف
                  </button>
                </div>
              </div>
            ))
          )}


        </div>
      </div>


    </div>
  );
}
