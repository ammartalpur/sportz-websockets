import arcjet, { detectBot, slidingWindow, shield } from "@arcjet/node";

const arcjetKey = process.env.ARCJET_KEY;
const arcjetMode = process.env.ARCJET_MODE === "DRY_RUN" ? "DRY_RUN" : "LIVE";

if (!arcjetKey) throw new Error("ARCJET KEY Enviroment variable is missing...");

export const httpArcJet = arcjetKey ? arcjet({
  key: arcjetKey,
  rules: [
    shield({ mode: arcjetMode }),
    detectBot({ mode: arcjetMode, allow: ['GATAGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'] }),
    slidingWindow({mode: arcjetMode , interval :'10s' , max:50})
  ]
}) : null;

export const wsArcJet = arcjetKey
  ? arcjet({
      key: arcjetKey,
      rules: [
        shield({ mode: arcjetMode }),
        detectBot({
          mode: arcjetMode,
          allow: ["GATAGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
        }),
        slidingWindow({ mode: arcjetMode, interval: "2s", max: 5 }),
      ],
    })
  : null;


export function securityMiddleware() { 
  return async (req, res, next) => { 
    if (!httpArcJet) return next()

    try {
      const decision = await httpArcJet.protect(req)
      if (decision.isDenied()) { 
        if (decision.reason.isRateLimit()) { 
          return res.status(429).json({error: "Too many requests."})
        }

        return res.status(429).json({error: "Forbidden."})
      }
    } catch(e) { 
      console.error('Arcjet middleware error', e)
      return res.status(503).json({error: "Service Unavailable"})
    }

    next();
  }
}