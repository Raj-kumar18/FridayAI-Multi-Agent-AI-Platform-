import proxy from "express-http-proxy"

const proxyWithHeader = (serviceUrl) => {
    return proxy(serviceUrl, {
        proxyReqOptDecorator: (proxyReqOpt, srcReq) => {
            if (srcReq.user) {
                proxyReqOpt.headers['x-user-id'] = srcReq.user.userId
            }
            return proxyReqOpt
        }
    })
}
export default proxyWithHeader