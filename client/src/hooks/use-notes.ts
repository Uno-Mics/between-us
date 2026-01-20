import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type NoteResponse, type NoteInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function useNotes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const identity = localStorage.getItem("user_identity");

  const query = useQuery({
    queryKey: [api.notes.list.path],
    queryFn: async () => {
      const res = await apiRequest("GET", api.notes.list.path);
      return api.notes.list.responses[200].parse(await res.json());
    },
    refetchInterval: 3000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: NoteInput) => {
      if (!identity) throw new Error("No identity");
      const res = await apiRequest(api.notes.create.method, api.notes.create.path, {
        ...data,
        authorName: identity
      });
      return api.notes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
      toast({ description: "Note posted" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(api.notes.delete.method, api.notes.delete.path.replace(":id", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
    },
  });

  return {
    notes: query.data || [],
    isLoading: query.isLoading,
    createNote: createMutation.mutate,
    isCreating: createMutation.isPending,
    deleteNote: deleteMutation.mutate,
  };
}
