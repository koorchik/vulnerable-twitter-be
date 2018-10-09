import chista from '../chista.js';

import TweetsCreate from '../services/tweets/Create';
import TweetsUpdate from '../services/tweets/Update';
import TweetsDelete from '../services/tweets/Delete';
import TweetsList   from '../services/tweets/List';
import TweetsShow   from '../services/tweets/Show';

export default {
    create : chista.makeServiceRunner(TweetsCreate, req => req.body),
    update : chista.makeServiceRunner(TweetsUpdate, req => ({ ...req.body, id: req.params.id })),
    delete : chista.makeServiceRunner(TweetsDelete, req => ({ id: req.params.id })),
    list   : chista.makeServiceRunner(TweetsList,   req => ({ ...req.query, ...req.params })),
    show   : chista.makeServiceRunner(TweetsShow,   req => ({ id: req.params.id }))
};
