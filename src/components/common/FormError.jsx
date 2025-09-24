export default function FormError({ message }) {
  if (!message) return null;
  return (
    <div className="bg-red-100 text-red-700 p-4 rounded-lg font-medium">
      {message}
    </div>
  );
}
