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
const isTestMode = true;
export function ComponentLogger() {
  return function (constructor: Function) {
    for (const key of Object.getOwnPropertyNames(constructor.prototype)) {
      const originalMethod = constructor.prototype[key];
      if (typeof originalMethod === 'function' && !isTestMode) {
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
      if (typeof originalMethod === 'function' && !isTestMode) {
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
      if (typeof originalMethod === 'function' && !isTestMode) {
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

export function LogIO(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling method: ${propertyKey}`);
    console.log('Input arguments:', args);

    const result = originalMethod.apply(this, args);

    if (result instanceof Promise) {
      // For Async functions
      result
        .then((response) => {
          console.log(`Output of method: ${propertyKey}`, response);
        })
        .catch((error) => {
          console.log(`Error from method: ${propertyKey}`, error);
        });
    } else {
      console.log(`Output of method: ${propertyKey}`, result);
    }

    return result;
  };

  return descriptor;
}
