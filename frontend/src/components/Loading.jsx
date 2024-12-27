/* eslint-disable react/prop-types */

export default function Loading({ message }) {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}



