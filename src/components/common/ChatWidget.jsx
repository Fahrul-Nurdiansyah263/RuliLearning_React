import { useState } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="relative bottom-full right-0 mb-3 w-56 rounded-lg bg-white shadow-xl transition-all duration-300">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-900 focus:outline-none"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="p-2.5">
            <p className="text-xs text-gray-700">Hi, aku RuliAi</p>
            <a
              href="ruli-ai" 
              className="text-sm font-bold text-blue-600 hover:underline"
            >
              Coba sekarang! <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-4xl text-white shadow-lg transition-transform duration-300 hover:scale-110"
      >
        🤖
      </button>
    </div>
  );
}
