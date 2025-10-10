import { Navigation } from "@/components/Navigation";
import { TrendingUp, Calendar, Heart, MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Progress = () => {
  const stats = [
    {
      label: "Days Active",
      value: "14",
      icon: Calendar,
      trend: "+7 from last week",
      color: "text-primary",
    },
    {
      label: "Chat Sessions",
      value: "8",
      icon: MessageCircle,
      trend: "+2 from last week",
      color: "text-secondary",
    },
    {
      label: "Resources Accessed",
      value: "23",
      icon: Heart,
      trend: "+12 from last week",
      color: "text-primary",
    },
    {
      label: "Assessment Score",
      value: "6/15",
      icon: TrendingUp,
      trend: "Improved by 3 points",
      color: "text-secondary",
    },
  ];

  const milestones = [
    {
      date: "Today",
      title: "Completed Mental Health Assessment",
      description: "Took your first step in understanding your mental health status.",
    },
    {
      date: "Yesterday",
      title: "Joined Support Group",
      description: "Connected with the Survivors Support Circle community.",
    },
    {
      date: "3 days ago",
      title: "First Chat Session",
      description: "Had your first conversation with a support professional.",
    },
    {
      date: "1 week ago",
      title: "Started Your Journey",
      description: "Created your account and began exploring Examen resources.",
    },
  ];

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your mental health journey and celebrate your achievements.
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
          <h2 className="text-2xl font-semibold mb-6">Your Milestones</h2>
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
          <h3 className="text-xl font-semibold mb-3">Keep Going! 🌟</h3>
          <p className="text-muted-foreground mb-4">
            You've made significant progress on your healing journey. Every step forward, no matter how small, 
            is a victory worth celebrating. Remember, healing is not linear, and it's okay to have ups and downs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-semibold mb-1">Stay Consistent</p>
              <p className="text-muted-foreground text-xs">Regular engagement helps build resilience</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-semibold mb-1">Reach Out</p>
              <p className="text-muted-foreground text-xs">Connect with support when you need it</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-semibold mb-1">Be Patient</p>
              <p className="text-muted-foreground text-xs">Healing takes time, and that's okay</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Progress;
