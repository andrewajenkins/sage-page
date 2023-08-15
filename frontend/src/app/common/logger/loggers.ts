const ignoreList = [
  'getStyle',
  'getClass',
  'nodeHighlight',
  'nodeUnHighlight',
  'onMouseEnter',
  'onMouseLeave',
  'ngOnChanges',
  'ngOnInit',
  'logStart',
  'logEnd',
];
export function ComponentLogger() {
  return function (constructor: Function) {
    for (const key of Object.getOwnPropertyNames(constructor.prototype)) {
      const originalMethod = constructor.prototype[key];
      if (typeof originalMethod === 'function') {
        constructor.prototype[key] = function (...args: any[]) {
          if (ignoreList.indexOf(key) === -1)
            console.log(
              '--',
              constructor.name,
              key,
              'Arguments:',
              args
              // JSON.stringify(args)
            );
          console.log(
            '--',
            constructor.name,
            key,
            'Arguments:',
            JSON.stringify(args)
          );
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
          if (ignoreList.indexOf(key) === -1)
            console.log(
              '---',
              constructor.name,
              key,
              'Arguments:',
              JSON.stringify(args)
            );
          return originalMethod.apply(this, args);
        };
      }
    }
    for (const key of Object.getOwnPropertyNames(constructor)) {
      const originalMethod = constructor[key];
      if (typeof originalMethod === 'function') {
        constructor[key] = function (...args: any[]) {
          if (ignoreList.indexOf(key) === -1)
            console.log(
              '---',
              constructor.name,
              key,
              'Static Arguments:',
              JSON.stringify(args)
            );
          return originalMethod.apply(this, args);
        };
      }
    }
  };
}
