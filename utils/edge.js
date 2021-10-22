export function withSession(handler, options) {
  const middleware = async (evt) => {
    try {
      const req = evt.request;
      const cookieToken = req.cookies["__session"];

      let headerToken;
      if (req.headers) {
        headerToken =
          req.headers["Authorization"] || req.headers["authorization"];
      }

      if (!cookieToken && !headerToken) {
        return handler(evt);
      }

      let sessionClaims;

      if (headerToken) {
        sessionClaims = await verifyToken(headerToken);
      }

      // Try to verify token from cookie only if header is empty or failed to verify
      if (!sessionClaims && cookieToken) {
        sessionClaims = await verifyToken(cookieToken);
      }

      if (!sessionClaims) {
        return handler(evt);
      }

      evt.request.session = {
        id: sessionClaims.sid,
        userId: sessionClaims.sub,
        verifyWithNetwork: async () => {
          const res = await fetch(
            `https://api.clerk.dev/v1/sessions/${sessionClaims.sid}/verify`,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${process.env.CLERK_API_KEY}`,
              },
              method: "post",
              body: `token=${encodeURIComponent(headerToken || cookieToken)}`,
            }
          );
          if (res.status !== 200) {
            throw new Error(res);
          }
          return res;
        },
      };
      return handler(evt);
    } catch (error) {
      return new Response(error.toString(), { status: 401 });
    }
  };
  // evt.respondWith needs to happen on the main thread
  return (event) => event.respondWith(middleware(event));
}

export function requireSession(handler, options) {
  const middleware = async (evt) => {
    try {
      const req = evt.request;
      const cookieToken = req.cookies["__session"];

      let headerToken;
      if (req.headers) {
        headerToken =
          req.headers["Authorization"] || req.headers["authorization"];
      }

      if (!cookieToken && !headerToken) {
        return new Response("Missing session token", { status: 401 });
      }

      let sessionClaims;

      if (headerToken) {
        sessionClaims = await verifyToken(headerToken);
      }

      // Try to verify token from cookie only if header is empty or failed to verify
      if (!sessionClaims && cookieToken) {
        sessionClaims = await verifyToken(cookieToken);
      }

      if (!sessionClaims) {
        return new Response("Invalid token", { status: 401 });
      }

      evt.request.session = {
        id: sessionClaims.sid,
        userId: sessionClaims.sub,
        verifyWithNetwork: async () => {
          const res = await fetch(
            `https://api.clerk.dev/v1/sessions/${sessionClaims.sid}/verify`,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${process.env.CLERK_API_KEY}`,
              },
              method: "post",
              body: `token=${encodeURIComponent(headerToken || cookieToken)}`,
            }
          );
          if (res.status !== 200) {
            throw new Error(res);
          }
          return res;
        },
      };

      return handler(evt);
    } catch (error) {
      return new Response(error.toString(), { status: 401 });
    }
  };
  // evt.respondWith needs to happen on the main thread
  return (event) => event.respondWith(middleware(event));
}

//////// util/jwt.js

export async function verifyToken(token) {
  const key = await loadPublicKey();
  return await verifyJwt(key, token);
}

/**
 *
 * Construct the RSA public key from the PEM retrieved from the CLERK_JWT_KEY environment variable.
 * You will find that at your application dashboard (https://dashboard.clerk.dev) under Settings ->  API keys
 *
 */
async function loadPublicKey() {
  const key = process.env.CLERK_JWT_KEY;
  if (!key) {
    throw new Error("Missing jwt key");
  }

  // Next.js in development mode currently cannot parse PEM, but it can
  // parse JWKs. This is a simple way to convert our PEM keys to JWKs
  // until the bug is resolved.

  const RSA_PREFIX = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA";
  const RSA_SUFFIX = "IDAQAB";

  // JWK https://datatracker.ietf.org/doc/html/rfc7517
  const jwk = {
    kty: "RSA",
    n: key
      .slice(RSA_PREFIX.length, RSA_SUFFIX.length * -1)
      .replace(/\+/g, "-")
      .replace(/\//g, "_"),
    e: "AQAB",
  };

  // Algorithm https://developer.mozilla.org/en-US/docs/Web/API/RsaHashedImportParams
  const algorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: "SHA-256",
  };

  // SubtleCrypto is available on v8 edge environments https://developer.mozilla.org/en-US/docs/Web/API/Crypto/subtle
  // Based on https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#subjectpublickeyinfo_import
  return await crypto.subtle.importKey("jwk", jwk, algorithm, true, ["verify"]);
}

function decodeJwt(token) {
  const [rawHeader, rawPayload, rawSignature] = token.split(".");
  // atob[https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob]
  // is available on the v8 edge environments
  const header = JSON.parse(atob(rawHeader));
  const payload = JSON.parse(atob(rawPayload));
  const signature = atob(rawSignature.replace(/_/g, "/").replace(/-/g, "+"));
  return {
    header,
    payload,
    signature,
    raw: { header: rawHeader, payload: rawPayload, signature: rawSignature },
  };
}

async function verifyJwt(key, token) {
  const decodedToken = decodeJwt(token);

  // verify exp+nbf claims
  if (isExpired(decodedToken)) {
    return false;
  }

  // verify signature
  // TextEncoder[https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder]
  // is available on v8 edge environments
  const encoder = new TextEncoder();
  const data = encoder.encode(
    [decodedToken.raw.header, decodedToken.raw.payload].join(".")
  );
  const signature = new Uint8Array(
    Array.from(decodedToken.signature).map((c) => c.charCodeAt(0))
  );

  const isVerified = crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    signature,
    data
  );
  if (!isVerified) {
    throw new Error("Failed to verify token");
  }

  return JSON.parse(atob(decodedToken.raw.payload));
}

function isExpired(decodedToken) {
  const claims = decodedToken.payload;
  const now = Date.now().valueOf() / 1000;

  if (typeof claims.exp !== "undefined" && claims.exp < now) {
    return true;
  }

  return typeof claims.nbf !== "undefined" && claims.nbf > now;
}
