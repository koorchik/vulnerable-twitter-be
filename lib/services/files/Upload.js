import path        from 'path';
import ServiceBase from 'chista/ServiceBase';
import decompress  from 'decompress';

import rimraf from 'rimraf';

function rm(folder) {
    return new Promise((res, rej) => {
        return rimraf(folder, (err) => {
            if (err) {
                return rej(err);
            }

            return res();
        });
    });
}

const STATIC_PATH = `${__dirname}/../../../static/`;

export default class FilesUpload extends ServiceBase {
    static validationRules = {
        archive : [ 'required', { 'nested_object' : {
            fieldName        : [ 'required', 'string' ],
            originalFilename : [ 'required', 'string' ],
            path             : [ 'required', 'string' ]
        } } ]
    }

    async execute({ archive }) {
        const albumPath = path.resolve(STATIC_PATH, this.context.userId);

        await rm(albumPath);
        await decompress(archive.path, albumPath);

        return {};
    }
}
