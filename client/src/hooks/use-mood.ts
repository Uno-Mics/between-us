import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type MoodResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function useMood() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const identity = localStorage.getItem("user_identity");

  const query = useQuery({
    queryKey: [api.mood.get.path],
    queryFn: async () => {
      const res = await apiRequest("GET", api.mood.get.path);
      const data = await res.json();
      return data as Record<string, MoodResponse>;
    },
    refetchInterval: 3000,
  });

  const updateMutation = useMutation({
    mutationFn: async (mood: Omit<MoodResponse, "timestamp" | "authorName">) => {
      if (!identity) throw new Error("No identity");
      const res = await apiRequest(api.mood.update.method, api.mood.update.path, {
        ...mood,
        authorName: identity
      });
      return api.mood.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.mood.get.path] });
      toast({ description: "Mood updated" });
    },
  });

  return {
    moods: query.data || {},
    isLoading: query.isLoading,
    updateMood: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
