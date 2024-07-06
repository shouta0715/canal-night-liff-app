import liff from "@line/liff";
import { QueryClientProvider, useSuspenseQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { getInitialClientState } from "@/lib/client";

const liffId = import.meta.env.VITE_LIFF_ID;

const getLiff = async () => {
  await liff.init({ liffId });
  const isLoggedIn = liff.isLoggedIn();

  if (!isLoggedIn) {
    liff.login();
  }

  const user = await liff.getProfile();

  return { isLoggedIn, user };
};

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={getInitialClientState()}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
  );
}

export const LineAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useSuspenseQuery({
    queryFn: getLiff,
    queryKey: ["liff"],
  });

  return children;
};
