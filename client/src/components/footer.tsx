import { BookOpen, Facebook, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 islamic-gradient rounded-lg flex items-center justify-center">
                <BookOpen className="text-white w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Hadith 360
              </h3>
            </div>
            <p className="text-slate-300 mb-4 max-w-md">
              Every Hadith. Every Language. Every Reference. Access the most comprehensive
              collection of authenticated Hadith literature with accurate translations and references.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" data-testid="social-linkedin" className="text-slate-400 hover:text-islamic-teal">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="social-facebook" className="text-slate-400 hover:text-islamic-teal">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="social-instagram" className="text-slate-400 hover:text-islamic-teal">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">
              Collections
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a
                  href="#"
                  className="hover:text-islamic-teal transition-colors"
                  data-testid="footer-bukhari"
                >
                  Sahih al-Bukhari
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-islamic-teal transition-colors"
                  data-testid="footer-muslim"
                >
                  Sahih Muslim
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-islamic-teal transition-colors"
                  data-testid="footer-abudawud"
                >
                  Sunan Abu Dawood
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-islamic-teal transition-colors"
                  data-testid="footer-tirmidhi"
                >
                  Jami` at-Tirmidhi
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a
                  href="#"
                  className="hover:text-islamic-teal transition-colors"
                  data-testid="footer-about"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-islamic-teal transition-colors"
                  data-testid="footer-help"
                >
                  Help
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-islamic-teal transition-colors"
                  data-testid="footer-contact"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-islamic-teal transition-colors"
                  data-testid="footer-privacy"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>
            &copy; 2025 Hadith 360. All rights reserved. Developed BY ALI YASIR with precision and care for the Muslim community.
          </p>
        </div>
      </div>
    </footer>
  );
}
