import redis from "redis";
import {
  NOT_FOUND_KEY,
  REDIS_INTERNAL_ERROR,
  FOUND_KEY,
  REDIS_DELETE_COMPANY_STACK,
  REDIS_CONFIRM_EMAIL_STACK,
  REDIS_TEMPORARY_STACK
} from "../statuses/redisStatuses";

const REDIS_PORT = process.env.REDIS_PORT || 6379,
  REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const client = redis.createClient(REDIS_PORT, REDIS_HOST);

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("connect", function() {
  console.log(`Connected to redis instance on ${REDIS_HOST}:${REDIS_PORT}`);
});

client.on("error", function(err) {
  console.log("Error " + err);
});

export function setToDeleteCompanyStack(key, companyId) {
  return new Promise((resolve, reject) => {
    client.select(REDIS_DELETE_COMPANY_STACK, function(err) {
      if (err) {
        reject(REDIS_INTERNAL_ERROR);
      }
      client.set(key, companyId, "EX", 3600 * 24, err => {
        if (err) {
          reject(REDIS_INTERNAL_ERROR);
        }
        resolve();
      });
    });
  });
}

export function getFromDeleteCompanyStack(key) {
  return new Promise((resolve, reject) => {
    client.select(REDIS_DELETE_COMPANY_STACK, function() {
      client.get(key, (err, reply) => {
        if (err) {
          reject(REDIS_INTERNAL_ERROR);
        }
        if (!reply) {
          reject(NOT_FOUND_KEY);
        }
        resolve({
          status: FOUND_KEY,
          message: reply
        });
      });
    });
  });
}

export function setToConfirmEmailStack(key, email) {
  return new Promise((resolve, reject) => {
    client.select(REDIS_CONFIRM_EMAIL_STACK, function(err) {
      if (err) {
        reject(REDIS_INTERNAL_ERROR);
      }
      client.set(key, email, "EX", 3600 * 24, err => {
        if (err) {
          reject(REDIS_INTERNAL_ERROR);
        }
        client.get(key, (err, reply) => {
          console.log("To jest ten email ", reply);
        });
        resolve();
      });
    });
  });
}

export function getFromConfirmEmailStack(key) {
  return new Promise((resolve, reject) => {
    client.select(REDIS_CONFIRM_EMAIL_STACK, function() {
      client.get(key, (err, reply) => {
        if (err) {
          console.log(err);
          reject(REDIS_INTERNAL_ERROR);
        }
        if (!reply) {
          reject(NOT_FOUND_KEY);
        }
        resolve({
          status: FOUND_KEY,
          message: reply
        });
      });
    });
  });
}

export function removeFromConfirmEmailStack(key) {
  client.select(REDIS_CONFIRM_EMAIL_STACK, function() {
    client.del(key);
  });
}

export function setToTemporaryStack(key, code) {
  return new Promise((resolve, reject) => {
    client.select(REDIS_TEMPORARY_STACK, function(err) {
      if (err) {
        reject(REDIS_INTERNAL_ERROR);
      }
      client.set(key, code, err => {
        if (err) {
          reject(REDIS_INTERNAL_ERROR);
        }
        resolve();
      });
    });
  });
}

export function getFromTemporaryStack(key) {
  return new Promise((resolve, reject) => {
    client.select(REDIS_TEMPORARY_STACK, function() {
      client.get(key, (err, reply) => {
        if (err) {
          reject(REDIS_INTERNAL_ERROR);
        }
        if (!reply) {
          reject(NOT_FOUND_KEY);
        }
        resolve({
          status: FOUND_KEY,
          message: reply
        });
      });
    });
  });
}

export function removeFromTemporaryStack(key) {
  client.select(REDIS_TEMPORARY_STACK, function() {
    client.del(key);
  });
}

export default client;
