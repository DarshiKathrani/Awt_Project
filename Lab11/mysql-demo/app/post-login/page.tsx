'use client';

import { useEffect } from "react";

export default function PostLogin() {

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      window.location.href = "/";
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role;

    if (role === "admin") {
      window.location.href = "/admin";
      return;
    }

    if (role === "staff") {
      window.location.href = "/dashboard";
      return;
    }

    if (role === "meeting_convener") {
      window.location.href = "/convener-dashboard";
      return;
    }

    window.location.href = "/not-authorized";
  }, []);

  return <p>Logging you in...</p>;
}