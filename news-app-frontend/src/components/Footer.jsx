import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      className={`transition-all duration-700 ease-in-out ${
        showFooter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } bg-gradient-to-r from-blue-600 to-indigo-700 text-white mt-10`}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h2 className="text-xl font-bold mb-3">NewsApp</h2>
          <p className="text-gray-200 text-m mb-4">
            Stay updated with the latest and most reliable news articles. A
            modern news portal built with MERN stack.And developed by{" "}
            <b>VISHNU VIJAYAN</b>.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://linkedin.com/in/vishnu-vijayan03"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-yellow-300 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-yellow-300 transition">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-bold mb-3">Contact Us</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@newsapp.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +91 00000 00000
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Kerala, India
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-800 py-3 text-center text-sm text-gray-200">
        © {new Date().getFullYear()} NewsApp. All rights reserved.
      </div>
    </footer>
  );
}
