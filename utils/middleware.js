export default function requireSession(handler) {
    return async function(req, res, next) {
        try {
            const cookieToken = req.cookies['__session'];
            console.log(`cookieToken: ${cookieToken}`);

            let headerToken;
            if (req.headers) {
                headerToken = (req.headers['Authorization'] || req.headers['authorization'])
                console.log(`headerToken: ${headerToken}`);
            }

            let sessionClaims;

            if (headerToken) {
                sessionClaims = await verifyToken(headerToken);
                console.log('1', sessionClaims)
            }

            // Try to verify token from cookie only if header is empty or failed to verify
            if (!sessionClaims && cookieToken) {
                sessionClaims = await verifyToken(cookieToken);
                console.log('2', sessionClaims)
            }

            if (!sessionClaims) {
                throw new Error('Missing session token or token invalid')
            }

            // @ts-ignore
            req.session = {id: sessionClaims.sid, userId: sessionClaims.sub};

            handler(req, res, next)
        } catch (error) {
            console.log('Error: ', error)
            res.status(500).send(error)
        }
    }
}

async function verifyToken(token) {
    if (!token) {
        return;
    }
    try {
      // load the public key from env
      const pubKey = process.env.CLERK_PUBLIC_KEY.replace(/\\n/g, '\n');
      if (!pubKey) {
          throw new Error('Missing public key')
      }

      // parse the public key to a CryptoKey:
      // fetch the part of the PEM string between header and footer
      // taken from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#subjectpublickeyinfo_import
      const pemHeader = "-----BEGIN PUBLIC KEY-----";
      const pemFooter = "-----END PUBLIC KEY-----";
      const pemContents = pubKey.substring(pemHeader.length, pubKey.length - pemFooter.length);

      // base64 decode the string to get the binary data
      const binaryDerString = atob(pemContents);

      // convert from a binary string to an ArrayBuffer
      const binaryDer = str2ab(binaryDerString);

      // construct the CryptoKey
      const key = await crypto.subtle.importKey(
          'spki',
          binaryDer,
          {
              name: 'RSASSA-PKCS1-v1_5',
              hash: 'SHA-256'
          },
          true,
          ['verify']
      );

      // verify token
      const decodedToken = decodeJwt(token);
      const encoder = new TextEncoder();
      const data = encoder.encode([decodedToken.raw.header, decodedToken.raw.payload].join('.'));
      const signature = new Uint8Array(Array.from(decodedToken.signature).map(c => c.charCodeAt(0)));
      const verified = crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, data)

      if (verified) {
        return JSON.parse(atob(data));
      } else {
        return;
      }
    } catch (e) {
        console.log('verify token error: ', e)
        throw new Error(e)
    }
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

function decodeJwt(token) {
  const parts = token.split('.');
  const header = JSON.parse(atob(parts[0]));
  const payload = JSON.parse(atob(parts[1]));
  const signature = atob(parts[2].replace(/_/g, '/').replace(/-/g, '+'));
  return {
    header: header,
    payload: payload,
    signature: signature,
    raw: { header: parts[0], payload: parts[1], signature: parts[2] }
  }
}

