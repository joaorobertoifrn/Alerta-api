import { environment } from './../common/environment';
import * as restfy from 'restify'
import {Router} from './../common/router'


export class Server {

    application: restfy.Server

    initRoutes(routers: Router[]): Promise<any>{
        return new Promise((resolve, reject)=>{
            try {
                this.application = restfy.createServer({
                    name: 'alerta-api',
                    version:'1.0.0'
                })
                
                this.application.use(restfy.plugins.queryParser())    
                
                // Routes
                for ( let router of routers) {
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, ()=>{
                    resolve(this.application)
                })
                
            } catch (error) {
                reject(error)
            }
        })
    }
    bootstrap(routers: Router[] = []): Promise<Server>{
        return this.initRoutes(routers).then(()=> this)
    }
}