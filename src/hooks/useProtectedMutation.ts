// hooks/useProtectedMutation.ts
import { useAuth } from "@clerk/nextjs";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

export function useProtectedMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<Response>,
  config?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      try {
        const token = await getToken();
        const res = await mutationFn(variables);

        if (!res.ok) {
          throw new Error("Mutation failed");
        }

        const data = await res.json();
        return data;
      } catch (error) {
        console.error("Mutation error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    ...config,
  });
}
