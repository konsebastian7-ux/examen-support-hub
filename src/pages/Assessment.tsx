import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart, ChevronRight, ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  options: { value: string; label: string }[];
}

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const questions: Question[] = [
    {
      id: "1",
      text: "En las últimas 2 semanas, ¿con qué frecuencia te has sentido decaído, deprimido o sin esperanza?",
      options: [
        { value: "0", label: "Para nada" },
        { value: "1", label: "Varios días" },
        { value: "2", label: "Más de la mitad de los días" },
        { value: "3", label: "Casi todos los días" },
      ],
    },
    {
      id: "2",
      text: "¿Con qué frecuencia has tenido poco interés o placer en hacer cosas?",
      options: [
        { value: "0", label: "Para nada" },
        { value: "1", label: "Varios días" },
        { value: "2", label: "Más de la mitad de los días" },
        { value: "3", label: "Casi todos los días" },
      ],
    },
    {
      id: "3",
      text: "¿Con qué frecuencia te has sentido nervioso, ansioso o al límite?",
      options: [
        { value: "0", label: "Para nada" },
        { value: "1", label: "Varios días" },
        { value: "2", label: "Más de la mitad de los días" },
        { value: "3", label: "Casi todos los días" },
      ],
    },
    {
      id: "4",
      text: "¿Con qué frecuencia has tenido problemas para conciliar o mantener el sueño?",
      options: [
        { value: "0", label: "Para nada" },
        { value: "1", label: "Varios días" },
        { value: "2", label: "Más de la mitad de los días" },
        { value: "3", label: "Casi todos los días" },
      ],
    },
    {
      id: "5",
      text: "¿Cómo calificarías tu bienestar mental en general?",
      options: [
        { value: "0", label: "Excelente" },
        { value: "1", label: "Bueno" },
        { value: "2", label: "Regular" },
        { value: "3", label: "Malo" },
      ],
    },
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      toast({
        title: "Evaluación Completa",
        description: "Tus resultados han sido compilados. Recuerda, esto no es un diagnóstico.",
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, value) => sum + parseInt(value), 0);
  };

  const getRecommendation = (score: number) => {
    if (score <= 4) {
      return {
        level: "Mínimo",
        color: "text-secondary",
        message: "Muestras signos mínimos de malestar. Continúa practicando el autocuidado.",
      };
    } else if (score <= 9) {
      return {
        level: "Leve",
        color: "text-primary",
        message: "Podrías estar experimentando síntomas leves. Considera explorar nuestros recursos.",
      };
    } else if (score <= 14) {
      return {
        level: "Moderado",
        color: "text-yellow-500",
        message: "Muestras síntomas moderados. Recomendamos hablar con un profesional.",
      };
    } else {
      return {
        level: "Severo",
        color: "text-destructive",
        message: "Podrías estar experimentando síntomas severos. Por favor considera buscar ayuda profesional de inmediato.",
      };
    }
  };

  if (showResults) {
    const score = calculateScore();
    const recommendation = getRecommendation(score);

    return (
      <div className="min-h-screen pb-20 md:pt-20">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Resultados de la Evaluación</h1>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 mb-6">
            <div className="text-center mb-6">
              <p className="text-muted-foreground mb-2">Tu Puntuación</p>
              <p className="text-5xl font-bold mb-2">{score}</p>
              <p className={`text-xl font-semibold ${recommendation.color}`}>
                Síntomas {recommendation.level}s
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg mb-6">
              <p className="text-sm">{recommendation.message}</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Próximos Pasos Recomendados:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Explora nuestra Biblioteca de Recursos para materiales útiles</li>
                <li>• Conéctate con profesionales de apoyo vía Chat Anónimo</li>
                <li>• Únete a un Grupo de Apoyo para conectar con otros</li>
                <li>• Sigue tu progreso a lo largo del tiempo</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => { setShowResults(false); setCurrentQuestion(0); setAnswers({}); }} variant="outline" className="flex-1">
              Repetir Evaluación
            </Button>
            <Button onClick={() => window.location.href = "/resources"} className="flex-1">
              Ver Recursos
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Importante:</strong> Esta evaluación no es una herramienta de diagnóstico. Está diseñada para 
              ayudarte a entender tu estado actual de salud mental. Para una evaluación profesional, por favor consulta 
              con un profesional de salud mental.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Evaluación de Salud Mental</h1>
          <p className="text-muted-foreground mb-4">
            Tómate un momento para evaluar tu bienestar mental. Esto es completamente anónimo.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="text-muted-foreground">
                {currentQuestion + 1} de {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 mb-6">
          <h2 className="text-xl font-semibold mb-6">
            {questions[currentQuestion].text}
          </h2>

          <RadioGroup
            value={answers[questions[currentQuestion].id] || ""}
            onValueChange={handleAnswer}
            className="space-y-4"
          >
            {questions[currentQuestion].options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answers[questions[currentQuestion].id]}
            className="flex-1"
          >
            {currentQuestion === questions.length - 1 ? "Ver Resultados" : "Siguiente"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Assessment;
