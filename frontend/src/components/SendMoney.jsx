/* eslint-disable react/prop-types */
import { useState } from "react";
import InputBox from "./InputBox";
import Button from "./Button";

export default function SendMoney({ onClose, fullName, initials }) {
  const [amount, setAmount] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);
  const [error, setError] = useState(""); // Error state for validation feedback

  const handleTransfer = () => {
    // Validate the amount
    if (!amount || isNaN(amount) || amount <= 0) {
      setError("⚠️ Please enter a valid amount greater than 0");
      return;
    }

    setError(""); // Clear any previous error
    setIsTransferring(true);

    // Simulate transfer animation
    setTimeout(() => {
      setIsTransferring(false);
      setTransferComplete(true);
    }, 5000); // 5 seconds animation
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          💸 Send Money
        </h2>

        {/* Recipient Details */}
        {!isTransferring && !transferComplete && (
          <>
            <div className="flex items-center gap-4 mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-center bg-green-600 text-white rounded-full w-12 h-12 text-lg font-semibold">
                {initials}
              </div>
              <div>
                <div className="text-sm text-gray-500">Recipient</div>
                <div className="font-semibold text-lg text-gray-800">
                  {fullName}
                </div>
              </div>
            </div>

            {/* Input Box for Amount */}
            <div className="mb-4">
              <label className="text-gray-600 text-sm mb-1 block">Amount</label>
              <InputBox
                type="number"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  setAmount(value);

                  // Clear the error if the input is valid
                  if (value && !isNaN(value) && value > 0) {
                    setError("");
                  }
                }}
                placeholder="Enter Amount"
                className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                onClick={onClose}
                label={"Cancel"}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              />
              <Button
                label={isTransferring ? "Transferring..." : "Transfer"}
                onClick={handleTransfer}
                disabled={isTransferring}
                className={`${
                  isTransferring
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white px-4 py-2 rounded-lg`}
              />
            </div>
          </>
        )}

        {/* Animation State */}
        {isTransferring && (
          <>
            <div className="flex flex-col items-center">
              <div className="flex gap-8 items-center justify-center">
                {/* Wallet 1 */}
                <div className="wallet bg-gray-200 p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center w-36 h-20 overflow-hidden">
                  <span className="text-xl">🏦</span>
                  <span className="truncate text-sm font-medium">
                    My wallet
                  </span>
                </div>

                {/* Animation */}
                <div className="relative">
                  <div className="money-flow animate-bounce">💵</div>
                </div>

                {/* Wallet 2 */}
                <div className="wallet bg-gray-200 p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center w-36 h-20 overflow-hidden">
                  <span className="text-xl">🏦</span>
                  <span className="truncate text-sm font-medium">{`${fullName}'s wallet`}</span>
                </div>
              </div>
              <p className="mt-4 text-gray-600">Transferring money...</p>
            </div>
          </>
        )}

        {/* Success State */}
        {transferComplete && (
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold text-green-600 mb-4">
              Transfer Successful!
            </h3>
            <Button
              onClick={onClose}
              label={"Close"}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
