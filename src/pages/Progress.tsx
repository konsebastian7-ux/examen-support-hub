import { Navigation } from "@/components/Navigation";
import { TrendingUp, Calendar, Heart, MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface Milestone {
  created_at: string;
  title: string;
  description: string;
}

const Progress = () => {
  const [loading, setLoading] = useState(true);
  const [activeDays, setActiveDays] = useState(0);
  const [chatSessions, setChatSessions] = useState(0);
  const [resourcesAccessed, setResourcesAccessed] = useState(0);
  const [latestScore, setLatestScore] = useState<string>("0/15");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      await loadUserData(session.user.id);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadUserData = async (userId: string) => {
    try {
      // Registrar actividad de hoy
      await supabase
        .from("user_activity")
        .upsert({ user_id: userId, activity_date: new Date().toISOString().split('T')[0] });

      // Obtener días activos
      const { data: activityData } = await supabase
        .from("user_activity")
        .select("activity_date")
        .eq("user_id", userId);
      setActiveDays(activityData?.length || 0);

      // Obtener sesiones de chat
      const { data: chatData } = await supabase
        .from("chat_sessions")
        .select("id")
        .eq("user_id", userId);
      setChatSessions(chatData?.length || 0);

      // Obtener recursos accedidos
      const { data: resourcesData } = await supabase
        .from("accessed_resources")
        .select("id")
        .eq("user_id", userId);
      setResourcesAccessed(resourcesData?.length || 0);

      // Obtener última evaluación
      const { data: assessmentData } = await supabase
        .from("assessments")
        .select("score, max_score")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);
      
      if (assessmentData && assessmentData.length > 0) {
        setLatestScore(`${assessmentData[0].score}/${assessmentData[0].max_score}`);
      }

      // Obtener hitos
      const { data: milestonesData } = await supabase
        .from("milestones")
        .select("created_at, title, description")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      setMilestones(milestonesData || []);

    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 14) return "Hace 1 semana";
    return `Hace ${Math.floor(diffDays / 7)} semanas`;
  };

  const stats = [
    {
      label: "Días Activo",
      value: activeDays.toString(),
      icon: Calendar,
      trend: `${activeDays} ${activeDays === 1 ? 'día' : 'días'} de actividad`,
      color: "text-primary",
    },
    {
      label: "Sesiones de Chat",
      value: chatSessions.toString(),
      icon: MessageCircle,
      trend: `${chatSessions === 1 ? 'sesión' : 'sesiones'} completadas`,
      color: "text-secondary",
    },
    {
      label: "Recursos Accedidos",
      value: resourcesAccessed.toString(),
      icon: Heart,
      trend: `${resourcesAccessed} recursos explorados`,
      color: "text-primary",
    },
    {
      label: "Puntuación de Evaluación",
      value: latestScore,
      icon: TrendingUp,
      trend: latestScore === "0/15" ? "Sin evaluación aún" : "Última evaluación",
      color: "text-secondary",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen pb-20 md:pt-20">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tu Progreso</h1>
          <p className="text-muted-foreground">
            Sigue tu viaje de salud mental y celebra tus logros.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-gradient-card border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-muted-foreground">
                      {stat.label}
                    </CardDescription>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Milestones */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Tus Hitos</h2>
          {milestones.length === 0 ? (
            <Card className="bg-card border border-border p-6">
              <p className="text-muted-foreground text-center">
                Aún no tienes hitos. Comienza a usar la app para crear tu historial.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold">{milestone.title}</h3>
                        <span className="text-xs text-muted-foreground">
                          {getRelativeDate(milestone.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Encouragement */}
        <div className="bg-gradient-card border border-border rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-3">¡Sigue Adelante! 🌟</h3>
          <p className="text-muted-foreground mb-4">
            Has hecho un progreso significativo en tu viaje de sanación. Cada paso adelante, no importa cuán pequeño, 
            es una victoria que vale la pena celebrar. Recuerda, la sanación no es lineal, y está bien tener altibajos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-semibold mb-1">Mantén la Constancia</p>
              <p className="text-muted-foreground text-xs">El compromiso regular ayuda a construir resiliencia</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-semibold mb-1">Pide Ayuda</p>
              <p className="text-muted-foreground text-xs">Conéctate con apoyo cuando lo necesites</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-semibold mb-1">Ten Paciencia</p>
              <p className="text-muted-foreground text-xs">La sanación toma tiempo, y eso está bien</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Progress;
