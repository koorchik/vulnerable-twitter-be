import chista from '../chista.js';

import ContactsSend from '../services/contacts/Send';

export default {
    send : chista.makeServiceRunner(ContactsSend, req => req.body)
};
