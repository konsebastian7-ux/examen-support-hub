import { Navigation } from "@/components/Navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, ExternalLink, Navigation as NavigationIcon, Loader2, Clock, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface Resource {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  distance: number;
  verified: boolean;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  description?: string;
  website?: string;
  hours?: string;
}

const Local = () => {
  const [location, setLocation] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Fetch resources from database
  const fetchResources = async (lat?: number, lng?: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mental_health_resources')
        .select('*');

      if (error) throw error;

      if (data) {
        let resourcesWithDistance = data.map((resource: any) => ({
          id: resource.id,
          name: resource.name,
          type: resource.type,
          address: resource.address,
          phone: resource.phone,
          verified: resource.verified,
          latitude: parseFloat(resource.latitude),
          longitude: parseFloat(resource.longitude),
          city: resource.city,
          country: resource.country,
          description: resource.description,
          website: resource.website,
          hours: resource.hours,
          distance: lat && lng 
            ? calculateDistance(lat, lng, parseFloat(resource.latitude), parseFloat(resource.longitude))
            : 0
        }));

        // Sort by distance if user location is available
        if (lat && lng) {
          resourcesWithDistance = resourcesWithDistance.sort((a, b) => a.distance - b.distance);
        }

        setResources(resourcesWithDistance);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Error al cargar recursos');
    } finally {
      setLoading(false);
    }
  };

  // Get user's current location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('La geolocalización no está soportada en tu navegador');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        fetchResources(latitude, longitude);
        toast.success('Ubicación obtenida correctamente');
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('No se pudo obtener tu ubicación. Por favor, verifica los permisos.');
        setLocationLoading(false);
      }
    );
  };

  // Open directions in Google Maps
  const handleGetDirections = (resource: Resource) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${resource.latitude},${resource.longitude}`;
    window.open(url, '_blank');
  };

  // Show resource details
  const handleShowDetails = (resource: Resource) => {
    setSelectedResource(resource);
    setDetailsOpen(true);
  };

  useEffect(() => {
    fetchResources();
  }, []);

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
            <Button onClick={handleUseMyLocation} disabled={locationLoading}>
              {locationLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <NavigationIcon className="mr-2 h-4 w-4" />
              )}
              Usar Mi Ubicación
            </Button>
          </div>
        </div>

        {/* Resources List */}
        <div className="space-y-4">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              </div>
            ))
          ) : resources.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No se encontraron recursos en tu área</p>
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
                      {userLocation && (
                        <span className="text-primary">• {resource.distance.toFixed(1)} km</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{resource.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>{resource.city}, {resource.country}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleShowDetails(resource)}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Detalles
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleGetDirections(resource)}>
                    <NavigationIcon className="mr-2 h-4 w-4" />
                    Direcciones
                  </Button>
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedResource?.name}</DialogTitle>
              <DialogDescription>{selectedResource?.type}</DialogDescription>
            </DialogHeader>
            {selectedResource && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Descripción</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedResource.description || "No hay descripción disponible."}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Dirección
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedResource.address}</p>
                    <p className="text-sm text-muted-foreground">{selectedResource.city}, {selectedResource.country}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Teléfono
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedResource.phone}</p>
                  </div>
                  
                  {selectedResource.hours && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Horario
                      </h4>
                      <p className="text-sm text-muted-foreground">{selectedResource.hours}</p>
                    </div>
                  )}
                  
                  {selectedResource.website && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Sitio Web
                      </h4>
                      <a 
                        href={selectedResource.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Visitar sitio web
                      </a>
                    </div>
                  )}
                </div>

                {userLocation && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Distancia desde tu ubicación: <span className="font-semibold text-primary">{selectedResource.distance.toFixed(1)} km</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

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
