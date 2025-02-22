import * as fs from 'node:fs'
import * as path from 'node:path'
import * as readline from 'node:readline'

import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { copyTemplatesTo } from './utils/copy-templates'
import { updateHtml } from './utils/render-ejs'
import { validateAppName } from './utils/file-names.utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export function createApp(name: string) {
  const appsDir = path.join(__dirname, '../apps')
  const newAppDir = path.join(appsDir, name)

  if (!fs.existsSync(appsDir)) {
    fs.mkdirSync(appsDir)
  }

  if (fs.existsSync(newAppDir)) {
    console.error(`Directory ${newAppDir} already exists.`)
    return
  }

  fs.mkdirSync(newAppDir)
  copyTemplatesTo(name, ['index.ejs'])
  updateHtml(name)
  updateHtml('main') // index.html

  console.log(`App ${name} created successfully.`)
}

async function getAppName(): Promise<string> {
  // Check for command line argument
  const argAppName = process.argv[2]
  if (argAppName) {
    try {
      validateAppName(argAppName)
      return argAppName
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }

  // If no valid argument provided, prompt interactively
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question('Please provide an app name: ', (appName) => {
      rl.close()
      try {
        validateAppName(appName)
        resolve(appName)
      } catch (error) {
        console.error(error)
        process.exit(1)
      }
    })
  })
}

async function main() {
  const appName = await getAppName()
  await createApp(appName)
}

main().catch((error) => {
  console.error('Failed to create app:', error)
  process.exit(1)
})
