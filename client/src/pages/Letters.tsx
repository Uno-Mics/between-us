import { PageContainer } from "@/components/PageContainer";
import { useLetters } from "@/hooks/use-letters";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Envelope } from "@/components/Envelope";
import { useState } from "react";
import { Loader2, PenLine, Archive } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function LettersPage() {
  const { letters, createLetter, openLetter, archiveLetter, isLoading, isCreating } = useLetters();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [readingId, setReadingId] = useState<string | null>(null);

  const activeLetters = letters.filter(l => !l.isArchived);
  const archivedLetters = letters.filter(l => l.isArchived);

  const handleCreate = async () => {
    if (!content.trim()) return;
    await createLetter({ content });
    setContent("");
    setIsOpen(false);
  };

  const handleEnvelopeClick = (letter: typeof letters[0]) => {
    if (letter.isSealed) {
      openLetter(letter.id);
    } else {
      setReadingId(letter.id);
    }
  };

  const letterToRead = letters.find(l => l.id === readingId);

  return (
    <PageContainer title="Letters" subtitle="Sealed messages for special moments.">
      
      {/* Compose Action */}
      <div className="mb-8">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-base shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5">
              <PenLine className="w-5 h-5 mr-2" /> Write a Letter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-[#FDFCF8] border-none rounded-2xl shadow-2xl p-0 overflow-hidden">
            <div className="p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="font-serif text-2xl font-medium">Write a Letter</DialogTitle>
              </DialogHeader>
              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="My dearest..."
                className="min-h-[400px] border-none bg-transparent focus:ring-0 text-lg leading-loose font-serif resize-none p-0 placeholder:text-muted-foreground/40"
              />
            </div>
            <div className="bg-secondary/30 p-4 flex justify-end">
              <Button 
                onClick={handleCreate} 
                disabled={!content.trim() || isCreating}
                className="rounded-xl"
              >
                {isCreating ? "Sealing..." : "Seal & Send"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Letters Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : activeLetters.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl text-muted-foreground">
          No letters yet. Write one to surprise your partner.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeLetters.map((letter) => (
            <Envelope 
              key={letter.id} 
              letter={letter} 
              onClick={() => handleEnvelopeClick(letter)} 
            />
          ))}
        </div>
      )}

      {/* Reading Modal */}
      <Dialog open={!!readingId} onOpenChange={(open) => !open && setReadingId(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#FDFCF8] border-none rounded-xl p-8 md:p-12 shadow-2xl">
          {letterToRead && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center text-sm text-muted-foreground border-b border-border pb-4 mb-4">
                <span>{format(new Date(letterToRead.createdAt), "MMMM do, yyyy")}</span>
                <span>Opened {letterToRead.openedAt ? format(new Date(letterToRead.openedAt), "MMM d") : "just now"}</span>
              </div>
              
              <div className="font-serif text-lg md:text-xl leading-loose text-foreground/90 whitespace-pre-wrap">
                {letterToRead.content}
              </div>

              <div className="pt-8 flex justify-center">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    archiveLetter(letterToRead.id);
                    setReadingId(null);
                  }}
                  className="text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-xl"
                >
                  <Archive className="w-4 h-4 mr-2" /> Archive Letter
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
