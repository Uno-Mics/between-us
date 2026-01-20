import { PageContainer } from "@/components/PageContainer";
import { MoodSelector } from "@/components/MoodSelector";
import { useMood } from "@/hooks/use-mood";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function MoodPage() {
  const { user, currentPartner } = useAuth();
  const { moods, isLoading, updateMood, isUpdating } = useMood();
  
  const myMood = currentPartner ? moods[currentPartner] : null;

  return (
    <PageContainer title="How are you?" subtitle={`Share how you're feeling, ${currentPartner}.`}>
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-border">
          <MoodSelector 
            currentMood={myMood} 
            onSelect={(data) => updateMood({ ...data, authorName: currentPartner || "" } as any)} 
            isUpdating={isUpdating} 
          />
        </div>
      )}
    </PageContainer>
  );
}
