// -------------------------------------------------------------------------------------------------
// External dependencies
// -------------------------------------------------------------------------------------------------
import minimist from 'minimist'
import { inspect } from 'util'

/**
 * Joins several string chunks with the first argument the function is called with.
 * This is basically the reverse of the String split function, with the difference that we make sure
 * the merging character is not duplicated
 * @param {string} sep separator we want to merge the string chunks with
 * @param {...string} args string chunks to be joined
 * @return {string}
 */
export const mergeStrings = (sep, ...args) => {
  const argNb = args.length
  if (argNb == 0 || args[0] === undefined || args[0] === null) return ''
  let accumulatedStr = `${args[0]}`
  for (let i = 1; i < argNb; i++) {
    if (args[i] === undefined || args[i] === null) break
    const newChunk = `${args[i]}`
    const cleanChunk = newChunk.startsWith(sep) ? newChunk.slice(1) : newChunk
    accumulatedStr = accumulatedStr.endsWith(sep) ? accumulatedStr + cleanChunk : accumulatedStr + sep + cleanChunk
  }
  return accumulatedStr
}

export const pathJoin = (...args) => mergeStrings('/', ...args)

/**
 * Custom JSON jsonToString function (aka beautify)
 * @param {JSON} jsonObject: a JSON object
 * @param {String or number} options: jsonToStr options. 4 or '\t' make it possible
 *                                    to display the JSON on several lines
 * @returns {String} jsonToStr options
 */
export const jsonToStr = (jsonObject, option) => {
  try {
    return `${JSON.stringify(jsonObject, null, option).replace(/\\"/g, '"')}${option != null ? '\n' : ''}`
  } catch {
    return `${inspect(jsonObject)}`
  }
}

export const cleanHeadersAuth = (str) =>
  typeof str == 'string' ? str.replace(/["'](Bearer|Basic) [\w-/\.]+["']/g, '<auth>') : cleanHeadersAuth(jsonToStr(str))

export const safeStringify = (str) => (str ? cleanHeadersAuth(str) : '')

/**
 *
 * @param {Object} obj a source object
 * @param {string} key the name of a property to omit in the source object
 * @returns An object without the named property
 */
export const omit = (obj, key) => {
  const { [key]: _, ...rest } = obj // NOSONAR
  return rest
}

const ARGV = omit(minimist(process.argv), '_')
console.debug('CLI options:', ARGV)
export const getArgv = (opt) => (opt ? ARGV[opt] : ARGV)
