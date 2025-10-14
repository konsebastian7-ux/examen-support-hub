import { Navigation } from "@/components/Navigation";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, UserCircle2, Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoadingHistory(false);
        setMessages([{
          id: "welcome",
          text: "¡Hola! Estoy aquí para apoyarte. Todo lo que compartas es completamente anónimo y confidencial. ¿Cómo te sientes hoy?",
          sender: "assistant",
          timestamp: new Date(),
        }]);
        return;
      }

      // Get or create session
      const { data: sessions } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      let currentSessionId: string;
      
      if (sessions && sessions.length > 0) {
        currentSessionId = sessions[0].id;
      } else {
        const { data: newSession } = await supabase
          .from('chat_sessions')
          .insert({ user_id: user.id })
          .select()
          .single();
        currentSessionId = newSession!.id;
      }

      setSessionId(currentSessionId);

      // Load messages
      const { data: chatMessages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', currentSessionId)
        .order('created_at', { ascending: true });

      if (chatMessages && chatMessages.length > 0) {
        setMessages(chatMessages.map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.role as "user" | "assistant",
          timestamp: new Date(msg.created_at),
        })));
      } else {
        setMessages([{
          id: "welcome",
          text: "¡Hola! Estoy aquí para apoyarte. Todo lo que compartas es completamente anónimo y confidencial. ¿Cómo te sientes hoy?",
          sender: "assistant",
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el historial de chat",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const saveMessage = async (message: Message) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !sessionId) return;

      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        user_id: user.id,
        role: message.sender,
        content: message.text,
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

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
    
    // Save user message
    await saveMessage(userMessage);

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

      // Save assistant message
      if (assistantMessageContent) {
        await saveMessage({
          id: assistantMessageId,
          text: assistantMessageContent,
          sender: "assistant",
          timestamp: new Date(),
        });
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
            {isLoadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              messages.map((message) => (
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
              ))
            )}
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
