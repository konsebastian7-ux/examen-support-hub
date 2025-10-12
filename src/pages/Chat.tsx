import { Navigation } from "@/components/Navigation";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, UserCircle2, Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Estoy aquí para apoyarte. Todo lo que compartas es completamente anónimo y confidencial. ¿Cómo te sientes hoy?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    let assistantMessageContent = "";
    const assistantMessageId = (Date.now() + 1).toString();

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/psychology-chat`;
      
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text
          }))
        }),
      });

      if (!resp.ok) {
        throw new Error("Error al conectar con el asistente");
      }

      if (!resp.body) {
        throw new Error("No se recibió respuesta del servidor");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantMessageContent += content;
              
              setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.sender === "assistant" && lastMessage.id === assistantMessageId) {
                  return prev.map(m => 
                    m.id === assistantMessageId 
                      ? { ...m, text: assistantMessageContent }
                      : m
                  );
                }
                return [...prev, {
                  id: assistantMessageId,
                  text: assistantMessageContent,
                  sender: "assistant" as const,
                  timestamp: new Date(),
                }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantMessageContent += content;
              setMessages(prev => 
                prev.map(m => 
                  m.id === assistantMessageId 
                    ? { ...m, text: assistantMessageContent }
                    : m
                )
              );
            }
          } catch {}
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo conectar con el asistente. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                    <Bot className="h-5 w-5 text-secondary" />
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
            <div className="flex gap-2 items-end">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                size="icon" 
                className="flex-shrink-0 h-[60px]"
                disabled={isLoading || !inputValue.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isLoading ? "El asistente está escribiendo..." : "Presiona Enter para enviar • Tu identidad permanece anónima"}
            </p>
          </div>
          <div ref={messagesEndRef} />
        </div>
      </main>
    </div>
  );
};

export default Chat;
