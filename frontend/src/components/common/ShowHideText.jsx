import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ShowHideText({ text, hiddenPlaceholder = "******" }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex items-center gap-1 font-mono">
      <span className="tracking-widest">
        {visible ? text : hiddenPlaceholder}
      </span>

      <button
        onClick={() => setVisible(!visible)}
        className="text-gray-400 hover:text-white transition"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
