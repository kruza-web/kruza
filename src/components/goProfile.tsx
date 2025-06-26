"use client";
import Link from "next/link";
import { Button } from "./ui/button";

export const GoProfile = ({id}: {id: number}) => {

  return (
    <Link href={`/profile/${id}`}>
      <Button type="submit" variant={"ghost"}  className="w-full my-2 hover:bg-gray-500/10">
        Ir a tu perfil
      </Button>
    </Link>
  );
};
