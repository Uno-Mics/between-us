import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type JournalResponse, type JournalInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function useJournal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: [api.journal.list.path],
    queryFn: async () => {
      const res = await apiRequest("GET", api.journal.list.path);
      return api.journal.list.responses[200].parse(await res.json());
    },
    refetchInterval: 3000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: JournalInput) => {
      const res = await apiRequest(api.journal.create.method, api.journal.create.path, data);
      return api.journal.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.journal.list.path] });
      toast({ description: "Journal entry saved" });
    },
    onError: () => {
      toast({ variant: "destructive", description: "Could not save entry" });
    },
  });

  return {
    entries: query.data || [],
    isLoading: query.isLoading,
    createEntry: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
