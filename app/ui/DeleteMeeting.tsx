"use client";
import React from "react";
import { DeleteMeetingAction } from "../actions/DeleteMeetingAction";

function DeleteButton({ id }: { id: number }) {
  return (
    <button
      onClick={() => {
        DeleteMeetingAction(id);
      }}
      className="
        px-3 py-1.5
        bg-red-600 text-white
        text-sm font-medium
        rounded-md
        hover:bg-red-700
        transition
        focus:outline-none focus:ring-2 focus:ring-red-400
      "
    >
      Delete
    </button>
  );
}

export default DeleteButton;
