// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { requireSession } from "@clerk/clerk-sdk-node";
import { getVercelRegion } from "../../utils/vercelRegion";

const authTimer = (handler) => {
  return (req, res) => {
    req.authStart = new Date().getTime();
    return handler(req, res);
  };
};

export default authTimer(
  requireSession((req, res) => {
    const authTime = new Date().getTime() - req.authStart;

    res.status(200).json({
      ...req.session,
      authenticationTime: authTime,
      responseRegion: getVercelRegion(res),
    });
  })
);
