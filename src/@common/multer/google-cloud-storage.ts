import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import ConfigService from '../config/config.service';

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const bucket = storage.bucket(ConfigService.gcp.bucket);

export default class MulterGoogleCloudStorage {

  private options;

  constructor(options?: { acl?: string }) {
    options = options || {};
  }

  getFilename(req, file, cb) {
    cb(null, `${randomStringGenerator()}_${file.originalname}`);
  }

  getDestination(req, file, cb) {
    cb(null, '')
  }

  _handleFile = (req, file, cb) => {
    this.getDestination(req, file, (err, path) => {
      if (err) return cb(err)

      this.getFilename(req, file, (err, filename) => {
        if (err) return cb(err);

        const gcFile = bucket.file(filename);

        file.stream.pipe(
          gcFile.createWriteStream({ predefinedAcl: this.options }))
          .on('error', (err) => cb(err))
          .on('finish', (file) => cb(null, {
            path: `https://${bucket.name}.storage.googleapis.com/${filename}`,
            filename: filename
          })
          );
      });

    })
  }

  _removeFile = (req, file, cb) => removeFile(file.filename);
}

export const removeFile = (filename) => {
  bucket.file(filename).delete();
}