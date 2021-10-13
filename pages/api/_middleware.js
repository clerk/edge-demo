import requireSession from '../../utils/middleware';

export default requireSession((req, res, next) => {
        res.json(req.session);
})
