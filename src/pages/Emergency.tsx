import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, Phone, MessageSquare, ExternalLink } from "lucide-react";

const Emergency = () => {

  const handleEmergencyCall = () => {
    window.location.href = "tel:911";
  };

  const handleContactClick = (contact: typeof emergencyContacts[0]) => {
    if (contact.number.includes("Envía")) {
      // Para mensajes de texto
      window.location.href = "sms:741741?body=HOLA";
    } else {
      // Para llamadas telefónicas
      window.location.href = `tel:${contact.number.replace(/[^0-9]/g, '')}`;
    }
  };

  const emergencyContacts = [
    {
      name: "Centro de Asistencia al Suicida (Argentina)",
      number: "135",
      description: "Atención telefónica gratuita 24/7",
    },
    {
      name: "Línea 102 - Derechos de Niños y Adolescentes",
      number: "102",
      description: "Atención gratuita para menores en riesgo",
    },
    {
      name: "Línea 144 - Violencia de Género",
      number: "144",
      description: "Atención 24/7 por violencia de género",
    },
    {
      name: "SAME - Emergencias Médicas",
      number: "107",
      description: "Emergencias médicas y psiquiátricas",
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
          <h1 className="text-3xl font-bold mb-2">Asistencia de Emergencia</h1>
          <p className="text-muted-foreground">
            Si estás en peligro inmediato, por favor llama a los servicios de emergencia de inmediato.
          </p>
        </div>

        {/* Immediate Action */}
        <div className="bg-gradient-card border border-destructive/50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5 text-destructive" />
            Ayuda Inmediata
          </h2>
          <p className="text-muted-foreground mb-4">
            Si esta es una emergencia que pone en riesgo tu vida, llama a tu número de emergencia local inmediatamente.
          </p>
          <Button 
            onClick={handleEmergencyCall}
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            size="lg"
          >
            <Phone className="mr-2 h-5 w-5" />
            Llamar a Servicios de Emergencia (911)
          </Button>
        </div>

        {/* Crisis Support Numbers */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Recursos de Apoyo en Crisis</h2>
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
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="flex-shrink-0"
                  onClick={() => handleContactClick(contact)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Information */}
        <div className="mt-8 p-6 bg-muted/50 border border-border rounded-xl">
          <h3 className="font-semibold mb-3">Recuerda:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Todas las llamadas y mensajes a estos servicios son gratuitos y confidenciales</li>
            <li>• Consejeros capacitados están disponibles 24/7 para ayudar</li>
            <li>• No tienes que enfrentar esto solo - pedir ayuda es una señal de fortaleza</li>
            <li>• Estos servicios están disponibles sin importar tu ubicación o situación</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Emergency;
