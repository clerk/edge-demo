import requireSession from '../../utils/middleware';

export default requireSession((req, res, next) => {
        if (req.path === '/api/hello') {
                next();
        } else {
                res.status(200).json(req.session);
        }
})
