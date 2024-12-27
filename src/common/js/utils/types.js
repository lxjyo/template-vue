import curry from './curry';

const typeMap = {
  Object: '[object Object]',
  Boolean: '[object Boolean]',
  String: '[object String]',
  Number: '[object Number]',
  Undefined: '[object Undefined]',
  Null: '[object Null]'
};

function isType(type, value) {
  if (!typeMap[type]) {
    throw new Error(`Unsupported type: ${type}`);
  }
  return Object.prototype.toString.call(value) === typeMap[type];
}

export const isObject = curry(isType)('Object');
export const isBoolean = curry(isType)('Boolean');
export const isString = curry(isType)('String');
export const isNumber = curry(isType)('Number');
export const isUndefined = curry(isType)('Undefined');
export const isNull = curry(isType)('Null');
export const isFunction = fn => typeof fn === 'function';
export const isNullOrUndefined = value => isNull(value) || isUndefined(value);
