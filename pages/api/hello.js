// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withSession } from "@clerk/clerk-sdk-node";
import { getVercelRegion } from "../../utils/vercelRegion";

const authTimer = (handler) => {
  return (req, res) => {
    req.authStart = new Date().getTime();
    return handler(req, res);
  };
};

export default authTimer(
  withSession((req, res) => {
    const authTime = new Date().getTime() - req.authStart;
    console.log("hmm", req.headers);
    console.log("hmm", res.headers);
    res.status(200).json({
      ...req.session,
      authenticationTime: authTime,
      responseRegion: getVercelRegion(req.headers["x-vercel-id"]),
      test2: req.headers,
    });
  })
);
