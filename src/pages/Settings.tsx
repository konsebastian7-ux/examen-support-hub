import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { toast } = useToast();

  const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "de", name: "German", nativeName: "Deutsch" },
    { code: "pt", name: "Portuguese", nativeName: "Português" },
    { code: "zh", name: "Chinese", nativeName: "中文" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
    { code: "ko", name: "Korean", nativeName: "한국어" },
    { code: "ar", name: "Arabic", nativeName: "العربية" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  ];

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your language preference has been updated successfully.",
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
          <h1 className="text-3xl font-bold mb-2">Language Settings</h1>
          <p className="text-muted-foreground">
            Choose your preferred language for the best experience with Examen.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <Label className="text-base font-semibold mb-4 block">
            Select Your Language
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
          Save Language Preference
        </Button>

        <div className="mt-8 p-6 bg-muted/50 border border-border rounded-xl">
          <h3 className="font-semibold mb-3">About Multilingual Support</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• All features are available in your selected language</li>
            <li>• Language can be changed at any time without logging out</li>
            <li>• Professional support is available in multiple languages</li>
            <li>• Resources and materials are translated accurately</li>
          </ul>
        </div>

        {/* Additional Settings Placeholder */}
        <div className="mt-6 p-6 bg-card border border-border rounded-xl">
          <h3 className="font-semibold mb-3">Other Settings</h3>
          <p className="text-sm text-muted-foreground">
            Additional settings for notifications, privacy, and accessibility will be available here.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
