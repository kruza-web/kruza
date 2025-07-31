"use client"

import { SignIn } from "./sign-in"
import { SignOut } from "./sign-out"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User2 } from "lucide-react"
import { GoProfile } from "./goProfile"
import type { Session } from "next-auth"

interface ClientUserProps {
  session: Session | null
  sessionName: string | null | undefined
  sessionEmail: string | null | undefined
  userId: number | undefined
}

export function ClientUser({ session, sessionName, sessionEmail, userId }: ClientUserProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-500/10">
          <User2 className="size-5"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col justify-center items-center border-1 border-gray-500/30 bg-white">
        {sessionName && <DropdownMenuLabel>{sessionName}</DropdownMenuLabel>}

        {!session?.user ? (
          <>
            <SignIn />
          </>
        ) : (
          <>
            {userId && <GoProfile id={userId} />}
            <SignOut />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
