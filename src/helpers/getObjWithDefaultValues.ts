export const getObjWithDefaultValues = <V>(keys: string[], default_value: V): Record<string, V> =>
  keys.reduce((acc, key) => ({ ...acc, [key]: default_value }), {})
