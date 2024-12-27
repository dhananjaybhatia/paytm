export default function Balance() {
  const token = localStorage.getItem("token");

  return (
    <div className="w-full font-bold text-lg py-10 px-6">
      {token ? "Your Balance: $5000" : "Your Balance: $"}
    </div>
  );
}
