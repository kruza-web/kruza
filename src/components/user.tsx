import { getUser } from "@/_actions/actions";
import { SignIn } from "./sign-in";
import { SignOut } from "./sign-out";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User2 } from "lucide-react";
import { GoProfile } from "./goProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth"


export async function User(){
  const session = await getServerSession(authOptions);
  const name = session?.user?.name;
  const email = session?.user?.email;

  const user = await getUser();
  const id = user?.id;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-500/10">
          <User2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col justify-center items-center border-1 border-gray-500/30 bg-transparent">
        {name && <DropdownMenuLabel>{name}</DropdownMenuLabel>}

        {!session?.user ? (
          <>
            <SignIn />
          </>
        ) : (
          <>
            {id && <GoProfile id={id}/>}
            <SignOut />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
