import React, { useEffect } from "react";
import { useQuill } from "react-quilljs";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const List = Quill.import("formats/list");
const Bold = Quill.import("formats/bold");
const Header = Quill.import("formats/header");
const Italic = Quill.import("formats/italic");
const Underline = Quill.import("formats/underline");
const Link = Quill.import("formats/link");
const Align = Quill.import("formats/align");

Quill.register(List, true);
Quill.register(Bold, true);
Quill.register(Header, true);
Quill.register(Italic, true);
Quill.register(Underline, true);
Quill.register(Link, true);
Quill.register(Align, true);

const editorModules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [
            { align: "" },
            { align: "center" },
            { align: "right" },
            { align: "justify" },
        ],
        ["link"],
        ["clean"],
    ],
};

const editorFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "link",
    "align",
];

export default function QuillEditor({ value, onChange, placeholder }) {
    const { quill, quillRef } = useQuill({
        modules: editorModules,
        formats: editorFormats,
        placeholder,
    });

    useEffect(() => {
        if (quill && value !== quill.root.innerHTML) {
            quill.root.innerHTML = value;
        }
    }, [quill, value]);

    useEffect(() => {
        if (quill) {
            quill.on("text-change", (delta, oldDelta, source) => {
                if (source === "user") {
                    onChange(quill.root.innerHTML);
                }
            });
        }
    }, [quill, onChange]);

    return (
        <div className="mb-20 h-[200px] sm:h-[300px] lg:h-[500px]">
            <div
                ref={quillRef}
                className="
      border rounded-md shadow-sm 
      text-sm sm:text-base lg:text-lg
      p-2 sm:p-3 lg:p-4
      h-full
    "
            ></div>
        </div>
    );
}
