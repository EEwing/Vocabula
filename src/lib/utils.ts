import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import DOMPurify from "isomorphic-dompurify";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function sanitizeUserInput(description: string) {
    return DOMPurify.sanitize(description).replace(/<p><\/p>/g, "<p>&nbsp;</p>");
}
