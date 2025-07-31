import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CircleHelp } from "lucide-react";

export const FrequentQuestions = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="xl:text-lg text-black">
          ¿Cómo puedo realizar una compra?
        </AccordionTrigger>
        <AccordionContent className="xl:text-base text-black">
          Para comprar en nuestra tienda online, primero debés iniciar sesión o
          crear una cuenta. Una vez logueado, podés agregar los productos al
          carrito y finalizar tu compra a través de Mercado Pago.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="xl:text-lg text-black">
          ¿Cuáles son los métodos de pago disponibles?
        </AccordionTrigger>
        <AccordionContent className="xl:text-base text-black">
          Aceptamos todos los métodos de pago habilitados por Mercado Pago:
          tarjetas de crédito, débito, transferencia bancaria, dinero en cuenta
          de Mercado Pago y pago en efectivo en puntos habilitados como Rapipago
          o Pago Fácil.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="xl:text-lg text-black">
          ¿Cómo funcionan los envíos?
        </AccordionTrigger>
        <AccordionContent className="xl:text-base text-black">
          Ofrecemos dos modalidades. Envío a domicilio: tiene un costo de
          $10.000 a cualquier parte de Argentina. Si tu compra supera los
          $80.000, el envío es gratuito. Retiro en depósito: podés retirar tu
          pedido sin costo desde nuestro depósito en San Telmo.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger className="xl:text-lg text-black">
          ¿Hacen envíos? ¿Cuánto cuesta?
        </AccordionTrigger>
        <AccordionContent className="xl:text-base text-black">
          Sí, realizamos envíos a todo el país. El costo del envío es de $10.000
          y se suma al total al finalizar la compra. También podés retirar tu
          pedido sin cargo por nuestro local, seleccionando la opción
          correspondiente al momento del pago.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger className="xl:text-lg text-black">
          ¿Cómo puedo consultar el estado de mi envío?
        </AccordionTrigger>
        <AccordionContent className="xl:text-base text-black">
          Podés seguir el estado de tu pedido desde tu perfil en nuestra web.
          Además, te enviaremos un correo electrónico con la información de
          seguimiento una vez que el pedido haya sido despachado.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-6">
        <AccordionTrigger className="xl:text-lg text-black">
          ¿Puedo devolver o cambiar un producto?
        </AccordionTrigger>
        <AccordionContent className="xl:text-base text-black">
          Sí, aceptamos devoluciones o cambios dentro de los 7 días hábiles
          posteriores a la recepción del pedido, siempre que el producto esté en
          perfectas condiciones y sin uso. Para iniciar una devolución,
          escribinos a somoskruza@gmail.com.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export function FaqModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-500/10">
          <CircleHelp className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-dvh max-w-[420px] overflow-auto md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Preguntas Frecuentes</DialogTitle>
          <DialogDescription asChild>
            <FrequentQuestions />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Entendido</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
