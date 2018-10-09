import chista from '../chista.js';
import FilesUpload from '../services/files/Upload.js';

export default {
    upload : chista.makeServiceRunner(FilesUpload, req => {
        return req.files;
    })
};
