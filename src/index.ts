/**
 * Enumeration of data types.
 * @enum {string}
 */
enum DataType {
  OBJECT = 'OBJECT',
  ARRAY = 'ARRAY',
  STRING = 'STRING',
  OTHER = 'OTHER',
}

/**
 * Function to determine the data type of the provided data.
 * @param {any} data - The data to be checked.
 * @returns {DataType} The DataType value corresponding to the data's type.
 */
function getType (data: any): DataType {
  const objectConstructor = {}.constructor
  const arrayConstructor = [].constructor
  const stringConstructor = ''.constructor

  if (data && data.constructor === objectConstructor) {
    return DataType.OBJECT
  } else if (data && data.constructor === arrayConstructor) {
    return DataType.ARRAY
  } else if (data && data.constructor === stringConstructor) {
    return DataType.STRING
  } else {
    return DataType.OTHER
  }
}

/**
 * Function to sort JSON data.
 * @param {any} data - The data to be sorted.
 * @param {boolean} [asc=true] - Whether to sort in ascending order.
 * @returns {any} The sorted data.
 * @throws {Error} If the data is not an object or array.
 */
export function sort (data: any, asc = true): any {
  switch (getType(data)) {

    case DataType.ARRAY:
      return data.map((d: any) => [DataType.OBJECT, DataType.ARRAY].includes(getType(d)) ? sort(d, asc) : d)

    case DataType.OBJECT:
      const keys = Object.keys(data).sort()

      if (!asc) keys.reverse()

      return keys.reduce((newData: any, key: string) => {
        if ([DataType.OBJECT, DataType.ARRAY].includes(getType(data[key])))
          newData[key] = sort(data[key], asc)
        else
          newData[key] = data[key]
        return newData
      }, {})

    default:
      throw new Error('Invalid data type: expected an object or array.')
  }
}
