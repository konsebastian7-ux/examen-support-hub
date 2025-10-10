import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Video, FileText, Headphones, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Resource {
  id: string;
  title: string;
  category: string;
  type: "article" | "video" | "audio" | "document";
  description: string;
  duration?: string;
}

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const resources: Resource[] = [
    {
      id: "1",
      title: "Entendiendo el Trauma y sus Efectos",
      category: "Educación",
      type: "article",
      description: "Aprende sobre cómo el trauma afecta la mente y el cuerpo, y los primeros pasos hacia la sanación.",
      duration: "8 min de lectura",
    },
    {
      id: "2",
      title: "Estrategias de Afrontamiento para la Ansiedad",
      category: "Autoayuda",
      type: "video",
      description: "Técnicas prácticas para manejar la ansiedad y el estrés en la vida diaria.",
      duration: "15 min",
    },
    {
      id: "3",
      title: "Meditación Guiada para la Sanación",
      category: "Bienestar",
      type: "audio",
      description: "Una sesión de meditación calmante diseñada para sobrevivientes de trauma.",
      duration: "20 min",
    },
    {
      id: "4",
      title: "Derechos y Recursos para Sobrevivientes",
      category: "Legal",
      type: "document",
      description: "Guía completa sobre derechos legales y recursos disponibles.",
      duration: "12 min de lectura",
    },
    {
      id: "5",
      title: "Construyendo Relaciones Saludables",
      category: "Relaciones",
      type: "article",
      description: "Entendiendo límites saludables y comunicación en las relaciones.",
      duration: "10 min de lectura",
    },
    {
      id: "6",
      title: "Prácticas de Autocuidado",
      category: "Bienestar",
      type: "video",
      description: "Prácticas diarias para nutrir tu bienestar mental y emocional.",
      duration: "12 min",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "audio":
        return <Headphones className="h-5 w-5" />;
      case "document":
        return <BookOpen className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Biblioteca de Recursos</h1>
          <p className="text-muted-foreground mb-6">
            Explora nuestra colección de recursos de salud mental, guías y materiales de apoyo.
          </p>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar recursos..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-glow flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {getIcon(resource.type)}
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  {resource.category}
                </span>
              </div>

              <h3 className="font-semibold mb-2">{resource.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                {resource.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{resource.duration}</span>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Abrir
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No se encontraron recursos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Resources;
