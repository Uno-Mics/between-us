import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/PageContainer";
import { useMood } from "@/hooks/use-mood";
import { useNotes } from "@/hooks/use-notes";
import { useLetters } from "@/hooks/use-letters";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowRight, Mail, PenLine, Sparkles, Sun, Coffee, Heart, 
  BatteryCharging, CloudRain, Zap, Book, Plus, MessageSquare,
  CheckCircle2, Star, User
} from "lucide-react";

const getIcon = (name: string) => {
  const map: Record<string, any> = {
    happy: Sun, calm: Coffee, romantic: Heart, tired: BatteryCharging, sad: CloudRain, excited: Zap
  };
  return map[name] || Sun;
};

export default function Dashboard() {
  const { user } = useAuth();
  const { moods } = useMood();
  const { notes } = useNotes();
  const { letters } = useLetters();
  
  const myName = localStorage.getItem("user_identity");
  const partnerName = user?.name1 === myName ? user?.name2 : user?.name1;
  const partnerMood = partnerName ? moods[partnerName] : null;

  const unreadLetters = letters.filter(l => l.isSealed).length;
  const latestNote = notes[0];

  const quickActions = [
    { label: "Update Mood", icon: Sparkles, href: "/mood", color: "bg-amber-50 text-amber-600" },
    { label: "Post Note", icon: MessageSquare, href: "/notes", color: "bg-rose-50 text-rose-600" },
    { label: "Write Letter", icon: Mail, href: "/letters", color: "bg-indigo-50 text-indigo-600" },
    { label: "New Journal", icon: Book, href: "/journal", color: "bg-emerald-50 text-emerald-600" },
  ];

  const bucketList = [
    { title: "Stargazing date", completed: true },
    { title: "Weekend getaway", completed: false },
    { title: "Cook a 3-course meal", completed: false },
  ];

  return (
    <PageContainer 
      title={`Hi, ${myName}`}
      subtitle={format(new Date(), "EEEE, MMMM do")}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-1 md:col-span-2 lg:col-span-2 glass-panel p-8 rounded-3xl relative overflow-hidden border border-primary/10"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-xl text-primary font-medium mb-1">
                    {partnerName}'s Mood
                  </h3>
                  <p className="text-sm text-muted-foreground">How your partner is feeling</p>
                </div>
                <Link href="/mood">
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <PenLine className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6">
                {partnerMood ? (
                  <>
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm", partnerMood.color)}>
                       {(() => {
                          const Icon = getIcon(partnerMood.icon);
                          return <Icon className="w-8 h-8 opacity-80" />;
                       })()}
                    </div>
                    <div>
                      <p className="text-2xl font-serif text-foreground capitalize">{partnerMood.status}</p>
                      {partnerMood.context && (
                        <p className="text-muted-foreground text-sm mt-1">"{partnerMood.context}"</p>
                      )}
                      <p className="text-[10px] text-muted-foreground/60 mt-2">
                        Updated {format(new Date(partnerMood.timestamp), "h:mm a")}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center border border-dashed">
                      <User className="w-6 h-6 opacity-40" />
                    </div>
                    <p>{partnerName} hasn't shared their mood yet.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <Link href="/letters">
            <motion.div 
              className="col-span-1 bg-white border border-border p-6 rounded-3xl hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-6">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium">Letters</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {unreadLetters > 0 ? `You have ${unreadLetters} unread letters!` : "No new letters right now."}
              </p>
            </motion.div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-serif text-lg text-primary font-medium">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className={cn("p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-3 hover:bg-white", action.color)}>
                    <action.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-lg text-primary font-medium flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Shared Goals
            </h3>
            <div className="bg-white border border-border rounded-3xl p-6 space-y-3">
              {bucketList.map((goal, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className={cn("w-3 h-3", goal.completed ? "text-emerald-500" : "text-muted-foreground/30")} />
                  <span>{goal.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
