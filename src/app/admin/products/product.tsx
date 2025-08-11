"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CldImage } from "next-cloudinary"
import { currency } from "@/lib/utils"
import type { SelectProduct } from "@/db/schema"
import { DeleteProduct } from "./delete-product"
import { EditProduct } from "./edit-product"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"
import Link from "next/link"

export const Product = ({
  id,
  description,
  img,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  price,
  title,
  size,
  discount,
  isRecommended,
  category,
}: SelectProduct) => {
  return (
    <Card className="w-full max-w-sm overflow-hidden" key={id}>
      <div className="relative aspect-video w-full bg-gray-100 flex items-center justify-center">
        <CldImage key={id} alt={title} className="object-contain" src={img} fill />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <p>{currency.format(price)}</p>
        <p className="text-sm ">{size}</p>
      </CardHeader>
      <CardContent>
        {isRecommended ? <div className="mb-2">Recomendado </div> : <div className="mb-2">No Recomendado </div>}
        <div className="items flex justify-end space-x-4">
          <Link href={`/admin/products/${id}/stock`}>
            <Button variant="outline" size="icon" title="Gestionar Stock">
              <Package className="h-4 w-4" />
            </Button>
          </Link>
          <EditProduct
            id={id}
            title={title}
            description={description}
            price={price}
            img={img}
            img2={img2}
            img3={img3}
            img4={img4}
            img5={img5}
            img6={img6}
            img7={img7}
            img8={img8}
            img9={img9}
            img10={img10}
            size={size}
            discount={discount}
            isRecommended={isRecommended}
            category={category}
          />
          <DeleteProduct id={id} img={img} img2={img2} img3={img3} img4={img4} img5={img5} img6={img6} img7={img7} img8={img8} img9={img9} img10={img10}/>
        </div>
      </CardContent>
    </Card>
  )
}
