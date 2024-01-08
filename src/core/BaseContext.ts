export class BaseContext {
    ctx: any;
    constructor(private app:any) {
        this.ctx = null;
    }

    setContext(ctx:any) {
        this.ctx = ctx;
    }
}


export class Controller extends BaseContext {}
export class Service extends BaseContext {}