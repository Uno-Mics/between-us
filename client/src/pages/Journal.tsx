import { PageContainer } from "@/components/PageContainer";
import { useJournal } from "@/hooks/use-journal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { format } from "date-fns";
import { Loader2, Plus, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function JournalPage() {
  const { entries, createEntry, isCreating, isLoading } = useJournal();
  const [content, setContent] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const handleSubmit = () => {
    if (!content.trim() || !date) return;
    createEntry({
      content,
      date: format(date, "yyyy-MM-dd"),
    }, {
      onSuccess: () => setContent("")
    });
  };

  return (
    <PageContainer title="Shared Journal" subtitle="Documenting your journey together.">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Entry Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-lg font-medium">New Entry</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal rounded-xl",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="rounded-xl border shadow-lg"
                    />
                  </PopoverContent>
                </Popover>
             </div>
             
             <Textarea 
               value={content}
               onChange={(e) => setContent(e.target.value)}
               placeholder="Today we..."
               className="min-h-[200px] bg-secondary/20 border-0 focus:ring-0 resize-none rounded-xl p-4 text-base mb-4 font-serif leading-relaxed"
             />

             <div className="flex justify-end">
               <Button 
                 onClick={handleSubmit}
                 disabled={!content.trim() || isCreating || !date}
                 className="rounded-xl bg-primary hover:bg-primary/90"
               >
                 {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                 Add Entry
               </Button>
             </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-serif text-xl mt-8 mb-4">Recent Memories</h3>
            {isLoading ? (
               <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : entries.length === 0 ? (
              <p className="text-muted-foreground italic">Your journal is empty.</p>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="relative pl-8 border-l-2 border-primary/20 pb-8 last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">
                    {format(new Date(entry.date), "MMMM do, yyyy")}
                  </span>
                  <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                    <p className="font-serif text-foreground/90 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar stats / Calendar View */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-[#EFECE6] p-6 rounded-3xl sticky top-24">
             <h4 className="font-serif text-lg mb-4 font-medium">Calendar</h4>
             <Calendar
               mode="single"
               selected={new Date()}
               className="rounded-2xl bg-white shadow-sm w-full flex justify-center py-4"
             />
             <div className="mt-6 text-center">
               <p className="text-sm text-muted-foreground">
                 <span className="font-bold text-primary text-lg">{entries.length}</span> memories saved so far.
               </p>
             </div>
           </div>
        </div>

      </div>
    </PageContainer>
  );
}
