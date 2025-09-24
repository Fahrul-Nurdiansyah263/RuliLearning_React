export default function SubmitButton({ label, loadingLabel, isLoading }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="
        flex items-center justify-center
        w-full sm:w-auto
        py-3 sm:py-2.5 
        px-6 sm:px-8 
        text-base sm:text-sm
        font-medium rounded-md shadow-sm 
        text-white 
        bg-blue-600 hover:bg-blue-700
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
      "
    >
      {isLoading ? loadingLabel : label}
    </button>
  );
}
