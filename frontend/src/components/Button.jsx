/* eslint-disable react/prop-types */
export default function Button({ label, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-blue-700 text-white rounded-md mt-4 p-2 text-lg font-medium hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 shadow-md w-full ${className}`}
    >
      {label}
    </button>
  );
}
