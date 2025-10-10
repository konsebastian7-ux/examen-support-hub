import { Navigation } from "@/components/Navigation";
import { FeatureCard } from "@/components/FeatureCard";
import { MessageCircle, AlertCircle, BookOpen, MessageSquare, Users, Heart, TrendingUp, MapPin, Globe } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Chat de Apoyo Anónimo",
      description: "Conéctate con profesionales de apoyo en un entorno seguro y anónimo para compartir tus sentimientos sin miedo al juicio.",
      path: "/chat",
      priority: "must" as const,
    },
    {
      icon: AlertCircle,
      title: "Asistencia de Emergencia",
      description: "Acceso rápido a servicios de emergencia y apoyo en crisis cuando necesites ayuda inmediata.",
      path: "/emergency",
      priority: "must" as const,
    },
    {
      icon: BookOpen,
      title: "Biblioteca de Recursos",
      description: "Accede a una biblioteca completa de recursos de salud mental, artículos y materiales de apoyo.",
      path: "/resources",
      priority: "must" as const,
    },
    {
      icon: MessageSquare,
      title: "Compartir Opiniones",
      description: "Ayúdanos a mejorar compartiendo tu experiencia y sugerencias de forma anónima.",
      path: "/feedback",
      priority: "must" as const,
    },
    {
      icon: Users,
      title: "Grupos de Apoyo",
      description: "Únete o crea grupos de apoyo para conectar con otros que comparten experiencias similares.",
      path: "/groups",
      priority: "should" as const,
    },
    {
      icon: Heart,
      title: "Evaluación de Salud Mental",
      description: "Realiza una autoevaluación para entender mejor tu estado de salud mental y obtener recomendaciones personalizadas.",
      path: "/assessment",
      priority: "should" as const,
    },
    {
      icon: TrendingUp,
      title: "Seguimiento de tu Progreso",
      description: "Monitorea tu viaje de salud mental y observa tus mejoras a lo largo del tiempo con seguimiento visual.",
      path: "/progress",
      priority: "should" as const,
    },
    {
      icon: MapPin,
      title: "Recursos Locales",
      description: "Encuentra recursos de salud mental verificados y servicios de apoyo en tu área.",
      path: "/local",
      priority: "should" as const,
    },
    {
      icon: Globe,
      title: "Configuración de Idioma",
      description: "Accede a Examen en tu idioma preferido para una mejor experiencia.",
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
              Bienvenido a Examen
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un espacio seguro y anónimo para que personas vulnerables expresen sus sentimientos y se conecten con profesionales de apoyo.
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
          <h2 className="text-2xl font-semibold mb-4">Tu Seguridad es Nuestra Prioridad</h2>
          <p className="text-muted-foreground leading-relaxed">
            Examen está diseñado para proporcionar un entorno seguro y confidencial para aquellos que han experimentado trauma. 
            Todas las interacciones son anónimas y cifradas. Estamos aquí para apoyar tu viaje hacia la sanación y recuperación.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
