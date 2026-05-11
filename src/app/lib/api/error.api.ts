export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong"
): string {
  if (err instanceof Error) return err.message;

  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err
  ) {
    const e = err as {
      response?: { data?: { message?: string | string[] } };
    };

    const msg = e.response?.data?.message;

    if (msg) {
      return Array.isArray(msg) ? msg.join(", ") : msg;
    }
  }

  return fallback;
}