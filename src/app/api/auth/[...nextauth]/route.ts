import NextAuth from "next-auth";
import { authOptions } from "../../../../../auth"; // Importa las opciones de configuración de NextAuth

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };