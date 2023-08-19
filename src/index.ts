/**
 * Enumeration of data types.
 * @enum {string}
 */
enum DataType {
  OBJECT,
  ARRAY,
  STRING,
  OTHER,
}

/**
 * Function to determine the data type of the provided data.
 * @param {any} data - The data to be checked.
 * @returns {DataType} The DataType value corresponding to the data's type.
 */
function getType (data: any): DataType {
  if (Array.isArray(data)) {
    return DataType.ARRAY
  } else if (typeof data === 'object' && data !== null) {
    return DataType.OBJECT
  } else if (typeof data === 'string') {
    return DataType.STRING
  } else {
    return DataType.OTHER
  }
}

/**
 * Function to determine whether the provided data is a recursive type.
 * @param {any} data - The data to be checked.
 * @returns {boolean} Whether the data is a recursive type.
 */
function isRecursiveType (data: any): boolean {
  return [DataType.OBJECT, DataType.ARRAY].includes(getType(data))
}

/**
 * Function to sort JSON data.
 * @param {any} data - The data to be sorted.
 * @param {boolean} [asc=true] - Whether to sort in ascending order.
 * @returns {any} The sorted data.
 * @throws {Error} If the data is not an object or array.
 */
export function sort (data: any, asc: boolean = true): any {
  switch (getType(data)) {

    case DataType.ARRAY:
      return data.map((d: any) => isRecursiveType(d) ? sort(d, asc) : d)

    case DataType.OBJECT:
      const keys = Object.keys(data).sort()

      if (!asc) keys.reverse()

      return keys.reduce((newData: any, key: string) => {
        newData[key] = isRecursiveType(data[key]) ? sort(data[key], asc) : data[key]
        return newData
      }, {})

    default:
      throw new Error('Invalid data type: expected an object or array of objects.')
  }
}
