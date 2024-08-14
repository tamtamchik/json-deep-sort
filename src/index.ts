/**
 * Enumeration of data types.
 * @enum {string}
 */
enum DataType {
  OBJECT = 'object',
  ARRAY = 'array',
  PRIMITIVE = 'primitive'
}

/**
 * Function to determine the data type of the provided data.
 * @param {unknown} data - The data to be checked.
 * @returns {DataType} The DataType value corresponding to the data's type.
 */
function getType(data: unknown): DataType {
  if (Array.isArray(data)) return DataType.ARRAY;
  if (data !== null && typeof data === 'object') return DataType.OBJECT;
  return DataType.PRIMITIVE;
}

/**
 * Function to sort JSON data.
 * @param {unknown} data - The data to be sorted.
 * @param {boolean} [asc=true] - Whether to sort in ascending order.
 * @returns {unknown} The sorted data.
 */
export function sort(data: unknown, asc: boolean = true): unknown {
  const type = getType(data);

  if (type === DataType.ARRAY) {
    return (data as unknown[]).map(item =>
      getType(item) !== DataType.PRIMITIVE ? sort(item, asc) : item
    );
  }

  if (type === DataType.OBJECT) {
    const sortedKeys = Object.keys(data as object).sort();
    if (!asc) sortedKeys.reverse();

    return sortedKeys.reduce((result: Record<string, unknown>, key) => {
      const value = (data as Record<string, unknown>)[key];
      result[key] = getType(value) !== DataType.PRIMITIVE ? sort(value, asc) : value;
      return result;
    }, {});
  }

  return data;
}
