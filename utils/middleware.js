// console.log("CRYPTO:", crypto);

export default function requireSession(handler) {
    return async function (req, res, next) {
        try {
            const cookieToken = req.cookies["__session"];

            let headerToken;
            if (req.headers) {
                headerToken =
                    req.headers["Authorization"] ||
                    req.headers["authorization"];
            }

            if (!cookieToken && !headerToken) {
                return res.status(401).send("Missing session token");
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
                return res.status(401).send("Invalid token");
            }

            // @ts-ignore
            req.session = { id: sessionClaims.sid, userId: sessionClaims.sub };

            handler(req, res, next);
        } catch (e) {
            console.log(e);
            res.status(401).send(e.toString());
        }
    };
}

async function verifyToken(token) {
    try {
        const key = await loadPublicKey();

        return await verifyJwt(key, token);
    } catch (e) {
        throw e;
    }
}

async function loadPublicKey() {
    // load the jwt key from env
    const key = process.env.CLERK_JWT_KEY;
    if (!key) {
        throw new Error("Missing jwt key");
    }

    // parse the public key to a CryptoKey:
    // taken from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#subjectpublickeyinfo_import

    // // base64 decode the string to get the binary data
    // const binaryDerString = atob(pubKey);

    // // convert from a binary string to an ArrayBuffer
    // const binaryDer = str2ab(binaryDerString);

    // Next.js in development mode currently cannot parse PEM, but it can
    // parse JWKs. This is a simple way to convert our PEM keys to JWKs
    // until the bug is resolved.

    const rsaPrefix = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA";
    const rsaSuffix = "IDAQAB";

    const jwk = {
        kty: "RSA",
        n: key
            .slice(rsaPrefix.length, rsaSuffix.length * -1)
            .replace(/\+/g, "-")
            .replace(/\//g, "_"),
        e: "AQAB",
    };

    // construct the CryptoKey
    return await crypto.subtle.importKey(
        "jwk",
        jwk,
        {
            name: "RSASSA-PKCS1-v1_5",
            hash: "SHA-256",
        },
        true,
        ["verify"]
    );
}

function decodeJwt(token) {
    const parts = token.split(".");
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    const signature = atob(parts[2].replace(/_/g, "/").replace(/-/g, "+"));
    return {
        header: header,
        payload: payload,
        signature: signature,
        raw: { header: parts[0], payload: parts[1], signature: parts[2] },
    };
}

async function verifyJwt(key, token) {
    const decodedToken = decodeJwt(token);

    // verify exp+nbf claims
    if (isExpired(decodedToken)) {
        return false;
    }

    // verify signature
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

// Convert a string into an ArrayBuffer from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function isExpired(decodedToken) {
    const claims = decodedToken.payload;
    const now = Date.now().valueOf() / 1000;

    if (typeof claims.exp !== "undefined" && claims.exp < now) {
        return true;
    }

    return typeof claims.nbf !== "undefined" && claims.nbf > now;
}
