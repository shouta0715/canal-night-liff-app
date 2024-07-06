import { QueryClient } from "@tanstack/react-query";

export const getInitialClientState = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });
};
