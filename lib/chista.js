import path   from 'path';
import Chista from 'chista';
import logger from 'bunyan-singletone-facade';

/* istanbul ignore next */
function getLogger() {
    if (process.env.LAMBDA || process.env.DEV) return; // UGLY.

    logger.init({
        directory : path.join(__dirname, '../logs'),
        name      : 'modern-node-be'
    });

    return (type, data) => logger[type](data);
}

export default new Chista({
    defaultLogger : getLogger()
});
