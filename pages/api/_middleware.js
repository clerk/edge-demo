import requireSession from '../../utils/middleware';

export default requireSession((req, res, next) => {
        res.send(req.session.userId);
})
