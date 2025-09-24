import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import MarkdownIt from "markdown-it";
import { generativeContentStream } from "../services/geminiServices";
import { MdOutlineArrowBack, MdAddPhotoAlternate } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const md = new MarkdownIt();

export default function RuliAi() {
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!prompt && !imageFile) return;

    const userMessage = {
      sender: "user",
      text: prompt,
      img: imagePreview || null,
    };

    setMessages((prev) => [...prev, userMessage, { sender: "bot", text: "" }]);
    setPrompt("");
    setImageFile(null);
    setImagePreview("");

    setIsLoading(true);
    try {
      const result = await generativeContentStream(prompt, imageFile);
      let buffer = [];

      for await (const response of result.stream) {
        buffer.push(response.text());
        setMessages((prev) => {
          const newText = md.render(buffer.join(""));
          const lastMessage = prev[prev.length - 1]
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, text: newText },
          ];

        });
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `<p style="color:red;">Error: ${e.message}</p>`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-poppins">
      <nav className="sticky top-0 z-40 bg-white shadow-md">
        <div className="container mx-auto flex items-center px-4 py-3">
          <Link
            to="/"
            className="flex items-center justify-center rounded-full bg-blue-600 h-10 w-10 shadow-md"
          >
            <MdOutlineArrowBack className="text-white text-2xl" />
          </Link>
          <h1 className="ml-4 text-gray-800 font-semibold text-lg">RuliAi</h1>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-4 ">
        <div className="w-[95%] md:w-[70%] mx-auto flex flex-col space-y-4">
          {messages.map((msg, idx) => (
            (msg.text || msg.img) && (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 rounded-2xl shadow break-words prose ${msg.sender === "user"
                    ? "bg-gray-200 text-gray-800 p-2"
                    : "bg-gray-200 text-gray-800 p-2"
                    }`}
                >
                  {msg.img && (
                    <img
                      src={msg.img}
                      alt="preview"
                      className="rounded-lg mb-2 max-w-full"
                    />
                  )}
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                </div>
              </div>
            )
          ))}
          {isLoading && (
            <div className="flex justify-start ">
              <div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-600 italic">
                Sedang berpikir... JANGAN GANGGU
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <div className="w-full py-2 bg-white border-t border-gray-200">
        <form
          onSubmit={handleSubmit}
          className="w-[95%] md:w-[70%] mx-auto flex items-baseline-last gap-3"
        >
          <div className="relative flex-grow flex items-center bg-gray-100 rounded-full border border-gray-300">
            <input
              type="text"
              className="w-full p-3 pl-4 pr-28 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tanyakan sesuatu..."
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <label htmlFor="file-upload" className="cursor-pointer p-1 rounded-full hover:bg-gray-200 transition">
                <MdAddPhotoAlternate className="text-3xl text-gray-600" />
              </label>
              <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleImageChange} disabled={isLoading} />

              <button
                type="submit"
                className="bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center"
                disabled={isLoading}
              >
                <FaArrowUp className="text-white" />
              </button>
            </div>

            {imagePreview && (
              <div className="absolute bottom-20 left-25 -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg border">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="max-w-[150px] rounded"
                />
                <button
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  className="absolute top-2 right-2 text-red-500 text-sm"
                >
                  <ImCross />
                </button>
              </div>
            )}
          </div>
        </form>
        <p className="text-gray-500 text-xs sm:text-sm text-center px-4 pt-1">
          Semua bisa membuat kesalahan, termasuk AI
        </p>
      </div>
    </div>
  );
}
