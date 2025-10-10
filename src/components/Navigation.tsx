import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, AlertCircle, BookOpen, Users, Heart, TrendingUp, MapPin, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: AlertCircle, label: "Emergency", path: "/emergency" },
  { icon: BookOpen, label: "Resources", path: "/resources" },
  { icon: Users, label: "Groups", path: "/groups" },
  { icon: Heart, label: "Assessment", path: "/assessment" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: MapPin, label: "Local", path: "/local" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-around md:justify-start md:gap-6 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 py-1 rounded-lg transition-all duration-300",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "drop-shadow-glow")} />
                <span className="text-[10px] md:text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
