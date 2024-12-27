/* eslint-disable react/prop-types */
import AppBar from "./AppBar";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col ">
      {/* AppBar for Navigation */}
      <AppBar />

      {/* Main Content */}
      <main className="px-6 py-4">{children}</main>

      {/* Fixed Footer */}
      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600 fixed bottom-0 left-0 w-full shadow-md">
        © {new Date().getFullYear()} PayTM. All rights reserved.
      </footer>
    </div>
  );
}
