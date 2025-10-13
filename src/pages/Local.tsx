import { Navigation } from "@/components/Navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, ExternalLink, Navigation as NavigationIcon, Loader2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Resource {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  verified: boolean;
  description?: string;
  website?: string;
  hours?: string;
  distance?: number;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const Local = () => {
  const [location, setLocation] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Cargar recursos al montar el componente
  useEffect(() => {
    loadResources();
  }, []);

  // Calcular distancias cuando cambia la ubicación del usuario
  useEffect(() => {
    if (userLocation && resources.length > 0) {
      const resourcesWithDistance = resources.map(resource => ({
        ...resource,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          resource.latitude,
          resource.longitude
        )
      }));
      
      // Ordenar por distancia
      resourcesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      setResources(resourcesWithDistance);
    }
  }, [userLocation]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mental_health_resources')
        .select('*')
        .order('city');

      if (error) throw error;
      
      setResources(data || []);
    } catch (error) {
      console.error('Error loading resources:', error);
      toast.error('Error al cargar los recursos');
    } finally {
      setLoading(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('La geolocalización no está disponible en tu navegador');
      return;
    }

    toast.loading('Obteniendo tu ubicación...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        toast.dismiss();
        toast.success('Ubicación obtenida correctamente');
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.dismiss();
        toast.error('No se pudo obtener tu ubicación. Verifica los permisos.');
      }
    );
  };

  const handleDetails = (resource: Resource) => {
    setSelectedResource(resource);
    setDetailsOpen(true);
  };

  const handleDirections = (resource: Resource) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(resource.address)}`;
    window.open(url, '_blank');
  };

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
            <Button onClick={useMyLocation}>
              <NavigationIcon className="mr-2 h-4 w-4" />
              Usar Mi Ubicación
            </Button>
          </div>

          {userLocation && (
            <p className="text-sm text-muted-foreground mt-2">
              📍 Mostrando recursos ordenados por cercanía a tu ubicación
            </p>
          )}
        </div>

        {/* Resources List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No se encontraron recursos en tu área
            </div>
          ) : (
            resources.map((resource) => (
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
                        {resource.distance && (
                          <span className="text-primary">
                            • {resource.distance.toFixed(1)} km
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{resource.phone}</span>
                      </div>
                      {resource.hours && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{resource.hours}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDetails(resource)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Detalles
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDirections(resource)}
                    >
                      <NavigationIcon className="mr-2 h-4 w-4" />
                      Direcciones
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
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

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                {selectedResource?.name}
              </DialogTitle>
              <DialogDescription className="text-base">
                {selectedResource?.type}
              </DialogDescription>
            </DialogHeader>
            
            {selectedResource && (
              <div className="space-y-4">
                {selectedResource.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Descripción</h4>
                    <p className="text-muted-foreground">{selectedResource.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Ubicación</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{selectedResource.address}</span>
                      </p>
                      <p className="text-muted-foreground">
                        {selectedResource.city}, {selectedResource.country}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Contacto</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{selectedResource.phone}</span>
                      </p>
                      {selectedResource.hours && (
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{selectedResource.hours}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedResource.website && (
                  <div>
                    <h4 className="font-semibold mb-2">Sitio Web</h4>
                    <a 
                      href={selectedResource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visitar sitio web
                    </a>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => handleDirections(selectedResource)}
                    className="flex-1"
                  >
                    <NavigationIcon className="mr-2 h-4 w-4" />
                    Cómo llegar
                  </Button>
                  {selectedResource.phone && (
                    <Button 
                      variant="outline"
                      onClick={() => window.open(`tel:${selectedResource.phone}`)}
                      className="flex-1"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Llamar
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Local;
