import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Lock, MailOpen, Mail } from "lucide-react";
import { format } from "date-fns";
import type { LetterResponse as Letter } from "@shared/routes";

interface EnvelopeProps {
  letter: Letter;
  onClick: () => void;
}

export function Envelope({ letter, onClick }: EnvelopeProps) {
  const isSealed = letter.isSealed;

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative w-full aspect-[4/3] rounded-xl shadow-sm border transition-all duration-300 flex flex-col items-center justify-center p-6 group text-left",
        isSealed 
          ? "bg-[#F5F2ED] border-[#E6E0D6] shadow-md hover:shadow-lg" 
          : "bg-white border-border hover:border-primary/30"
      )}
    >
      {/* Wax Seal / Stamp */}
      {isSealed && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 shadow-inner">
          <Lock className="w-6 h-6 text-accent" />
        </div>
      )}

      {/* Content Preview if Open */}
      {!isSealed && (
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-primary/60">
            <MailOpen className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-medium">Opened</span>
          </div>
          <p className="font-serif text-lg leading-relaxed line-clamp-4 text-foreground/80 italic">
            "{letter.content}"
          </p>
        </div>
      )}

      {/* Footer Info */}
      <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center text-xs text-muted-foreground">
        <span>{format(new Date(letter.createdAt), "MMM d, yyyy")}</span>
        {isSealed && <span className="font-medium text-accent uppercase tracking-widest">Sealed</span>}
      </div>

      {/* Decorative lines for sealed envelope */}
      {isSealed && (
        <>
          <div className="absolute inset-0 border-t-[1px] border-black/5 rounded-xl pointer-events-none transform -skew-y-6 origin-top-left opacity-30" />
          <div className="absolute inset-0 border-b-[1px] border-black/5 rounded-xl pointer-events-none transform skew-y-6 origin-bottom-right opacity-30" />
        </>
      )}
    </motion.button>
  );
}
