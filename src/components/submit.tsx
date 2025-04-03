"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./ui/button";
import { FC } from "react";

export const Submit: FC<ButtonProps & { text?: string }> = ({
  text = "Enviar",
  ...props
}) => {
  const { pending } = useFormStatus();
  return (
    <Button className="justify-self-end" disabled={pending} {...props}>
      {pending ? "Cargando..." : text}
    </Button>
  );
};
