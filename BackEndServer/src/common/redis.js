'use strict';

var nconf = require('nconf'),
    redis = require('redis');

// TODO: use promises rather than callbacks. possibly then-redis or promise-redis

var Redis = function() {

    if (!nconf.get('redisEnabled')) {
        console.info('Redis Disabled');
        return;
    }

    this.client = redis.createClient(
        nconf.get('redis_url')
    );
    this.client.on('connect', function() {
        console.info('Redis connected');
    });
    this.client.on('error', function(err) {
        console.error('Redis Error ', err);
    });
    this.client.on('end', function(err) {
        console.error('Redis end ', err);
    });

};

Redis.prototype.set = function(key, value, expires, callback) {
    this.client.set(key, value, function(err, cacheReply) {
        console.verbose('[Redis] set cache - key:', key, ' expires: ', expires);
        console.debug('[Redis] set cache - value:', value);
        if (err !== null) {
            console.error('Redis set error: ', err);
        }
        if (callback) {
            callback(err, cacheReply);
        }
    });
    this.client.expire(key, expires);
};

Redis.prototype.get = function(key, callback) {
    this.client.get(key, function(err, value) {

        if (err !== null) {
            console.error('Redis get error: ', err);
        }
        if (value === null) {
            console.info('[Redis] Cache miss for key:', key);
        }
        if (callback) {
            callback(err, value);
        }
    });
};

Redis.prototype.del = function(key, callback) {
    this.client.del(key, function(err, reply) {
      
        console.info('Redis deleting cache with key(s): ', key, ' reply ', reply);
        if (err !== null) {
            console.error('Redis del error: ', err);
        }
        if (reply <= 0) {
            console.info('[Redis] Cache del miss for key: ', key);
        }
        if (callback) {
            callback(err, reply);
        }
    });
};

module.exports = new Redis();
