import { PageContainer } from "@/components/PageContainer";
import { useNotes } from "@/hooks/use-notes";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2, Trash2, SendHorizontal } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function NotesPage() {
  const { currentPartner } = useAuth();
  const { notes, createNote, deleteNote, isCreating, isLoading } = useNotes();
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentPartner) return;
    createNote({ content, authorName: currentPartner || "" } as any, {
      onSuccess: () => setContent("")
    });
  };

  return (
    <PageContainer title="Daily Notes" subtitle="Ephemeral thoughts that disappear in 24h.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Create Form */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-border sticky top-24">
            <h3 className="font-serif text-lg font-medium mb-4">Leave a note</h3>
            <Textarea
              placeholder="Thinking of you..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] resize-none border-0 bg-secondary/30 focus:ring-0 rounded-xl p-4 text-base mb-4 placeholder:text-muted-foreground/70"
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!content.trim() || isCreating}
                className="rounded-xl bg-primary hover:bg-primary/90"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4 mr-2" />}
                Post Note
              </Button>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="space-y-6">
          {isLoading ? (
             <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground"/></div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-3xl">
              No notes for today. Be the first to write one.
            </div>
          ) : (
            <AnimatePresence>
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-[#FCFBF8] p-6 rounded-2xl border border-border hover:shadow-md transition-all relative"
                >
                  <p className="font-serif text-lg text-foreground/90 italic mb-4 leading-relaxed">
                    "{note.content}"
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-primary/70">{note.authorName}</span>
                      <span>•</span>
                      <span>{format(new Date(note.createdAt), "h:mm a")}</span>
                    </div>
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 hover:text-destructive rounded-full transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
