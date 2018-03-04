const path = require('path');
const fs = require('fs-extra');
const qiniu = require('qiniu');
const promise = require('bluebird');
const config = require('../../../config/project');


const {
  bucketUrl,
  bucket,
  accessKey,
  secretKey,
} = config;


qiniu.conf.ACCESS_KEY = config.accessKey;
qiniu.conf.SECRET_KEY = config.secretKey;


const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const options = {
  scope: bucket,
  // callbackUrl: 'http://api.example.com/qiniu/upload/callback',
  callbackBody: 'key=$(key)&bucket=$(bucket)&imageInfo=$(imageInfo)',
  callbackBodyType: 'application/json',
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);


const uploadFile = async (
  key,
  localFile,
) => {
  const config = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z2;
  config.useHttpsDomain = true;
  config.useCdnDomain = true;

  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();
  // 文件上传
  return new promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, localFile, putExtra, (err, res, respInfo) => {
      if (err) {
        reject(err);
      } else {
        resolve(Object.assign({}, res, {
          url: `http://${bucketUrl}/${res.key}`,
        }));
      }
    });
  });
};
module.exports = uploadFile;
