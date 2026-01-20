import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type LetterResponse, type LetterInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function useLetters() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: [api.letters.list.path],
    queryFn: async () => {
      const res = await apiRequest("GET", api.letters.list.path);
      return api.letters.list.responses[200].parse(await res.json());
    },
    refetchInterval: 3000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: LetterInput) => {
      const res = await apiRequest(api.letters.create.method, api.letters.create.path, data);
      return api.letters.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.letters.list.path] });
      toast({ description: "Letter sealed and sent" });
    },
    onError: () => {
      toast({ variant: "destructive", description: "Could not send letter" });
    },
  });

  const openMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest(api.letters.open.method, api.letters.open.path.replace(":id", id));
      return api.letters.open.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.letters.list.path] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(api.letters.archive.method, api.letters.archive.path.replace(":id", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.letters.list.path] });
      toast({ description: "Letter archived" });
    },
  });

  return {
    letters: query.data || [],
    isLoading: query.isLoading,
    createLetter: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    openLetter: openMutation.mutateAsync,
    isOpening: openMutation.isPending,
    archiveLetter: archiveMutation.mutate,
  };
}
