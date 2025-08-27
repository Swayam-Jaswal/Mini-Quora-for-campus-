import React from "react";

export default function TimeAgo({ date }) {
  if (!date) return <span>just now</span>;

  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);

  let text;
  if(seconds < 10) text = `just now`;
  else if (seconds < 60) text = `${seconds}s ago`;
  else if (seconds < 3600) text = `${Math.floor(seconds / 60)}m ago`;
  else if (seconds < 86400) text = `${Math.floor(seconds / 3600)}h ago`;
  else if (seconds < 604800) text = `${Math.floor(seconds / 86400)}d ago`;
  else text = d.toLocaleDateString();

  return <span>{text}</span>;
}