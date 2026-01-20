import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Heart, Mail, Book, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Navigation() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/mood", icon: Sparkles, label: "Mood" },
    { href: "/notes", icon: Heart, label: "Notes" },
    { href: "/letters", icon: Mail, label: "Letters" },
    { href: "/journal", icon: Book, label: "Journal" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-secondary/30 border-r border-border backdrop-blur-sm p-6">
        <div className="mb-12">
          <h1 className="font-serif text-2xl text-primary font-semibold tracking-tight">Between Us</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                  location === item.href
                    ? "bg-white shadow-sm text-primary font-medium"
                    : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", location === item.href ? "text-accent" : "text-muted-foreground group-hover:text-primary")} />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          <span>Leave Space</span>
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-border z-50 px-6 py-4 flex justify-between items-center shadow-lg shadow-primary/5">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
             <div className="flex flex-col items-center gap-1 cursor-pointer">
              <div
                className={cn(
                  "p-2 rounded-full transition-colors",
                  location === item.href ? "bg-secondary text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <span className={cn("text-[10px] font-medium", location === item.href ? "text-primary" : "text-muted-foreground")}>
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </nav>
    </>
  );
}
