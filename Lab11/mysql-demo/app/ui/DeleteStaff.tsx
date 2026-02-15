"use client";
import React from "react";
import { DeleteStaffAction } from "../actions/DeleteStaffAction";

function DeleteStaff({ id }: { id: number }) {
  return (
    <button
      onClick={() => {
        DeleteStaffAction(id);
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

export default DeleteStaff;