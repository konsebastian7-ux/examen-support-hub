import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Search, Lock, Globe } from "lucide-react";

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  isPrivate: boolean;
  category: string;
}

const Groups = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const groups: Group[] = [
    {
      id: "1",
      name: "Survivors Support Circle",
      description: "A safe space for trauma survivors to share experiences and support each other.",
      members: 247,
      isPrivate: true,
      category: "Trauma",
    },
    {
      id: "2",
      name: "Anxiety Management",
      description: "Share coping strategies and support for managing anxiety and stress.",
      members: 189,
      isPrivate: false,
      category: "Mental Health",
    },
    {
      id: "3",
      name: "Women's Empowerment",
      description: "Supporting women in their healing journey and personal growth.",
      members: 312,
      isPrivate: true,
      category: "Support",
    },
    {
      id: "4",
      name: "Recovery Path",
      description: "For those on the path to recovery from trauma and abuse.",
      members: 156,
      isPrivate: true,
      category: "Recovery",
    },
    {
      id: "5",
      name: "Mindfulness & Healing",
      description: "Practicing mindfulness techniques together for healing and growth.",
      members: 203,
      isPrivate: false,
      category: "Wellness",
    },
  ];

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Community Support Groups</h1>
              <p className="text-muted-foreground">
                Connect with others who share similar experiences in a safe environment.
              </p>
            </div>
            <Button className="bg-gradient-accent">
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groups..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  {group.isPrivate ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {group.category}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {group.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{group.members} members</span>
                </div>
                <Button variant="outline" size="sm">
                  {group.isPrivate ? "Request to Join" : "Join Group"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No groups found matching your search.</p>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 p-6 bg-muted/50 border border-border rounded-xl">
          <h3 className="font-semibold mb-2">About Support Groups</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• All groups maintain strict confidentiality and anonymity</li>
            <li>• Private groups require approval from moderators</li>
            <li>• Share experiences, coping strategies, and support</li>
            <li>• Moderated by trained professionals for your safety</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Groups;
