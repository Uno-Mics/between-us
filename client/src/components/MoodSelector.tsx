import { cn } from "@/lib/utils";
import { type MoodResponse as Mood } from "@shared/routes";
import { Sun, Cloud, Moon, Heart, Coffee, BatteryCharging, Zap, CloudRain } from "lucide-react";
import { useState } from "react";

const MOODS = [
  { id: "happy", label: "Happy", icon: Sun, color: "bg-amber-100 text-amber-600 border-amber-200" },
  { id: "calm", label: "Calm", icon: Coffee, color: "bg-stone-100 text-stone-600 border-stone-200" },
  { id: "romantic", label: "Loving", icon: Heart, color: "bg-rose-100 text-rose-600 border-rose-200" },
  { id: "tired", label: "Tired", icon: BatteryCharging, color: "bg-slate-100 text-slate-600 border-slate-200" },
  { id: "sad", label: "Low", icon: CloudRain, color: "bg-indigo-100 text-indigo-600 border-indigo-200" },
  { id: "excited", label: "Excited", icon: Zap, color: "bg-orange-100 text-orange-600 border-orange-200" },
];

interface MoodSelectorProps {
  currentMood?: Mood | null;
  onSelect: (mood: { status: string; color: string; icon: string; context?: string }) => void;
  isUpdating: boolean;
}

export function MoodSelector({ currentMood, onSelect, isUpdating }: MoodSelectorProps) {
  const [selectedId, setSelectedId] = useState(currentMood?.status);
  const [context, setContext] = useState(currentMood?.context || "");

  const handleSelect = (mood: typeof MOODS[0]) => {
    setSelectedId(mood.id);
    onSelect({
      status: mood.id,
      color: mood.color,
      icon: mood.id, // Using ID as icon name reference
      context: context
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {MOODS.map((mood) => {
          const isSelected = selectedId === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => handleSelect(mood)}
              disabled={isUpdating}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300",
                isSelected 
                  ? cn(mood.color, "shadow-md scale-105 ring-2 ring-offset-2 ring-offset-background ring-primary/20") 
                  : "bg-white border-border hover:border-primary/30 hover:bg-secondary/20"
              )}
            >
              <mood.icon className={cn("w-6 h-6 mb-2", isSelected ? "animate-pulse" : "opacity-70")} />
              <span className="text-xs font-medium">{mood.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="relative">
        <textarea
          placeholder="Add a little context (optional)..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
          onBlur={() => selectedId && onSelect({
             // Re-trigger update on blur if mood is selected
             ...MOODS.find(m => m.id === selectedId)!,
             status: selectedId,
             icon: selectedId,
             context
          })}
          className="w-full p-4 rounded-xl bg-white border border-border focus:ring-2 focus:ring-primary/10 focus:border-primary/50 outline-none resize-none text-sm transition-all"
          rows={2}
        />
      </div>
    </div>
  );
}
