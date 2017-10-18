module.exports = {
    // release config.
    // you can use domain name, ip address or localhost.
    server: 'peng.pipk.top',
    port: 443,

    // local dev config
    devServer: 'localhost',
    devPort: 8080,

    // redux dev tool server
    reduxDevPort: 8080,

    // database url and name
    database: 'database_name',
    testDatabase: 'test_database_name',

    // jwt encryption secret
    jwtSecret: 'jwt',

    // qiniu CDN config.
    // this is not necessary. if you not modify this config. image will save to local disk.
    accessKey: 'qiniu_access_key',
    secretKey: 'qiniu_secret_key',
    bucket: 'bucket_name',
    bucketUrl: 'bucket_outside_url',

    // max message lenght. for both backend and frontend
    maxMessageLength: 1024,
};
