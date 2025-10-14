import { Navigation } from "@/components/Navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Search, Lock, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  isPrivate: boolean;
  category: string;
}

const Groups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const groups: Group[] = [
    {
      id: "1",
      name: "Círculo de Apoyo para Sobrevivientes",
      description: "Un espacio seguro para sobrevivientes de trauma para compartir experiencias y apoyarse mutuamente.",
      members: 0,
      isPrivate: false,
      category: "Trauma",
    },
    {
      id: "2",
      name: "Manejo de la Ansiedad",
      description: "Comparte estrategias de afrontamiento y apoyo para manejar la ansiedad y el estrés.",
      members: 0,
      isPrivate: false,
      category: "Salud Mental",
    },
    {
      id: "3",
      name: "Empoderamiento Femenino",
      description: "Apoyando a las mujeres en su viaje de sanación y crecimiento personal.",
      members: 0,
      isPrivate: false,
      category: "Apoyo",
    },
    {
      id: "4",
      name: "Camino de Recuperación",
      description: "Para quienes están en el camino de recuperación del trauma y el abuso.",
      members: 0,
      isPrivate: false,
      category: "Recuperación",
    },
    {
      id: "5",
      name: "Mindfulness y Sanación",
      description: "Practicando técnicas de mindfulness juntos para la sanación y el crecimiento.",
      members: 0,
      isPrivate: false,
      category: "Bienestar",
    },
  ];

  useEffect(() => {
    loadMemberCounts();
  }, []);

  const loadMemberCounts = async () => {
    const counts: Record<string, number> = {};
    for (const group of groups) {
      const { count } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', group.id);
      counts[group.id] = count || 0;
    }
    setMemberCounts(counts);
  };

  const handleJoinGroup = async (groupId: string, groupName: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para unirte a un grupo.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('group_members')
      .insert({ group_id: groupId, user_id: user.id });

    if (error) {
      if (error.code === '23505') {
        // User is already a member, just navigate
        navigate(`/group/${groupId}`);
      } else {
        toast({
          title: "Error",
          description: "No se pudo unir al grupo. Intenta de nuevo.",
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "¡Te has unido al grupo!",
      description: `Ahora eres parte de "${groupName}".`,
    });
    
    loadMemberCounts();
    navigate(`/group/${groupId}`);
  };

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Grupos de Apoyo Comunitario</h1>
              <p className="text-muted-foreground">
                Conéctate con otros que comparten experiencias similares en un entorno seguro.
              </p>
            </div>
            <Button className="bg-gradient-accent">
              <Plus className="mr-2 h-4 w-4" />
              Crear Grupo
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar grupos..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  {group.isPrivate ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {group.category}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {group.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{memberCounts[group.id] || 0} miembros</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleJoinGroup(group.id, group.name)}
                >
                  Unirse al Grupo
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No se encontraron grupos que coincidan con tu búsqueda.</p>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 p-6 bg-muted/50 border border-border rounded-xl">
          <h3 className="font-semibold mb-2">Acerca de los Grupos de Apoyo</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Todos los grupos mantienen estricta confidencialidad y anonimato</li>
            <li>• Los grupos privados requieren aprobación de los moderadores</li>
            <li>• Comparte experiencias, estrategias de afrontamiento y apoyo</li>
            <li>• Moderados por profesionales capacitados para tu seguridad</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Groups;
