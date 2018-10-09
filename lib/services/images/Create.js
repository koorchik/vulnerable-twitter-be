import path from 'path';
import fse  from 'fs-extra';
import ServiceBase from 'chista/ServiceBase';
import X from 'chista/Exception';

import { dumpImage, createImageName } from '../utils.js';
import { testStaticPath, staticPath, staticUrl, postImagesMaxSize }  from './../../../etc/config';

const TEST_MODE = process.env.MODE === 'test';

export default class ImagesCreate extends ServiceBase {
    static validationRules = {
        image : [ 'not_empty', 'required' ]
    };

    async execute(data) {
        await this._validateImage(data.image);

        const directoryPath = await this._makeUserDirectory();
        const imageName = createImageName(data.image);
        const imageLink = await this._uploadImage(data.image, directoryPath, imageName);

        return {
            data : dumpImage(imageName, imageLink)
        };
    }

    async _validateImage(image) {
        if (!image.size) {
            await fse.unlink(image.path);
            throw new X({
                code   : 'NO_IMAGE',
                fields : {
                    image : 'NO_IMAGE'
                }
            });
        }

        if (image.type.indexOf('image') < 0) {
            await fse.unlink(image.path);
            throw new X({
                code   : 'FORMAT_ERROR',
                fields : {
                    image : 'WRONG_TYPE'
                }
            });
        }

        if (image.size > postImagesMaxSize) {
            await fse.unlink(image.path);
            throw new X({
                code   : 'FORMAT_ERROR',
                fields : {
                    image : 'TOO_BIG'
                }
            });
        }
    }

    async _makeUserDirectory() {
        /* istanbul ignore next */
        const directoryPath = path.join(TEST_MODE ? testStaticPath : staticPath, '/images');

        await fse.ensureDir(directoryPath);

        return directoryPath;
    }

    async _uploadImage(image, directoryPath, imageName) {
        const imagePath = path.join(directoryPath, imageName);

        try {
            /* istanbul ignore next */
            await fse.rename(image.path, imagePath);
        } catch (e) {
            /* istanbul ignore next */
            if (TEST_MODE && e.toString().match(/cross-device link not permitted/)) {
                // allow non atomic move in test mode
                // rename does not support moving files between different partitions

                /* istanbul ignore next */
                await fse.move(image.path, imagePath);
            } else {
                /* istanbul ignore next */
                throw e;
            }
        }

        return `${staticUrl}/images/${imageName}`;
    }
}
