import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, UserCircle2, HeadphonesIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Estoy aquí para apoyarte. Todo lo que compartas es completamente anónimo y confidencial. ¿Cómo te sientes hoy?",
      sender: "support",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate support response
    setTimeout(() => {
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Gracias por compartir. Estoy aquí para escucharte y apoyarte. Tómate tu tiempo.",
        sender: "support",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportResponse]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Chat de Apoyo Anónimo</h1>
          <p className="text-muted-foreground">
            Estás conectado con un profesional de apoyo. Todo lo que compartas es confidencial.
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col" style={{ height: "calc(100vh - 300px)" }}>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  message.sender === "user" ? "bg-primary/20" : "bg-secondary/20"
                }`}>
                  {message.sender === "user" ? (
                    <UserCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <HeadphonesIcon className="h-5 w-5 text-secondary" />
                  )}
                </div>
                <div className={`flex flex-col gap-1 max-w-[70%] ${
                  message.sender === "user" ? "items-end" : "items-start"
                }`}>
                  <div className={`px-4 py-3 rounded-xl ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4 bg-muted/30">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon" className="flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Presiona Enter para enviar • Tu identidad permanece anónima
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
