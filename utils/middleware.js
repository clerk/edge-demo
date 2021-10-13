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
    try {
        const jwk = await retrieveJWK()
        console.log('retrieveJWK(): ', jwk)

        const pubKey = importJWK({
            use: "sig",
            kty: "RSA",
            kid: "ins_1zRcrQ8D4VOJvd9cxqoTW2iCTis",
            alg: "RS256",
            n: "t3cmtkqQSWgUGiTz2j85WDHpozSHs9wAUEgzTnBQTEq7LBPQ_zSn4tHxI-7IO7J_EdjLI77dwh55DllEchY7boXR-nuuu56itC-pJq9GMrPrnFo_33cl0eJrEBXq1OBw65H0_GP4boHelKt1gJF9-kEiGE_En1CqYkso3-ARJZoRZwSty3pCe41iUJxzTaPnMbsUbGRQFDjAzfx3CpsPUloJr7-iscgkwZvkchc7b3DNyflOtVms20fNLN9COv0D4U7eu7ylmLKK5FZ5j05sySA9Ztsj3Vk5gKrKud1ESJ7dMYrOuKr5JPI_lhfO_NhajOUwXAex4YM6crJpyLNG7Q",
            e: "AQAB"
        })
        console.log('after jose import jwk', pubKey)
        console.log(token)

        // const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', process.env.CLERK_PUBLIC_KEY, token.split('.')[2], token.split('.')[1])
        // console.log(ok)
        // if (!ok) {
        //     throw new Error('Not ok')
        // }

        const {payload} = await jwtVerify(token, pubKey, {algorithms: ['RS256']})

        console.log('after verify', payload)

        if (!payload.iss || !(payload.iss?.lastIndexOf('https://clerk.', 0) === 0)) {
            throw new Error(`Invalid issuer: ${payload.iss}`)
        }

        return payload
    } catch (e) {
        console.log('verify token error', e)
        throw new Error(e)
    }
}

// parse a public key in PEM format and construct a CryptoKey JWK
async function retrieveJWK() {
    try {
        const pubKey = process.env.CLERK_PUBLIC_KEY.replace(/\\n/g, '\n');
        if (!pubKey) {
            throw new Error('Missing public key')
        }

        console.log(pubKey)

        // fetch the part of the PEM string between header and footer
        // taken from
        // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#subjectpublickeyinfo_import
        const pemHeader = "-----BEGIN PUBLIC KEY-----";
        const pemFooter = "-----END PUBLIC KEY-----";
        const pemContents = pubKey.substring(pemHeader.length, pubKey.length - pemFooter.length);

        console.log('pemContents: ', pemContents)

        // base64 decode the string to get the binary data
        const binaryDerString = atob(pemContents);
        console.log('binaryDerString: ', binaryDerString)

        // convert from a binary string to an ArrayBuffer
        const binaryDer = str2ab(binaryDerString);
        console.log('binaryDer (ArrayBuffer): ', binaryDer.toString());
        console.log('binaryDer (ArrayBuffer.byteLength): ', binaryDer.byteLength);

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

        console.log('crypto.subtle.importKey(): ', key)

        const exportedkey = crypto.subtle.exportKey('jwk', key);
        console.log('crypto.sutble.exportKey(): ', exportedkey)
        console.log('crypto.sutble.exportKey() (.jwk field) ', exportedkey.jwk)

        return exportedkey
    } catch (e) {
        console.log('retrieve jwk error', e)
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

