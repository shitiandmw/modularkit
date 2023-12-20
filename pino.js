const pino = require("pino");

class Pino {
    static instance;
    constructor() {
        if (!Pino.instance) {
            const transport = pino.transport({
                target: 'pino-pretty'
              });
            Pino.instance = new pino({
                level: 'debug',
            }, transport) 
        }
        return Pino.instance
    }
}

const logger = new Pino();


for (let index = 0; index < 100000; index++) {
    
logger.error('error log')
    
}


logger.fatal('fatal log')
logger.error('error log')
logger.error(new Error('error log'))
logger.warn('warn log')
logger.info('info log')
logger.debug('debug log')
logger.trace('trace log')