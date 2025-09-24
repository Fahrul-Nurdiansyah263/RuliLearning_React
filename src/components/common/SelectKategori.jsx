export default function SelectKategori({ value, onChange, options }) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">Kategori</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-700 shadow-sm"
      >
        <option value="" disabled>-- Pilih Kategori --</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>{opt.judul}</option>
        ))}
      </select>
    </div>
  );
}
