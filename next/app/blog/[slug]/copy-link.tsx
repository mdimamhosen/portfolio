"use client";

import { useState } from "react";

export default function CopyLink() {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" className="underline" onClick={() => navigator.clipboard.writeText(location.href).then(() => setCopied(true))}>
      {copied ? "Link copied" : "Copy link"}
    </button>
  );
}
