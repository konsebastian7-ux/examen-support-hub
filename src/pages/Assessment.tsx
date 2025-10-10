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
      text: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
      options: [
        { value: "0", label: "Not at all" },
        { value: "1", label: "Several days" },
        { value: "2", label: "More than half the days" },
        { value: "3", label: "Nearly every day" },
      ],
    },
    {
      id: "2",
      text: "How often have you had little interest or pleasure in doing things?",
      options: [
        { value: "0", label: "Not at all" },
        { value: "1", label: "Several days" },
        { value: "2", label: "More than half the days" },
        { value: "3", label: "Nearly every day" },
      ],
    },
    {
      id: "3",
      text: "How often have you felt nervous, anxious, or on edge?",
      options: [
        { value: "0", label: "Not at all" },
        { value: "1", label: "Several days" },
        { value: "2", label: "More than half the days" },
        { value: "3", label: "Nearly every day" },
      ],
    },
    {
      id: "4",
      text: "How often have you had trouble falling or staying asleep?",
      options: [
        { value: "0", label: "Not at all" },
        { value: "1", label: "Several days" },
        { value: "2", label: "More than half the days" },
        { value: "3", label: "Nearly every day" },
      ],
    },
    {
      id: "5",
      text: "How would you rate your overall mental wellbeing?",
      options: [
        { value: "0", label: "Excellent" },
        { value: "1", label: "Good" },
        { value: "2", label: "Fair" },
        { value: "3", label: "Poor" },
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
        title: "Assessment Complete",
        description: "Your results have been compiled. Remember, this is not a diagnosis.",
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
        level: "Minimal",
        color: "text-secondary",
        message: "You're showing minimal signs of distress. Continue practicing self-care.",
      };
    } else if (score <= 9) {
      return {
        level: "Mild",
        color: "text-primary",
        message: "You may be experiencing mild symptoms. Consider exploring our resources.",
      };
    } else if (score <= 14) {
      return {
        level: "Moderate",
        color: "text-yellow-500",
        message: "You're showing moderate symptoms. We recommend speaking with a professional.",
      };
    } else {
      return {
        level: "Severe",
        color: "text-destructive",
        message: "You may be experiencing severe symptoms. Please consider seeking professional help immediately.",
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
            <h1 className="text-3xl font-bold mb-2">Assessment Results</h1>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 mb-6">
            <div className="text-center mb-6">
              <p className="text-muted-foreground mb-2">Your Score</p>
              <p className="text-5xl font-bold mb-2">{score}</p>
              <p className={`text-xl font-semibold ${recommendation.color}`}>
                {recommendation.level} Symptoms
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg mb-6">
              <p className="text-sm">{recommendation.message}</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Recommended Next Steps:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Explore our Resource Library for helpful materials</li>
                <li>• Connect with support professionals via Anonymous Chat</li>
                <li>• Join a Support Group to connect with others</li>
                <li>• Track your progress over time</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => { setShowResults(false); setCurrentQuestion(0); setAnswers({}); }} variant="outline" className="flex-1">
              Retake Assessment
            </Button>
            <Button onClick={() => window.location.href = "/resources"} className="flex-1">
              View Resources
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Important:</strong> This assessment is not a diagnostic tool. It's designed to help you 
              understand your current mental health status. For a professional evaluation, please consult with a 
              mental health professional.
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
          <h1 className="text-3xl font-bold mb-2">Mental Health Assessment</h1>
          <p className="text-muted-foreground mb-4">
            Take a moment to evaluate your mental wellbeing. This is completely anonymous.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-muted-foreground">
                {currentQuestion + 1} of {questions.length}
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
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answers[questions[currentQuestion].id]}
            className="flex-1"
          >
            {currentQuestion === questions.length - 1 ? "View Results" : "Next"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Assessment;
