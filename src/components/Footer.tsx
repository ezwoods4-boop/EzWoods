"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-furniture-charcoal text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-playfair text-2xl font-bold mb-4">Luxe Home</h3>
            <p className="text-gray-300 mb-4 font-inter">
              Premium furniture for modern living. Quality craftsmanship meets contemporary design.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-furniture-sage transition-colors" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-furniture-sage transition-colors" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-furniture-sage transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-inter font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 font-inter">
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-white transition-colors">Shop All</Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">Categories</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-inter font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 font-inter">
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping Info</Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors">Returns</Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white transition-colors">Support</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-inter font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 font-inter">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-furniture-sage" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-furniture-sage" />
                <span className="text-gray-300">hello@luxehome.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-furniture-sage mt-1" />
                <span className="text-gray-300">
                  123 Furniture St.<br />
                  Design City, DC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 font-inter">
            © 2024 Luxe Home. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
