import React from "react";

interface ITitleProps {
  content: string;
}

export const Title = ({ content }: ITitleProps) => {
  return <h2 className="font-semibold text-2xl mb-3">{content}</h2>;
};
