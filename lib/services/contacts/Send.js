import ServiceBase from 'chista/ServiceBase';
import emailSender from '../emailSender';
import config      from '../../../etc/config.json';

export default class ContactsSend extends ServiceBase {
    static validationRules = {
        data : { 'nested_object' : {
            email       : [ 'required', 'email' ],
            name        : [ 'required', 'string' ],
            phoneNumber : { 'max_length': 10 },
            website     : [ 'url' ],
            solution    : [ 'not_empty', 'string' ],
            timeframe   : [ 'not_empty', 'string' ],
            additional  : [ 'not_empty', 'string' ]
        } }
    };

    async execute(data) {
        emailSender.send('contact', config.contactEmail, data.data);

        return {};
    }
}
