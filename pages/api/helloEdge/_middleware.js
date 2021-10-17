import withSession from "../../../utils/middleware";
import { getVercelRegion } from "../../../utils/vercelRegion";

const authTimer = (handler) => {
  return (req, res, next) => {
    req.authStart = new Date().getTime();
    return handler(req, res, next);
  };
};

export default authTimer(
  withSession((req, res, next) => {
    const authTime = new Date().getTime() - req.authStart;

    res.status(200).json({
      ...req.session,
      authenticationTime: authTime,
      responseRegion: getVercelRegion(req.headers.get("x-vercel-id")),
    });
  })
);
