import requireSession from '../../utils/middleware';

export default requireSession((req, res, next) => {
    if(req.path === '/api/edge') {
        res.send(req.session.userId);
        return
    }
    next();
})