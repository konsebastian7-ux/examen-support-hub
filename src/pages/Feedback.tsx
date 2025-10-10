import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageSquare, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Feedback = () => {
  const [rating, setRating] = useState("5");
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Opinión Enviada",
      description: "Gracias por ayudarnos a mejorar Examen. Tu opinión es valiosa para nosotros.",
    });

    setRating("5");
    setFeedback("");
  };

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Comparte tu Opinión</h1>
          <p className="text-muted-foreground">
            Tu opinión anónima nos ayuda a mejorar Examen para todos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="bg-card border border-border rounded-xl p-6">
            <Label className="text-base font-semibold mb-4 block">
              ¿Cómo calificarías tu experiencia?
            </Label>
            <RadioGroup value={rating} onValueChange={setRating} className="space-y-3">
              {[
                { value: "5", label: "Excelente - Superó las expectativas" },
                { value: "4", label: "Bueno - Cumplió las expectativas" },
                { value: "3", label: "Regular - Hay margen de mejora" },
                { value: "2", label: "Malo - Por debajo de las expectativas" },
                { value: "1", label: "Muy malo - Problemas significativos" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < parseInt(option.value)
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm">{option.label}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Feedback Text */}
          <div className="bg-card border border-border rounded-xl p-6">
            <Label htmlFor="feedback" className="text-base font-semibold mb-4 block">
              Cuéntanos más sobre tu experiencia
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Comparte tus pensamientos, sugerencias o inquietudes... (Opcional)"
              className="min-h-[150px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Tu opinión es completamente anónima y confidencial.
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            Enviar Opinión
          </Button>
        </form>

        {/* Info */}
        <div className="mt-8 p-6 bg-muted/50 border border-border rounded-xl">
          <h3 className="font-semibold mb-2">Por qué tu Opinión Importa</h3>
          <p className="text-sm text-muted-foreground">
            Cada opinión nos ayuda a entender cómo servir mejor a las personas vulnerables. 
            Tu aporte anónimo influye directamente en nuestras mejoras y ayuda a crear un 
            ambiente más seguro y de apoyo para todos.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
