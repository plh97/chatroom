module.exports = (ctx, next) => {
    next();
    console.log(12)
    const cookie = ctx.cookies.get('token')
    console.log(111, cookie)
    const whiteList = ['/api/login', '/api/register', '/api/message']
    if (whiteList.includes(ctx.url)) {
        return next();
    }
    if (tokenContainer.hasOwnProperty(cookie)) {
        // check token
        jwt.verify(cookie, privateKey, (err, token) => {
            if (err) {
                ctx.status = 401
                ctx.body = ({
                    code: 1,
                    message: 'token verify error'
                })
                return;
            }
            console.log('token verify success')
            next();
        });
    } else {
        ctx.status = 401
        ctx.body = ({
            code: 1,
            message: 'not login'
        })
    }
    next()
}