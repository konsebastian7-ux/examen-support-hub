import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const { toast } = useToast();

  const languages = [
    { code: "es", name: "Español", nativeName: "Español" },
    { code: "en", name: "Inglés", nativeName: "English" },
    { code: "fr", name: "Francés", nativeName: "Français" },
    { code: "de", name: "Alemán", nativeName: "Deutsch" },
    { code: "pt", name: "Portugués", nativeName: "Português" },
    { code: "zh", name: "Chino", nativeName: "中文" },
    { code: "ja", name: "Japonés", nativeName: "日本語" },
    { code: "ko", name: "Coreano", nativeName: "한국어" },
    { code: "ar", name: "Árabe", nativeName: "العربية" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  ];

  const handleSave = () => {
    toast({
      title: "Configuración Guardada",
      description: "Tu preferencia de idioma ha sido actualizada exitosamente.",
    });
  };

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Configuración de Idioma</h1>
          <p className="text-muted-foreground">
            Elige tu idioma preferido para la mejor experiencia con Examen.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <Label className="text-base font-semibold mb-4 block">
            Selecciona Tu Idioma
          </Label>
          
          <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage} className="space-y-3">
            {languages.map((language) => (
              <div
                key={language.code}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={language.code} id={language.code} />
                  <Label htmlFor={language.code} className="cursor-pointer flex flex-col">
                    <span className="font-medium">{language.name}</span>
                    <span className="text-sm text-muted-foreground">{language.nativeName}</span>
                  </Label>
                </div>
                {selectedLanguage === language.code && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button onClick={handleSave} className="w-full" size="lg">
          Guardar Preferencia de Idioma
        </Button>

        <div className="mt-8 p-6 bg-muted/50 border border-border rounded-xl">
          <h3 className="font-semibold mb-3">Acerca del Soporte Multilingüe</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Todas las funciones están disponibles en tu idioma seleccionado</li>
            <li>• El idioma puede cambiarse en cualquier momento sin cerrar sesión</li>
            <li>• El apoyo profesional está disponible en múltiples idiomas</li>
            <li>• Los recursos y materiales están traducidos con precisión</li>
          </ul>
        </div>

        {/* Additional Settings Placeholder */}
        <div className="mt-6 p-6 bg-card border border-border rounded-xl">
          <h3 className="font-semibold mb-3">Otras Configuraciones</h3>
          <p className="text-sm text-muted-foreground">
            Configuraciones adicionales para notificaciones, privacidad y accesibilidad estarán disponibles aquí.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
