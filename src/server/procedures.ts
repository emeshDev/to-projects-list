import { j } from "./__internals/j";
import { currentUser } from "@clerk/nextjs/server";
import { HTTPException } from "hono/http-exception";

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */

const authMiddleware = j.middleware(async ({ c, next }) => {
  try {
    const auth = await currentUser();

    if (!auth) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    // Pass auth info ke next middleware/handler
    return next({
      user: {
        id: auth.id,
        email: auth.emailAddresses[0]?.emailAddress,
        name: `${auth.firstName} ${auth.lastName}`,
      },
    });
  } catch (error) {
    console.error("Auth error:", error);
    throw new HTTPException(401, { message: "Unauthorized" });
  }
});

// Buat rate limit store
const rateLimit = new Map<string, { count: number; lastReset: number }>();

const WINDOW_MS = 60 * 1000; // 1 menit
const MAX_REQUESTS = 10; //

const rateLimitMiddleware = j.middleware(async ({ c, next }) => {
  const ip = c.req.header("x-forwarded-for") || "unknown";
  const now = Date.now();

  const userLimit = rateLimit.get(ip) || { count: 0, lastReset: now };

  if (now - userLimit.lastReset >= WINDOW_MS) {
    userLimit.count = 0;
    userLimit.lastReset = now;
  }

  userLimit.count++;
  rateLimit.set(ip, userLimit);

  if (userLimit.count > MAX_REQUESTS) {
    throw new HTTPException(429, {
      message: "Too many requests, please try again later.",
    });
  }

  c.header("X-RateLimit-Limit", MAX_REQUESTS.toString());
  c.header(
    "X-RateLimit-Remaining",
    (MAX_REQUESTS - userLimit.count).toString()
  );
  c.header("X-RateLimit-Reset", (userLimit.lastReset + WINDOW_MS).toString());

  // Pass context to next middleware
  return next({
    rateLimit: {
      limit: MAX_REQUESTS,
      current: userLimit.count,
      remaining: MAX_REQUESTS - userLimit.count,
      reset: userLimit.lastReset + WINDOW_MS,
    },
  });
});

export const baseProcedure = j.procedure;
export const publicProcedure = baseProcedure.use(rateLimitMiddleware);
export const privateProcedure = publicProcedure.use(authMiddleware);
