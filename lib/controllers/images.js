import chista from '../chista';

import ImagesCreate from '../services/images/Create';

export default {
    create : chista.makeServiceRunner(ImagesCreate, req => req.files)
};
