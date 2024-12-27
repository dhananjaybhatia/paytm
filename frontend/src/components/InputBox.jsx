/* eslint-disable react/prop-types */
export default function InputBox({ label, placeholder, onChange, value, type }) {
  return (
    <>
      <div className="font-medium text-left mt-2">{label}</div>
      <input
        className="w-full mt-2 p-2 border-2 border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        placeholder={placeholder}
        type={type}
        onChange={onChange}
        value={value}
      ></input>
    </>
  );
}
