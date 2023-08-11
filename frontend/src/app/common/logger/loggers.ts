export function ComponentLogger() {
  return function (constructor: Function) {
    for (const key of Object.getOwnPropertyNames(constructor.prototype)) {
      const originalMethod = constructor.prototype[key];
      const ignoreList = [
        'getStyle',
        'getClass',
        'nodeHighlight',
        'nodeUnHighlight',
      ];
      if (
        typeof originalMethod === 'function' &&
        ignoreList.indexOf(key) === -1
      ) {
        constructor.prototype[key] = function (...args: any[]) {
          console.log('--', constructor.name, key, 'Arguments:', args);
          return originalMethod.apply(this, args);
        };
      }
    }
  };
}

export function ServiceLogger() {
  return function (constructor: Function) {
    for (const key of Object.getOwnPropertyNames(constructor.prototype)) {
      const originalMethod = constructor.prototype[key];

      if (typeof originalMethod === 'function') {
        constructor.prototype[key] = function (...args: any[]) {
          console.log('---', constructor.name, key, 'Arguments:', args);
          return originalMethod.apply(this, args);
        };
      }
    }
  };
}
