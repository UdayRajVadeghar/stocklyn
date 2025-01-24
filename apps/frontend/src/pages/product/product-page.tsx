import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

const ProductPage = () => {
  const location = useLocation();
  const product = location.state || {};
  const [selectedImage, setSelectedImage] = useState<string>(
    product.imageUrl ? product.imageUrl[0] : "/placeholder.png"
  );

  return (
    <div className="bg-white p-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-20">
        {/* Left Section: Product Images */}
        <div>
          <img
            src={selectedImage}
            alt={product.name || "Product"}
            className="w-full h-auto rounded-md object-cover"
          />
          <div className="flex mt-4 space-x-4">
            {product.imageUrl?.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setSelectedImage(image)}
                className={`w-16 h-16 rounded-md object-cover cursor-pointer ${
                  selectedImage === image ? "ring-2 ring-indigo-500" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Section: Product Details */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {product.name || "Product Name"}
          </h1>
          <p className="text-lg font-semibold text-gray-700">
            Price: ₹{product.price || "0"}
          </p>
          <div className="flex items-center">
            <span className="text-gray-700">Stock: </span>
            <span
              className={`ml-2 font-semibold ${
                product.stockQuantity > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <p className="text-gray-700">
            <span className="font-semibold">About the Product : </span>{" "}
            {product.productDescription || "No description available."}
          </p>
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-700">Available Color:</span>
            {product.colors?.map((color: string) => (
              <div
                key={color}
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: `${color}` }}
              ></div>
            ))}
          </div>
          <div className="flex items-center space-x-4 ">
            <span className="font-medium text-gray-700">Available Sizes:</span>
            {product.sizes?.map((size: string) => (
              <div
                key={size}
                className="border rounded-full p-1 w-7 h-7 flex items-center justify-center text-sm font-semibold hover:cursor-pointer"
              >
                {" "}
                {size}
              </div>
            ))}
          </div>
          {product.highlights.map((highlight: string, index: number) => {
            if (index > 4) {
              return;
            }
            return (
              <Accordion type="single" collapsible key={index}>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Feature {index + 1}</AccordionTrigger>
                  <AccordionContent>{highlight}</AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
          <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-500">
            Add to cart
          </Button>
        </div>
      </div>
      <div className="pt-20 text-3xl underline">Comments</div>
    </div>
  );
};

export default ProductPage;
