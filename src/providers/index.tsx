import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getInitialClientState } from "@/lib/client";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={getInitialClientState()}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
