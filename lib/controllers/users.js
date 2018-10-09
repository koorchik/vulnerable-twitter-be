import chista from '../chista.js';

import UsersCreate             from '../services/users/Create';
import UsersUpdate             from '../services/users/Update';
import UsersResetPassword      from '../services/users/ResetPassword';
import UsersResetPasswordBySMS from '../services/users/ResetPasswordBySMS';
import UsersList               from '../services/users/List';
import UsersShow               from '../services/users/Show';

export default {
    create             : chista.makeServiceRunner(UsersCreate, req => req.body),
    update             : chista.makeServiceRunner(UsersUpdate, req => ({ ...req.body, id: req.params.id })),
    resetPassword      : chista.makeServiceRunner(UsersResetPassword, req => req.body),
    resetPasswordBySMS : chista.makeServiceRunner(UsersResetPasswordBySMS, req => req.body),
    list               : chista.makeServiceRunner(UsersList, req => ({ ...req.query, ...req.params })),
    show               : chista.makeServiceRunner(UsersShow, req  => ({ id: req.params.id }))
};
