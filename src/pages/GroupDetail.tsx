import { Navigation } from "@/components/Navigation";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  first_name?: string | null;
  last_name?: string | null;
}

interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
}

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [group, setGroup] = useState<Group | null>(null);

  const groups: Group[] = [
    {
      id: "1",
      name: "Círculo de Apoyo para Sobrevivientes",
      description: "Un espacio seguro para sobrevivientes de trauma para compartir experiencias y apoyarse mutuamente.",
      category: "Trauma",
    },
    {
      id: "2",
      name: "Manejo de la Ansiedad",
      description: "Comparte estrategias de afrontamiento y apoyo para manejar la ansiedad y el estrés.",
      category: "Salud Mental",
    },
    {
      id: "3",
      name: "Empoderamiento Femenino",
      description: "Apoyando a las mujeres en su viaje de sanación y crecimiento personal.",
      category: "Apoyo",
    },
    {
      id: "4",
      name: "Camino de Recuperación",
      description: "Para quienes están en el camino de recuperación del trauma y el abuso.",
      category: "Recuperación",
    },
    {
      id: "5",
      name: "Mindfulness y Sanación",
      description: "Practicando técnicas de mindfulness juntos para la sanación y el crecimiento.",
      category: "Bienestar",
    },
  ];

  useEffect(() => {
    loadPosts();
    loadMemberCount();
    
    const currentGroup = groups.find(g => g.id === groupId);
    setGroup(currentGroup || null);

    // Subscribe to new posts
    const channel = supabase
      .channel(`group_posts_${groupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_posts',
          filter: `group_id=eq.${groupId}`
        },
        (payload) => {
          loadPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);


  const loadMemberCount = async () => {
    if (!groupId) return;
    
    const { count } = await supabase
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', groupId);
    
    setMemberCount(count || 0);
  };

  const loadPosts = async () => {
    if (!groupId) return;
    
    setIsLoading(true);
    const { data: postsData, error } = await supabase
      .from('group_posts')
      .select('id, content, created_at, user_id')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading posts:', error);
      setIsLoading(false);
      return;
    }

    // Fetch profile data for each post
    const postsWithProfiles = await Promise.all(
      (postsData || []).map(async (post) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', post.user_id)
          .single();

        return {
          ...post,
          first_name: profile?.first_name,
          last_name: profile?.last_name,
        };
      })
    );

    setPosts(postsWithProfiles);
    setIsLoading(false);
  };

  const handleSendPost = async () => {
    if (!newPost.trim() || !groupId) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para publicar.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    const { error } = await supabase
      .from('group_posts')
      .insert({
        group_id: groupId,
        user_id: user.id,
        content: newPost.trim(),
      });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje.",
        variant: "destructive",
      });
    } else {
      setNewPost("");
      loadPosts();
    }
    setIsSending(false);
  };

  const getUserInitials = (post: Post) => {
    const firstName = post.first_name || 'U';
    const lastName = post.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getUserName = (post: Post) => {
    const firstName = post.first_name || 'Usuario';
    const lastName = post.last_name || '';
    return `${firstName} ${lastName}`.trim();
  };


  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/groups')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Grupos
        </Button>

        {group && (
          <div className="mb-8 p-6 bg-card border border-border rounded-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
                <p className="text-muted-foreground">{group.description}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                {group.category}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{memberCount} miembros</span>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Foro de Discusión</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6 mb-6 max-h-[500px] overflow-y-auto pr-2">
              {posts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay mensajes aún. ¡Sé el primero en compartir!
                </p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="flex gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getUserInitials(post)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {getUserName(post)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString('es-AR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{post.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Comparte tus pensamientos con el grupo..."
              className="min-h-[100px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendPost();
                }
              }}
            />
            <Button
              onClick={handleSendPost}
              disabled={!newPost.trim() || isSending}
              className="self-end"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="p-6 bg-muted/50 border border-border rounded-xl">
          <h3 className="font-semibold mb-2">Reglas del Grupo</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Trata a todos con respeto y empatía</li>
            <li>• Mantén la confidencialidad de lo compartido en el grupo</li>
            <li>• No compartas información personal sensible</li>
            <li>• Este es un espacio de apoyo, no de diagnóstico médico</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default GroupDetail;