import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">ProShop</h2>
            <p className="text-gray-400">
              Your one-stop shop for all things tech.
            </p>
          </div>
          <nav className="mb-8 md:mb-0">
            <ul className="flex flex-wrap justify-center md:justify-end space-x-6">
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition duration-300 border-b-2 border-transparent hover:border-white pb-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition duration-300 border-b-2 border-transparent hover:border-white pb-1"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-white transition duration-300 border-b-2 border-transparent hover:border-white pb-1"
                >
                  Shipping
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex space-x-6">
            <a
              href="#"
              className="hover:text-white transition duration-300 transform hover:scale-110"
            >
              <Facebook size={24} />
            </a>
            <a
              href="#"
              className="hover:text-white transition duration-300 transform hover:scale-110"
            >
              <Twitter size={24} />
            </a>
            <a
              href="#"
              className="hover:text-white transition duration-300 transform hover:scale-110"
            >
              <Instagram size={24} />
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} ProShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
