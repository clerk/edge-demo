// import requireSession from '../../utils/middleware';
//
// export default requireSession((req, res, next) => {
//     if(req.path === '/api/edge') {
//         res.send(req.session.userId);
//         return
//     }
//     next();
// })

export default (req, res, next) => {
    res.setHeader('x-edge', '1')
    // if(req.path === '/api/edge') {
    //     res.send(req.session.userId);
    //     return
    // }
    next();
}