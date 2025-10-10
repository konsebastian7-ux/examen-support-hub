import { Navigation } from "@/components/Navigation";
import { FeatureCard } from "@/components/FeatureCard";
import { MessageCircle, AlertCircle, BookOpen, MessageSquare, Users, Heart, TrendingUp, MapPin, Globe } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Anonymous Support Chat",
      description: "Connect with support professionals in a secure, anonymous environment to share your feelings without fear of judgment.",
      path: "/chat",
      priority: "must" as const,
    },
    {
      icon: AlertCircle,
      title: "Emergency Assistance",
      description: "Quick access to emergency services and crisis support when you need immediate help.",
      path: "/emergency",
      priority: "must" as const,
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description: "Access a comprehensive library of mental health resources, articles, and support materials.",
      path: "/resources",
      priority: "must" as const,
    },
    {
      icon: MessageSquare,
      title: "Share Feedback",
      description: "Help us improve by sharing your experience and suggestions anonymously.",
      path: "/feedback",
      priority: "must" as const,
    },
    {
      icon: Users,
      title: "Support Groups",
      description: "Join or create support groups to connect with others who share similar experiences.",
      path: "/groups",
      priority: "should" as const,
    },
    {
      icon: Heart,
      title: "Mental Health Assessment",
      description: "Take a self-assessment to better understand your mental health status and get personalized recommendations.",
      path: "/assessment",
      priority: "should" as const,
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Monitor your mental health journey and see your improvements over time with visual progress tracking.",
      path: "/progress",
      priority: "should" as const,
    },
    {
      icon: MapPin,
      title: "Local Resources",
      description: "Find verified mental health resources and support services in your area.",
      path: "/local",
      priority: "should" as const,
    },
    {
      icon: Globe,
      title: "Language Settings",
      description: "Access Examen in your preferred language for a better experience.",
      path: "/settings",
      priority: "should" as const,
    },
  ];

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Welcome to Examen
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A safe, anonymous space for vulnerable individuals to express their feelings and connect with support professionals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.path} {...feature} />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-gradient-card border border-border rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">Your Safety is Our Priority</h2>
          <p className="text-muted-foreground leading-relaxed">
            Examen is designed to provide a secure and confidential environment for those who have experienced trauma. 
            All interactions are anonymous and encrypted. We're here to support your journey toward healing and recovery.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
