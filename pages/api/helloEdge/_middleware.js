import requireSession from '../../../utils/middleware';

export default requireSession((req, res, next) => {
        res.status(200).json(req.session);
})
