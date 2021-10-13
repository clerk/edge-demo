// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { requireSession } from '@clerk/clerk-sdk-node';

function handler(req, res) {
    res.status(200).json(req.session);
}

export default requireSession(handler);
