import { createContext, useContext, useState, ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type AuthRequest, type AuthResponse, type RegisterRequest } from "@shared/routes";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  key: string | null;
  user: AuthResponse | null;
  currentPartner: string | null;
  setPartner: (name: string) => void;
  isAuthenticated: boolean;
  login: (key: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [key, setKey] = useState<string | null>(() => localStorage.getItem("couple_key"));
  const [currentPartner, setCurrentPartner] = useState<string | null>(() => localStorage.getItem("user_identity"));
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery<AuthResponse | null>({
    queryKey: ["/api/auth/me", key],
    queryFn: async () => {
      if (!key) return null;
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (!res.ok) {
        localStorage.removeItem("couple_key");
        localStorage.removeItem("user_identity");
        setKey(null);
        setCurrentPartner(null);
        return null;
      }
      return await res.json();
    },
    enabled: !!key,
  });

  const setPartner = (name: string) => {
    localStorage.setItem("user_identity", name);
    setCurrentPartner(name);
  };

  const loginMutation = useMutation({
    mutationFn: async (data: AuthRequest) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid Couple Key");
        throw new Error("Failed to login");
      }

      return await res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("couple_key", data.key);
      setKey(data.key);
      queryClient.setQueryData(["/api/auth/me", data.key], data);
      toast({
        title: "Key Validated",
        description: "Now please tell us who you are.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: error.message,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const res = await fetch(api.auth.register.path, {
        method: api.auth.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error("Failed to create new space");
      return await res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("couple_key", data.key);
      setKey(data.key);
      queryClient.setQueryData(["/api/auth/me", data.key], data);
      toast({
        title: "Space Created",
        description: `Your new shared space for ${data.name1} & ${data.name2} is ready.`,
      });
    },
  });

  const logout = () => {
    localStorage.removeItem("couple_key");
    localStorage.removeItem("user_identity");
    setKey(null);
    setCurrentPartner(null);
    queryClient.setQueryData(["/api/auth/me", key], null);
    setLocation("/login");
    toast({
      description: "You have left the space.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        key,
        user: user || null,
        currentPartner,
        setPartner,
        isAuthenticated: !!key && !!currentPartner,
        login: async (k) => loginMutation.mutateAsync({ key: k }),
        register: async (data) => registerMutation.mutateAsync(data),
        logout,
        isLoading: isUserLoading || loginMutation.isPending || registerMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
