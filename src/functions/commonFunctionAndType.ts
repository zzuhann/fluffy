import React from "react";

export type imgType = { file: File | string | null; url: string };

export const imgInitialState: imgType = {
  file: "",
  url: "",
};

export function numberInputPreventSymbol(
  e: React.KeyboardEvent<HTMLInputElement>
) {
  if (e.key === "." || e.key === "e" || e.key === "+" || e.key === "-") {
    e.preventDefault();
  }
}
