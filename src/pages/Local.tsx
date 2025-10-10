import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, ExternalLink, Navigation as NavigationIcon } from "lucide-react";

interface Resource {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  distance: string;
  verified: boolean;
}

const Local = () => {
  const [location, setLocation] = useState("");

  const resources: Resource[] = [
    {
      id: "1",
      name: "Centro de Salud Mental de la Ciudad",
      type: "Servicios de Consejería",
      address: "Calle Principal 123, Centro",
      phone: "(555) 123-4567",
      distance: "1.2 km",
      verified: true,
    },
    {
      id: "2",
      name: "Centro de Crisis Esperanza",
      type: "Apoyo en Crisis 24/7",
      address: "Avenida Roble 456, Centro",
      phone: "(555) 234-5678",
      distance: "2.5 km",
      verified: true,
    },
    {
      id: "3",
      name: "Refugio Puerto Seguro",
      type: "Alojamiento de Emergencia",
      address: "Calle Olmo 789, Oeste",
      phone: "(555) 345-6789",
      distance: "3.1 km",
      verified: true,
    },
    {
      id: "4",
      name: "Clínica de Bienestar Comunitario",
      type: "Salud Médica y Mental",
      address: "Camino Pino 321, Este",
      phone: "(555) 456-7890",
      distance: "4.0 km",
      verified: true,
    },
    {
      id: "5",
      name: "Centro de Recuperación de Trauma",
      type: "Cuidado Especializado en Trauma",
      address: "Avenida Arce 654, Norte",
      phone: "(555) 567-8901",
      distance: "5.2 km",
      verified: true,
    },
  ];

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Recursos Locales</h1>
          <p className="text-muted-foreground mb-6">
            Encuentra recursos de salud mental verificados y servicios de apoyo en tu área.
          </p>

          {/* Location Search */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ingresa tu ubicación o código postal..."
                className="pl-10"
              />
            </div>
            <Button>
              <NavigationIcon className="mr-2 h-4 w-4" />
              Usar Mi Ubicación
            </Button>
          </div>
        </div>

        {/* Resources List */}
        <div className="space-y-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold">{resource.name}</h3>
                        {resource.verified && (
                          <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                            Verificado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{resource.type}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{resource.address}</span>
                      <span className="text-primary">• {resource.distance}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{resource.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Detalles
                  </Button>
                  <Button variant="outline" size="sm">
                    <NavigationIcon className="mr-2 h-4 w-4" />
                    Direcciones
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-8 p-6 bg-muted/50 border border-border rounded-xl">
          <h3 className="font-semibold mb-3">Acerca de los Recursos Locales</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Todos los recursos están verificados y se actualizan regularmente</li>
            <li>• Los servicios pueden variar según la ubicación y disponibilidad</li>
            <li>• La mayoría de los recursos ofrecen tarifas gratuitas o con escala móvil</li>
            <li>• Contacta directamente a los recursos para horarios y servicios actuales</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Local;
