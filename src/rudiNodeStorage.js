/**
 * RUDI Storage access driver for media data.
 *
 * @author: Laurent Morin
 * @version: 1.0.0
 */
// -------------------------------------------------------------------------------------------------
// External dependencies
// -------------------------------------------------------------------------------------------------
import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { parse as iniParse } from 'ini'

// -------------------------------------------------------------------------------------------------
// Internal dependencies
// -------------------------------------------------------------------------------------------------
import { DEFAULT_CONF } from './configuration.js'
import { HttpService } from './httpService.js'
import { SignalCleaner } from './signalCleaner.js'
import { getArgv } from './utils.js'

// -------------------------------------------------------------------------------------------------
// Constants
// -------------------------------------------------------------------------------------------------
const ARGV = getArgv()

/**
 * Recursive function updating a base structure with a given structure
 * @private
 * @param {object} base    - the base structure
 * @param {object} updated - the source of updated data
 */
function updateProperty(base, updated) {
  const newo = {}
  for (const elt in base) {
    if (elt in updated) {
      if (typeof updated[elt] == 'object') newo[elt] = updateProperty(base[elt], updated[elt])
      else if (typeof base[elt] == 'number') newo[elt] = parseInt(updated[elt])
      else {
        try {
          newo[elt] = JSON.parse(updated[elt])
        } catch {
          newo[elt] = updated[elt]
        }
      }
    } else newo[elt] = base[elt]
  }
  return newo
}

/**
 * @param {*} iniFileContent
 * @returns
 */
function parseIniMultiligne(iniFileContent) {
  const multilineContent = iniParse(iniFileContent)
  const content = {}
  let accumulatedKey
  let accumulatedVal
  for (const section of Object.keys(multilineContent)) {
    const sectionParams = multilineContent[section]
    content[section] = {}
    for (const param of Object.keys(sectionParams)) {
      const val = sectionParams[param]
      if (val == '[' || val == '{') {
        accumulatedKey = param
        accumulatedVal = val
      } else if (!accumulatedVal) {
        content[section][param] = val
      } else {
        accumulatedVal += param
        if (param == ']' || param == '}') {
          content[section][accumulatedKey] = accumulatedVal
          accumulatedVal = null
        }
      }
    }
  }
  // console.debug('T content.storage.zones:', content.storage.zones)
  return content
}
/**
 * Fetch ini-file & parse command line arguments
 *
 * @param {object} confDefault  - the default configuration
 * @param {object} confFilename - the defaut init file
 */
function fetchAndParseArguments(confDefault, defaultConfFilename) {
  const confFilename = ARGV.ini || ARGV.conf || defaultConfFilename

  let configuration = confDefault
  try {
    const iniFileContent = readFileSync(confFilename, 'utf-8')
    const config = parseIniMultiligne(iniFileContent)
    // console.debug('config:', config)
    configuration = updateProperty(confDefault, config)
    // console.debug('configuration:', configuration)
  } catch (err) {
    console.error('warning: configuration file ignored: ' + err)
  }
  // CLI option '-p' => port
  if (ARGV.p) {
    const np = parseInt(ARGV.p, 10)
    if (!isNaN(np)) configuration.server.port = np
  }
  // CLI option '--revision' => git hash
  let hash = String(ARGV.revision || ARGV.hash)
  if (!hash) {
    try {
      hash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim()
    } catch {
      hash = 'n/a'
    }
  }
  configuration.logging.revision = hash.slice(0, 7)

  // CLI option '--url' => public URL
  if (ARGV.url) configuration.server.server_url = ARGV.url
  else if (process.env.STORAGE_PUBLIC_URL) {
    configuration.server.server_url = process.env.STORAGE_PUBLIC_URLcd.america.america
  }

  // CLI option '-l' => log folder
  if (ARGV.l) {
    const logFolder = ARGV.l.slice(0, 60)
    configuration.log_local.directory = logFolder.endsWith('/') ? logFolder : `${logFolder}/`
  }

  // Error mgmt.
  if (configuration.server.port < 80) {
    console.error(`Incorrect port provided: ${configuration.server.port}`)
    process.exit(-1)
  }
  return configuration
}

/*
 * Main application function, loads configuration and launch service.
 */
export const runRudiStorage = () => {
  try {
    const configuration = fetchAndParseArguments(DEFAULT_CONF, './rudi_media_custom.ini')
    // console.info(jsonToStr(configuration, null, 2))
    const service = new HttpService(configuration)
    const sc = new SignalCleaner(service, configuration.server.close_timeout)
    sc.arm()
  } catch (err) {
    console.error('CRITICAL: an error happened during the server launching:', err)
  }
}
