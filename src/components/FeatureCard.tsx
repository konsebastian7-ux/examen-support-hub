import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  priority?: "must" | "should";
}

export const FeatureCard = ({ icon: Icon, title, description, path, priority = "must" }: FeatureCardProps) => {
  return (
    <Link
      to={path}
      className={cn(
        "group relative overflow-hidden rounded-xl p-6 bg-gradient-card border border-border",
        "hover:border-primary/50 transition-all duration-300 hover:shadow-glow",
        "flex flex-col gap-4"
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          "p-3 rounded-lg",
          priority === "must" ? "bg-primary/10" : "bg-secondary/10"
        )}>
          <Icon className={cn(
            "h-6 w-6",
            priority === "must" ? "text-primary" : "text-secondary"
          )} />
        </div>
        {priority === "must" && (
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            Esencial
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </Link>
  );
};
