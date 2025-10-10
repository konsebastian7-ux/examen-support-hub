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
      title: "Feedback Submitted",
      description: "Thank you for helping us improve Examen. Your feedback is valuable to us.",
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
          <h1 className="text-3xl font-bold mb-2">Share Your Feedback</h1>
          <p className="text-muted-foreground">
            Your anonymous feedback helps us improve Examen for everyone.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="bg-card border border-border rounded-xl p-6">
            <Label className="text-base font-semibold mb-4 block">
              How would you rate your experience?
            </Label>
            <RadioGroup value={rating} onValueChange={setRating} className="space-y-3">
              {[
                { value: "5", label: "Excellent - Exceeded expectations" },
                { value: "4", label: "Good - Met expectations" },
                { value: "3", label: "Fair - Room for improvement" },
                { value: "2", label: "Poor - Below expectations" },
                { value: "1", label: "Very Poor - Significant issues" },
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
              Tell us more about your experience
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts, suggestions, or concerns... (Optional)"
              className="min-h-[150px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Your feedback is completely anonymous and confidential.
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            Submit Feedback
          </Button>
        </form>

        {/* Info */}
        <div className="mt-8 p-6 bg-muted/50 border border-border rounded-xl">
          <h3 className="font-semibold mb-2">Why Your Feedback Matters</h3>
          <p className="text-sm text-muted-foreground">
            Every piece of feedback helps us understand how to better serve vulnerable individuals. 
            Your anonymous input directly influences our improvements and helps create a safer, 
            more supportive environment for everyone.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
