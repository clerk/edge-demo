import { jwtVerify } from 'jose/jwt/verify';
import { importJWK } from 'jose/key/import'

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
                throw new Error('Missing session token')
            }

            // @ts-ignore
            req.session = {id: sessionClaims.sid, userId: sessionClaims.sub};

            // next();
            handler(req, res, next)
        } catch (error) {
            console.log('Error', error)
            res.status(500).send(error)
        }
    }
}

async function verifyToken(token) {
    if (!token) {
        return;
    }
    console.log('3')
    const jwk = await retrieveJWK()
    console.log('4')
    const pubKey = importJWK(jwk)

    console.log(token)


    // const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', process.env.CLERK_PUBLIC_KEY, token.split('.')[2], token.split('.')[1])
    // console.log(ok)
    // if (!ok) {
    //     throw new Error('Not ok')
    // }

    const { payload } = await jwtVerify(token, pubKey, {algorithms: ['RS256']})

    if (!payload.iss || !(payload.iss?.lastIndexOf('https://clerk.', 0) === 0)) {
        throw new Error(`Invalid issuer: ${payload.iss}`)
    }

    return payload
}

async function retrieveJWK() {
    const pubKey = process.env.CLERK_PUBLIC_KEY.replace(/\\n/g, '\n');
    if (!pubKey) {
        throw new Error('Missing public key')
    }

    console.log(pubKey)

    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pubKey.substring(pemHeader.length, pubKey.length - pemFooter.length);
    console.log(pemContents)
    // base64 decode the string to get the binary data
    const binaryDerString = atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

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

    return crypto.subtle.exportKey('jwk', key);
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

