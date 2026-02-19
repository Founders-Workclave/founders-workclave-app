// lib/api/handleError.ts
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

export function isServerError(err: unknown): boolean {
  if (err instanceof Error) {
    return (
      err.message.includes("500") ||
      err.message.includes("502") ||
      err.message.includes("503") ||
      err.message.includes("504")
    );
  }
  return false;
}

export function isNetworkError(err: unknown): boolean {
  if (err instanceof Error) {
    return (
      err.message.includes("Failed to fetch") ||
      err.message.includes("Network Error") ||
      err.message.includes("ERR_NETWORK")
    );
  }
  return false;
}

export function getUserFriendlyError(err: unknown): string {
  if (isNetworkError(err))
    return "No internet connection. Please check your network.";
  if (isServerError(err))
    return "Service temporarily unavailable. Please try again later.";
  return "Something went wrong. Please try again.";
}
