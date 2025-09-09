import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { statusSchema, type SelectUserToProduct } from "@/db/schema";
import { changeStatus } from "@/_actions/actions";

export const ChangeStatus = ({
  status,
  id,
}: {
  status: SelectUserToProduct["status"];
  id: SelectUserToProduct["id"];
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Ellipsis />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={status}
          onValueChange={(value) => {
            const status = statusSchema.parse(value);
            changeStatus({ status, id });
          }}
        >
          <DropdownMenuRadioItem value="Pendiente">Pendiente</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Enviado">
            Enviado
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Entregado">
            Entregado
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
