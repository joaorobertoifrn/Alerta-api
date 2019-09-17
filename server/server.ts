import { environment } from './../common/environment';
import * as restfy from 'restify'



export class Server {

    application: restfy.Server

    initRoutes(): Promise<any>{
        return new Promise((resolve, reject)=>{
            try {
                this.application = restfy.createServer({
                    name: 'alerta-api',
                    version:'1.0.0'
                })
                
                this.application.use(restfy.plugins.queryParser())    
                
                // Routes
                this.application.get('/info', [
                    (req, resp, next)=>{
                        if(req.userAgent() && req.userAgent().includes('MSIE 7.0')){
                            //resp.status(400)
                            //resp.json({message: 'Please, update your browser'})
                            let error: any = new Error()
                            error.statusCode = 400
                            error.message = 'Please, update your browser'
                            return next(error)
                        }
                        return next()
                    },
                    (req, resp, next)=>{
                    resp.json({
                        browser: req.userAgent(),
                        method: req.method,
                        url: req.href(),
                        path: req.path(),
                        query: req.query
                    })
                    return next()
                }])

                this.application.listen(environment.server.port, ()=>{
                    resolve(this.application)
                })
                
            } catch (error) {
                reject(error)
            }
        })
    }
    bootstrap(): Promise<Server>{
        return this.initRoutes().then(()=> this)
    }
}