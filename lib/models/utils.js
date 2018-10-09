import bcrypt   from 'bcryptjs';
import objectid from 'objectid';

const SALT_ROUNDS = 2;

export const passwordMethods = {
    checkPassword(plain) {
        return bcrypt.compare(plain, this.passwordHash);
    },

    encryptPassword(password) {
        const salt = bcrypt.genSaltSync(SALT_ROUNDS); // eslint-disable-line no-sync

        return bcrypt.hashSync(password, salt); // eslint-disable-line no-sync
    }
};

export function injectMethods(targetClass, methods) {
    for (const method in methods) {
        /* istanbul ignore else */
        if (methods.hasOwnProperty(method)) {
            // eslint-disable-next-line no-param-reassign
            targetClass.prototype[method] = methods[method];
        }
    }
}

export function generateObjectId() {
    return objectid().toString();
}
