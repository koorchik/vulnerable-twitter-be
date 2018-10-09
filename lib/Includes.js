import ServiceBase from 'chista/ServiceBase';
import X           from 'chista/Exception';

export default class Includes extends ServiceBase {
    setDbIncludes = (include) => {
        const { userId, userRole } = this.context;

        /* istanbul ignore next */
        if (!this.contextNotRequired && !userId) {
            throw new X({
                code   : 'PERMISSION_DENIED',
                fields : {
                    token : 'NOT_FOUND'
                }
            });
        }


        const e = new X({
            code   : 'PERMISSION_DENIED',
            fields : { userRole }
        });


        if (!this.allowedRoles) return;
        /* istanbul ignore if */
        if (!userRole) throw e;
        if (!this.allowedRoles.includes(userRole)) throw e;


        if (include) {
            const includes = [];

            include.forEach(type => {
                /* istanbul ignore else */
                if (this.includeMap[type]) includes.push(this.includeMap[type]);

                this.dbRequest.order.push(this.includeMap[type].order);
            });

            this.dbRequest.include = includes;
        }
    }
}
