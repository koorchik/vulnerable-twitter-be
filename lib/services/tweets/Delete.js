import ServiceBase from 'chista/ServiceBase';
import sequelize    from '../../sequelize';

const Tweet = sequelize.model('Tweet');

export default class TweetsDelete extends ServiceBase {
    static validationRules = {
        id : [ 'required', 'object_id' ]
    };

    async execute({ id }) {
        await Tweet.destroy({ where: { id } });

        return {};
    }
}
