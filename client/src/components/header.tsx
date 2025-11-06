import { BookOpen, Menu, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import FontSizeControls from "@/components/font-size-controls";

interface HeaderProps {
  onOpenPreferences: () => void;
}

export default function Header({ onOpenPreferences }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 islamic-gradient rounded-lg flex items-center justify-center">
                <BookOpen className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Hadith 360
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              <a
                href="#"
                className="text-slate-600 dark:text-slate-300 hover:text-islamic-teal transition-colors"
                data-testid="nav-home"
              >
                Home
              </a>
              <a
                href="#"
                className="text-slate-600 dark:text-slate-300 hover:text-islamic-teal transition-colors"
                data-testid="nav-collections"
              >
                Collections
              </a>
              <a
                href="#"
                className="text-slate-600 dark:text-slate-300 hover:text-islamic-teal transition-colors"
                data-testid="nav-bookmarks"
              >
                Bookmarks
              </a>
              <a
                href="#"
                className="text-slate-600 dark:text-slate-300 hover:text-islamic-teal transition-colors"
                data-testid="nav-about"
              >
                About
              </a>
            </nav>

            <div className="flex items-center space-x-3">
              <FontSizeControls />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                data-testid="button-theme-toggle"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenPreferences}
                data-testid="button-preferences"
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
