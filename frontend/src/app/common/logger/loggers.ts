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
  'getIcon',
  'getSectionSymbol',
  'getQueries',
  'applyMap',
  'populateMap',
  'onMouseUp',
  'onMouseDown',
  'saveTreeState',
  'scrollDown',
];
export function ComponentLogger() {
  return function (constructor: Function) {
    for (const key of Object.getOwnPropertyNames(constructor.prototype)) {
      const originalMethod = constructor.prototype[key];
      if (typeof originalMethod === 'function') {
        constructor.prototype[key] = function (...args: any[]) {
          if (ignoreList.indexOf(key) === -1) console.log('--', constructor.name, key, 'args:', args, '\n');
          const result = originalMethod.apply(this, args);
          if (ignoreList.indexOf(key) === -1) console.log('---', constructor.name, key, 'res:', result, '\n');
          return result;
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
          if (ignoreList.indexOf(key) === -1) console.log('---', constructor.name, key, 'args:', args, '\n');
          const result = originalMethod.apply(this, args);
          if (ignoreList.indexOf(key) === -1) console.log('---', constructor.name, key, 'res:', result, '\n');
          return result;
        };
      }
    }
    for (const key of Object.getOwnPropertyNames(constructor)) {
      const originalMethod = constructor[key];
      if (typeof originalMethod === 'function') {
        constructor[key] = function (...args: any[]) {
          if (ignoreList.indexOf(key) === -1) console.log('---', constructor.name, key, 'statid:', args, '\n');
          const result = originalMethod.apply(this, args);
          if (ignoreList.indexOf(key) === -1) console.log('---', constructor.name, key, 'res:', result, '\n');
          return result;
        };
      }
    }
  };
}
