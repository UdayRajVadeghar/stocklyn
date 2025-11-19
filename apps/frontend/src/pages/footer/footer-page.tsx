import { Github, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FooterPage = () => {
  const navigate = useNavigate();

  const openGithub = () => {
    window.open("https://github.com/", "_blank");
  };

  const openLinkedIn = () => {
    window.open("https://www.linkedin.com/in//", "_blank");
  };

  return (
    <footer className="bg-white text-gray-600 pt-12 pb-6 px-4 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-12">
          {/* About Us */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              About Trazor
            </h2>
            <p className="text-gray-600 mb-4 max-w-lg">
              We are a leading e-commerce platform dedicated to offering premium
              products and delivering exceptional customer experiences,
              seamlessly connecting customers with the quality they deserve.
            </p>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={openGithub}
                className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={openLinkedIn}
                className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Quick Links
            </h2>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/home" },
                { name: "Shop", path: "/shop" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Cart", path: "/cartitems" },
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                  >
                    <svg
                      className="w-3 h-3 mr-2 text-gray-400"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M4 1l5 5-5 5" strokeWidth="2" />
                    </svg>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Customer Service
            </h2>
            <ul className="space-y-3">
              {[
                { name: "Shipping Policy", path: "/policy" },
                { name: "Return Policy", path: "/policy" },
                { name: "Privacy Policy", path: "/policy" },
                { name: "Terms & Conditions", path: "/policy" },
                { name: "Track Order", path: "/policy" },
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                  >
                    <svg
                      className="w-3 h-3 mr-2 text-gray-400"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M4 1l5 5-5 5" strokeWidth="2" />
                    </svg>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-gray-200 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div className="mb-4 md:mb-0">
            © 2025 Trazor. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gray-700 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-700 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-700 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;
