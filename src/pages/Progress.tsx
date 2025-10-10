import { Navigation } from "@/components/Navigation";
import { TrendingUp, Calendar, Heart, MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Progress = () => {
  const stats = [
    {
      label: "Días Activo",
      value: "14",
      icon: Calendar,
      trend: "+7 desde la semana pasada",
      color: "text-primary",
    },
    {
      label: "Sesiones de Chat",
      value: "8",
      icon: MessageCircle,
      trend: "+2 desde la semana pasada",
      color: "text-secondary",
    },
    {
      label: "Recursos Accedidos",
      value: "23",
      icon: Heart,
      trend: "+12 desde la semana pasada",
      color: "text-primary",
    },
    {
      label: "Puntuación de Evaluación",
      value: "6/15",
      icon: TrendingUp,
      trend: "Mejoró 3 puntos",
      color: "text-secondary",
    },
  ];

  const milestones = [
    {
      date: "Hoy",
      title: "Completaste la Evaluación de Salud Mental",
      description: "Diste tu primer paso para entender tu estado de salud mental.",
    },
    {
      date: "Ayer",
      title: "Te Uniste a un Grupo de Apoyo",
      description: "Te conectaste con la comunidad del Círculo de Apoyo para Sobrevivientes.",
    },
    {
      date: "Hace 3 días",
      title: "Primera Sesión de Chat",
      description: "Tuviste tu primera conversación con un profesional de apoyo.",
    },
    {
      date: "Hace 1 semana",
      title: "Comenzaste tu Viaje",
      description: "Creaste tu cuenta y comenzaste a explorar los recursos de Examen.",
    },
  ];

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
                      <span className="text-xs text-muted-foreground">{milestone.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
