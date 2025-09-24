import { FiUploadCloud } from "react-icons/fi";

export default function FileUploadPreview({ label, file, setFile, preview, previewLama }) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10">
        <div className="text-center">
          {preview ? (
            <img src={preview} alt={`Preview ${label}`} className="mx-auto h-48 w-auto rounded-lg shadow-md" />
          ) : previewLama ? (
            <img src={previewLama} alt={`Gambar Lama ${label}`} className="mx-auto h-48 w-auto rounded-lg shadow-md" />
          ) : (
            <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <label htmlFor={label} className="relative cursor-pointer font-semibold text-blue-600 hover:text-blue-500 mt-4 block">
            <span>{file ? ` ${file.name}` : "Pilih file"}</span>
            <input
              id={label}
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
