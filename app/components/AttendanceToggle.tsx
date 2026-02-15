"use client";

import { useEffect } from "react";

export default function AttendanceToggle() {
  useEffect(() => {
    const btn = document.getElementById("selectAllBtn");
    if (!btn) return;

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      const checkboxes = document.querySelectorAll(
        ".attendance-checkbox"
      ) as NodeListOf<HTMLInputElement>;
      
      const anyUnchecked = Array.from(checkboxes).some((c) => !c.checked);

      checkboxes.forEach((c) => {
        c.checked = anyUnchecked;
        
        c.dispatchEvent(new Event("change", { bubbles: true }));
      });

      btn.innerText = anyUnchecked ? "Unselect All" : "Toggle All Present";
    };

    btn.addEventListener("click", handleClick as any);
    return () => btn.removeEventListener("click", handleClick as any);
  }, []);

  return null; // This component just handles the logic
}