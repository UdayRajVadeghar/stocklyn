import { Lens } from "@/components/magicui/lens";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSession } from "@/context/session-context";
import { useToast } from "@/hooks/use-toast";
import { ProductsType } from "@/types/product-type";
import { FetchSimilarProducts } from "@/utils/functions";
import { useCartStore } from "@/utils/store/cart-store";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { AddCartItems, RemoveCartItem } = useCartStore.getState();

const fadeIn = {
  // hidden: { opacity: 0, y: 20 },
  // visible: {
  //   opacity: 1,
  //   y: 0,
  //   transition: { duration: 0.1, ease: "easeOut" },
  // },
};
// console.log(cartItems);

const ProductPage = () => {
  const { cartItems } = useCartStore();
  const { toast } = useToast();
  const location = useLocation();
  const product: ProductsType = location.state || {};
  const [selectedImage, setSelectedImage] = useState<string>(
    product.imageUrl ? product.imageUrl[0] : "/placeholder.png"
  );
  const { user } = useSession();
  const { products } = useCartStore();
  const navigate = useNavigate();
  const [hoveredAccordionItem, setHoveredAccordionItem] = useState<
    string | null
  >(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState(false);

  // console.log(product);

  const HandleAddToCart = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "Please login to add to cart",
      });
      navigate("/login");
      return;
    }

    const isAddedToCart = await AddCartItems(
      user?.cart.id,
      product.id,
      product.price
    );

    if (isAddedToCart == false) {
      // toast({
      //   variant: "destructive",
      //   title: "Product already exists!",
      //   description: "Add more quantity during checkout!",
      //   duration: 3000,
      // });
    }

    if (isAddedToCart == true) {
      toast({
        variant: "default",
        title: "Added product!",
        description: "Product successfully added to the cart!",
        duration: 1500,
      });
    }
  };

  const RouteToProductPage = (product: ProductsType) => {
    navigate(`/product/${product.id}`, { state: product });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["similarProducts", product.id],
    queryFn: () => FetchSimilarProducts(product),
    staleTime: 3 * 60 * 1000,
  });

  return (
    <motion.div
      className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-12 md:py-20 mt-28 w-[90%] mx-auto font-montserrat"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg">
            <Lens zoomFactor={1.5} lensSize={170} isStatic={false}>
              <img
                src={selectedImage}
                alt={product.name || "Product"}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </Lens>
          </div>
          <div className="flex gap-2 md:gap-4 overflow-x-auto py-2 scrollbar-hide">
            {product.imageUrl?.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all ${
                  selectedImage === image
                    ? "border-slate-500 scale-105"
                    : "border-transparent hover:border-slate-300"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <motion.div className="space-y-6" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">
              {product.name || "Product"}
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-slate-800 mt-2">
              ₹{product.price?.toLocaleString() || "0"}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center">
            <span className="text-gray-700">Availability: </span>
            <span
              className={`ml-2 font-semibold ${
                product.stockQuantity > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-gray-700 leading-relaxed">
              {product.productDescription || "No description available."}
            </p>
          </motion.div>

          {product.colors?.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-2">
              <span className="font-medium text-gray-700">Colors:</span>
              <div className="flex flex-wrap gap-2">
                {product.colors?.map((color: string) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-slate-400 transition-colors"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {product.sizes?.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-2">
              <span className="font-medium text-gray-700">Sizes:</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors 
            ${
              selectedSize === size
                ? "bg-slate-700 text-white border-slate-700"
                : "hover:bg-slate-100 hover:border-slate-400 border-gray-200"
            }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="space-y-3 relative">
            <div className="min-h-[200px]">
              {" "}
              {product.highlights
                ?.slice(0, 5)
                .map((highlight: string, index: number) => (
                  <div
                    key={index}
                    onMouseEnter={() =>
                      setHoveredAccordionItem(`item-${index}`)
                    }
                    onMouseLeave={() => setHoveredAccordionItem(null)}
                  >
                    <Accordion
                      type="single"
                      collapsible
                      value={
                        hoveredAccordionItem === `item-${index}`
                          ? `item-${index}`
                          : undefined
                      }
                    >
                      <AccordionItem value={`item-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <span className="font-medium text-gray-800">
                            Feature {index + 1}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {highlight}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
            </div>
          </div>

          <motion.div variants={itemVariants}>
            <Sheet modal={false}>
              <SheetTrigger asChild>
                {product.stockQuantity > 0 ? (
                  <Button
                    className="w-full py-6 bg-white hover:bg-gray-100 text-slate-700 border border-slate-300 text-lg  transition-transform"
                    onClick={() => HandleAddToCart()}
                  >
                    Add to Cart
                  </Button>
                ) : (
                  <Button
                    className="w-full py-6 text-lg bg-gray-400 hover:bg-gray-500"
                    disabled
                  >
                    Out of Stock
                  </Button>
                )}
              </SheetTrigger>

              <SheetContent className="w-full sm:max-w-md bg-white shadow-lg ">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-xl">
                    Your Shopping Cart
                  </SheetTitle>
                  <SheetDescription>
                    {products.length} item{products.length !== 1 ? "s" : ""} in
                    your cart
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  {products.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Your cart is empty
                    </div>
                  ) : (
                    products.map((product) => (
                      <motion.div
                        key={product.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                        whileHover={{ scale: 1.01 }}
                        onClick={() => RouteToProductPage(product)}
                      >
                        <img
                          src={product.displayImage}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-md object-cover"
                          alt={product.name}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 truncate">
                            {product.name}
                          </h3>
                          <p className="flex gap-2 text-gray-500">
                            <p>Qty </p>
                            {cartItems.find(
                              (item) => item.productId === product.id
                            )?.quantity || 1}{" "}
                          </p>

                          <p className="text-slate-700 font-medium">
                            ₹{product.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          className="text-red-500 hover:text-red-700 p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            RemoveCartItem(user?.cart.id, product.id);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>

                <SheetFooter className="mt-6">
                  <SheetClose asChild>
                    <Button
                      className="w-full py-6 text-lg font-montserrat bg-indigo-600 text-white hover:bg-indigo-700"
                      disabled={products.length === 0}
                      onClick={() => navigate("/cartitems")}
                    >
                      Proceed to Checkout
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </motion.div>
        </motion.div>
      </div>
      <div className="mt-16 pt-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-8">
          Users Also Purchase
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {data?.similarProducts.map((product: any, index: number) => (
              <div
                key={index}
                className="group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                onClick={() => RouteToProductPage(product)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.displayImage}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={product.name}
                  />
                </div>
                <div className="p-2 space-y-0.5">
                  <h3 className="font-medium text-gray-800 truncate text-xs">
                    {product.name}
                  </h3>
                  <p className="text-slate-700 font-semibold text-xs">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-16 pt-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-8">
          Products you might also like
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {data?.randomProducts.map((product: any, index: number) => (
              <div
                key={index}
                className="group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                onClick={() => RouteToProductPage(product)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.displayImage}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={product.name}
                  />
                </div>
                <div className="p-2 space-y-0.5">
                  <h3 className="font-medium text-gray-800 truncate text-xs">
                    {product.name}
                  </h3>
                  <p className="text-slate-700 font-semibold text-xs">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <motion.section
        className="mt-16 md:mt-24 pt-8 border-t border-gray-200"
        variants={fadeIn}
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-8">
          Customer Reviews
        </h2>
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-500">No reviews yet</p>
          <Button
            variant="outline"
            onClick={() => setDisplayText(true)}
            className="mt-4 border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-700"
          >
            Be the first to review
          </Button>
          {displayText && <p>Coming soon</p>}
        </div>
      </motion.section>
    </motion.div>
  );
};

const containerVariants = {};

const itemVariants = {};

export default ProductPage;
