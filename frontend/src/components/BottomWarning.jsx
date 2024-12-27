/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export default function BottomWarning({ label, buttonText, to }) {
  return (
    <div className="flex justify-center p-4 gap-4">
      <div>{label}</div>
      <Link
        className="cursor-pointer underline text-blue-600 hover:text-blue-800"
        to={to}
      >
        {buttonText}
      </Link>
    </div>
  );
}
