const aws = require('aws-sdk');

class Storage {
  constructor() {
    this.s3Bucket = new aws.S3({
      accessKeyId: process.env.S3_KEY,
      secretAccessKey: process.env.S3_SECRET,
    });
  }

  async list(tableName) {
    try {
      const data = await this.s3Bucket
        .listObjectsV2({ Bucket: tableName })
        .promise();
      return [null, data.Contents];
    } catch (err) {
      return [err, null];
    }
  }

  async get(tableName, key) {
    try {
      const data = await this.s3Bucket
        .getObject({ Bucket: tableName, Key: key })
        .promise();

      const raw = data.Body.toString();
      const parsed = JSON.parse(raw);
      return [null, parsed];
    } catch (err) {
      return [err, null];
    }
  }

  async update(tableName, key, data) {
    try {
      const resp = await this.s3Bucket
        .putObject({
          Bucket: tableName,
          Key: key,
          Body: data,
        })
        .promise();
      return [null, resp];
    } catch (err) {
      return [err, null];
    }
  }
}

const storage = new Storage();
module.exports = storage;
