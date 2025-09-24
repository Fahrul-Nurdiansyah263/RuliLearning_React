export default function InputField({
  label,
  id,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label htmlFor="judul" className="block text-gray-700 font-semibold mb-2">
        {label}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
}
