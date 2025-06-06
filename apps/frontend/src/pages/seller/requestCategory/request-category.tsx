import { addProductRoute } from "@/api/api";
import { Toaster } from "@/components/ui/toaster";
import { useSession } from "@/context/session-context";
import { toast } from "@/hooks/use-toast";
import {
  ChevronRight,
  Edit3,
  FileText,
  HelpCircle,
  PackagePlus,
  Tag,
} from "lucide-react";
import React, { useState } from "react";

const RequestCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [reason, setReason] = useState("");
  const [estimatedProducts, setEstimatedProducts] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [brandExamples, setBrandExamples] = useState("");
  const { user } = useSession();

  const HandleRequestCategory = async () => {
    const payLoad: { [key: string]: any } = {
      id: user?.id,
      categoryName,
      reason,
      estimatedProducts,
      additionalNotes,
    };
    if (brandExamples) {
      payLoad.brandExamples = brandExamples;
    }

    try {
      const response = await addProductRoute.post("/requestCategory", payLoad);
      console.log("API Response:", response);
      if (response && (response.status === 200 || response.status === 201)) {
        toast({
          title: "🎉 Request Submitted!",
          description:
            "Your category suggestion is on its way. We'll review it and get back to you within 24 hours.",
          variant: "default",
        });
        setCategoryName("");
        setReason("");
        setEstimatedProducts("");
        setAdditionalNotes("");
        setBrandExamples("");
      } else {
        console.error(
          "Submission failed with status:",
          response?.status,
          response?.data
        );
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. Please review your input and try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        variant: "destructive",
        title: "Network Error",
        description:
          "Could not submit your request. Please check your connection and try again.",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!categoryName || !reason || !estimatedProducts) {
      console.warn("Required fields are missing");
      return;
    }
    HandleRequestCategory();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-stone-200 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center pt-28 pb-28">
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-8 md:p-12 space-y-8">
          <header className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
              Request for a New Category
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Help us expand our offerings by suggesting a new product category.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="categoryName"
                className="flex items-center text-sm font-semibold text-slate-700 mb-2"
              >
                <Tag className="w-5 h-5 mr-2 text-indigo-500" />
                Category Name
              </label>
              <input
                type="text"
                name="categoryName"
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 transition-all duration-150 ease-in-out hover:border-indigo-500"
                placeholder="e.g., Eco-friendly Pet Toys"
              />
            </div>

            <div>
              <label
                htmlFor="reason"
                className="flex items-center text-sm font-semibold text-slate-700 mb-2"
              >
                <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                Reason/Explanation
              </label>
              <textarea
                name="reason"
                id="reason"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 transition-all duration-150 ease-in-out hover:border-indigo-500"
                placeholder="Describe the types of products that will be listed in this category and why it's needed."
              />
              <p className="mt-2 text-xs text-slate-500 flex items-center">
                <HelpCircle className="w-4 h-4 mr-1.5 text-slate-400" />
                Please be as detailed as possible.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="estimatedProducts"
                  className="flex items-center text-sm font-semibold text-slate-700 mb-2"
                >
                  <PackagePlus className="w-5 h-5 mr-2 text-indigo-500" />
                  Estimated Number of Products
                </label>
                <input
                  type="number"
                  name="estimatedProducts"
                  id="estimatedProducts"
                  value={estimatedProducts}
                  onChange={(e) => setEstimatedProducts(e.target.value)}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 transition-all duration-150 ease-in-out hover:border-indigo-500"
                  placeholder="e.g., 50"
                />
              </div>
              <div>
                <label
                  htmlFor="brandExamples"
                  className="flex items-center text-sm font-semibold text-slate-700 mb-2"
                >
                  <HelpCircle className="w-5 h-5 mr-2 text-indigo-500" />
                  Example Brands/Products (Optional)
                </label>
                <input
                  type="text"
                  name="brandExamples"
                  id="brandExamples"
                  value={brandExamples}
                  onChange={(e) => setBrandExamples(e.target.value)}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 transition-all duration-150 ease-in-out hover:border-indigo-500"
                  placeholder="e.g., BrandX, ProductY"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="additionalNotes"
                className="flex items-center text-sm font-semibold text-slate-700 mb-2"
              >
                <Edit3 className="w-5 h-5 mr-2 text-indigo-500" />
                Additional Notes (Optional)
              </label>
              <textarea
                name="additionalNotes"
                id="additionalNotes"
                rows={3}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 transition-all duration-150 ease-in-out hover:border-indigo-500"
                placeholder="Any other relevant information or special considerations."
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center rounded-lg bg-indigo-500 px-6 py-3.5 text-base font-semibold leading-7 text-white shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 ease-in-out group"
              >
                Submit Request
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-150 ease-in-out" />
              </button>
            </div>
          </form>

          <footer className="text-center mt-12 border-t border-slate-200 pt-8">
            <p className="text-sm text-slate-500">
              Once submitted, your category request will be reviewed by our
              team.
            </p>
            <p className="text-sm text-slate-500 mt-1">
              You will be notified of the decision via email.
            </p>
          </footer>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default RequestCategory;
