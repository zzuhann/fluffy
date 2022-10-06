import React from "react";

export type imgType = { file: File | string; url: string };

export function numberInputPreventSymbol(
  e: React.KeyboardEvent<HTMLInputElement>
) {
  if (e.key === "." || e.key === "e" || e.key === "+" || e.key === "-") {
    e.preventDefault();
  }
}
