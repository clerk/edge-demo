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

    console.log(req.geo);
    console.log(req);

    res.status(200).json({
      ...req.session,
      authenticationTime: authTime,
      responseRegion: getVercelRegion(req),
    });
  })
);
