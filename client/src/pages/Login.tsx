import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, Sparkles, ArrowRight, HeartHandshake, Copy, Check, User } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  key: z.string().min(1, "Please enter your couple key"),
});

const registerSchema = z.object({
  name1: z.string().min(1, "Your name is required"),
  name2: z.string().min(1, "Partner's name is required"),
});

export default function Login() {
  const { login, register, isLoading, user, currentPartner, setPartner } = useAuth();
  const [mode, setMode] = useState<"login" | "intro" | "register" | "key-reveal" | "user-select">("intro");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { key: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name1: "", name2: "" },
  });

  useEffect(() => {
    // If we have a key but no identity, show selection
    if (user && !currentPartner && mode !== "key-reveal") {
      setMode("user-select");
    }
  }, [user, currentPartner, mode]);

  const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data.key);
    } catch (e) {
      // Error handled in hook
    }
  };

  const onRegisterSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      const res = await register(data);
      setGeneratedKey(res.key);
      setMode("key-reveal");
    } catch (e) {
      // Error handled in hook
    }
  };

  const selectIdentity = (name: string) => {
    setPartner(name);
    setMode("key-reveal");
  };

  const copyToClipboard = () => {
    const keyToCopy = generatedKey || user?.key || "";
    if (keyToCopy) {
      navigator.clipboard.writeText(keyToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        description: "Key copied to clipboard!",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8] p-6 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/40 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/20 blur-[100px]" />

      <AnimatePresence mode="wait">
        {(mode === "key-reveal" || (generatedKey && mode === "key-reveal")) && (
          <motion.div
            key="key-reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full relative z-10 text-center space-y-8 p-8 bg-white rounded-3xl shadow-xl shadow-stone-200/50"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-primary">
                {generatedKey ? "Your Space is Ready!" : `Welcome, ${currentPartner}!`}
              </h2>
              <p className="text-muted-foreground">
                {generatedKey 
                  ? "This key is the ONLY way to access your space. Share it with your partner and keep it safe."
                  : "Here is your couple key. Keep it safe as it's the only way to access your shared space."}
              </p>
            </div>

            <div className="relative group">
              <div className="bg-secondary/50 p-6 rounded-2xl font-mono text-2xl tracking-[0.2em] text-primary font-bold border-2 border-dashed border-primary/20">
                {generatedKey || user?.key}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 hover:bg-white/50"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <Button 
              size="lg"
              className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90"
              onClick={() => window.location.href = "/"}
            >
              Enter Space
            </Button>
          </motion.div>
        )}

        {mode === "user-select" && user && !currentPartner && (
          <motion.div
            key="user-select"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full relative z-10 text-center space-y-8 p-8 bg-white rounded-3xl shadow-xl shadow-stone-200/50"
          >
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-medium text-primary">Who are you?</h2>
              <p className="text-muted-foreground">Select your name to personalize your experience.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[user.name1, user.name2].map((name) => (
                <button
                  key={name}
                  onClick={() => name && selectIdentity(name)}
                  className="flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-transparent bg-secondary/30 hover:bg-secondary/50 hover:border-primary/20 transition-all group"
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <span className="font-serif text-lg font-medium text-primary">{name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {mode === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md w-full relative z-10 text-center space-y-8"
          >
            <div>
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg shadow-stone-200/50 flex items-center justify-center mx-auto mb-8 transform rotate-3">
                <HeartHandshake className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-serif text-4xl md:text-5xl text-primary font-medium tracking-tight mb-4">
                Between Us
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                A private digital sanctuary for just the two of you. 
                Share moods, leave notes, and write letters in a quiet space.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <Button 
                size="lg" 
                className="w-full h-14 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                onClick={() => setMode("login")}
              >
                Enter Space <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                className="w-full h-14 text-base font-medium rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary/50"
                onClick={() => setMode("register")}
                disabled={isLoading}
              >
                Create New Space
              </Button>
            </div>
          </motion.div>
        )}

        {mode === "register" && (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-sm w-full relative z-10 space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="font-serif text-3xl font-medium text-primary">Start your space</h2>
              <p className="text-sm text-muted-foreground">Enter your names to create a private sanctuary.</p>
            </div>

            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="name1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Alex" className="h-12 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="name2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner's Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Sam" className="h-12 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/20"
                    disabled={isLoading}
                  >
                    {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : "Generate Private Key"}
                  </Button>
                  <button
                    type="button"
                    className="w-full text-xs text-muted-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setMode("intro")}
                  >
                    ← Back
                  </button>
                </div>
              </form>
            </Form>
          </motion.div>
        )}

        {mode === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-sm w-full relative z-10 space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
                <KeyRound className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-foreground">Unlock your space</h2>
              <p className="text-sm text-muted-foreground">Enter the unique key shared with your partner.</p>
            </div>

            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                <FormField
                  control={loginForm.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="h-14 text-center text-lg tracking-widest font-mono bg-white border-muted-foreground/20 focus:border-primary/50 focus:ring-primary/20 rounded-xl" 
                          placeholder="XXXXXX"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all shadow-lg shadow-primary/20"
                    disabled={isLoading}
                  >
                    {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : "Unlock"}
                  </Button>
                  <button
                    type="button"
                    className="w-full text-xs text-muted-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setMode("intro")}
                  >
                    ← Back
                  </button>
                </div>
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
