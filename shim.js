if (typeof process === 'undefined') {
  global.process = require('process');
}
process.browser = false;

if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

global.atob = function atob(str) {
  return global.Buffer.from(str, 'base64').toString('binary');
};
global.btoa = function btoa(str) {
  return global.Buffer.from(str, 'binary').toString('base64');
};

// for uuid (& web3 if you plan to use it)
import "react-native-get-random-values";
import "fastestsmallesttextencoderdecoder";
import "crypto";
