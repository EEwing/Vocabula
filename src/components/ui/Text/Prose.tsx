import React from "react";

export type ProseProps = React.HTMLAttributes<HTMLDivElement>

export function Prose({ className = "", ...rest }: ProseProps) {
  return (
    <div
      className={`prose prose-lg dark:prose-invert prose-p:flex prose-li:my-0 prose-p:my-1 prose-ul:my-0 leading-snug prose-p:p-1 ${className}`.trim()}
      {...rest}
    />
  );
} 