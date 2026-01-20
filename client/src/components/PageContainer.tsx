import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { motion } from "framer-motion";

export function PageContainer({ children, title, subtitle }: { children: ReactNode, title?: string, subtitle?: string }) {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-foreground">
      <Navigation />
      <main className="md:pl-64 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-24 md:py-12">
          {(title || subtitle) && (
            <div className="mb-8 md:mb-12">
              {title && (
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-serif font-medium text-primary mb-2"
                >
                  {title}
                </motion.h1>
              )}
              {subtitle && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground font-light text-lg"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
