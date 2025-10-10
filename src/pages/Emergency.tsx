import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, Phone, MessageSquare, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Emergency = () => {
  const { toast } = useToast();

  const handleEmergencyCall = () => {
    toast({
      title: "Connecting to Emergency Services",
      description: "You will be connected to emergency services shortly.",
    });
  };

  const emergencyContacts = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 free and confidential support",
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Free 24/7 support via text",
    },
    {
      name: "RAINN (Sexual Assault)",
      number: "1-800-656-4673",
      description: "24/7 confidential support",
    },
    {
      name: "National Domestic Violence Hotline",
      number: "1-800-799-7233",
      description: "24/7 support and resources",
    },
  ];

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-destructive/10 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Emergency Assistance</h1>
          <p className="text-muted-foreground">
            If you're in immediate danger, please call emergency services right away.
          </p>
        </div>

        {/* Immediate Action */}
        <div className="bg-gradient-card border border-destructive/50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5 text-destructive" />
            Immediate Help
          </h2>
          <p className="text-muted-foreground mb-4">
            If this is a life-threatening emergency, call your local emergency number immediately.
          </p>
          <Button 
            onClick={handleEmergencyCall}
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            size="lg"
          >
            <Phone className="mr-2 h-5 w-5" />
            Call Emergency Services (911)
          </Button>
        </div>

        {/* Crisis Support Numbers */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Crisis Support Resources</h2>
          {emergencyContacts.map((contact, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{contact.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{contact.description}</p>
                  <p className="text-lg font-semibold text-primary">{contact.number}</p>
                </div>
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Information */}
        <div className="mt-8 p-6 bg-muted/50 border border-border rounded-xl">
          <h3 className="font-semibold mb-3">Remember:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• All calls and texts to these services are free and confidential</li>
            <li>• Trained counselors are available 24/7 to help</li>
            <li>• You don't have to face this alone - reaching out is a sign of strength</li>
            <li>• These services are available regardless of your location or situation</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Emergency;
