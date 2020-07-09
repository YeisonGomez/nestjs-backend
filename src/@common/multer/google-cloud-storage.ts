import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
//export const bucket = storage.bucket(ConfigService.gcp.bucket);

export default class MulterGoogleCloudStorage {

  private options;
  private bucket;

  constructor(
    options?: { acl?: string },
    @Inject('ConfigService')
    private readonly configService?: ConfigService,
  ) {
    this.options = options || {};
    this.bucket = storage.bucket(configService.get('gcs.bucket'))
  }

  getBucket = () => this.bucket 

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

        const gcFile = this.bucket.file(filename);

        file.stream.pipe(
          gcFile.createWriteStream({ predefinedAcl: this.options }))
          .on('error', (err) => cb(err))
          .on('finish', (file) => cb(null, {
            path: `https://${this.bucket.name}.storage.googleapis.com/${filename}`,
            filename: filename
          })
          );
      });

    })
  }

  _removeFile = (filename) => {
    this.bucket.file(filename).delete()
  };
}

/*export const removeFile = (filename) => {
  bucket.file(filename).delete();
}*/