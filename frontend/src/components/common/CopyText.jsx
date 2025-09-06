import { Copy } from "lucide-react";
import { toast } from "react-toastify";

export default function CopyText({ text }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <button
      onClick={handleCopy}
      className="text-gray-400 hover:text-white transition"
    >
      <Copy size={18} />
    </button>
  );
}
