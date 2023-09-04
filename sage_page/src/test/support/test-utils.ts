// test
export function deepEqualWithDebug(found, expected, level = 0) {
  if (expected === found) return true;
  if (typeof expected !== 'object' || typeof found !== 'object') {
    console.error(' '.repeat(level * 2), 'Not equal:', expected, found);
    return false;
  }
  const keys1 = Object.keys(expected);
  const keys2 = Object.keys(found);
  if (keys1.length > keys2.length) {
    console.error(' '.repeat(level * 2), 'Found fewer keys than expected:', keys1, keys2);
    console.log(' '.repeat(level * 2), expected[keys1[0]], found[keys2[0]]);
    return false;
  }
  if (Array.isArray(expected) && !Array.isArray(found)) {
    console.log('Expected array result, but found', typeof found);
  } else if (!Array.isArray(expected) && Array.isArray(found)) {
    console.log('Expected non-array result, but found', typeof found);
  }
  for (const key of keys1) {
    if (!keys2.includes(key)) {
      console.error(' '.repeat(level * 2), 'Missing key:', key);
      return false;
    }
    console.log(' '.repeat(level * 2), 'Checking key:', key, 'values:', expected[key], found[key]);
    if (!deepEqualWithDebug(found[key], expected[key], level + 1)) {
      if (Array.isArray(expected[key]) && Array.isArray(found[key])) {
        console.error(' '.repeat(level * 2), 'Values are not equal: array:');
        for (let i = 0; i < expected[key].length; i++) {
          console.log('expected:', expected[key][i]);
          console.log('found:', found[key][i]);
        }
      } else {
        console.error(' '.repeat(level * 2), 'Values are not equal:', expected[key], found[key]);
      }
      return false;
    }
  }
  return true;
}
