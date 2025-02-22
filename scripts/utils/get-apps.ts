import fs from 'node:fs'
import { DIR_APPS } from './constants'

/**
 * Gets a list of all app directory names in the apps folder
 * @returns Array of app directory names in kebab-case format
 * @throws Error if apps directory doesn't exist or can't be read
 */
export function getApps(): string[] {
  try {
    const apps = fs.readdirSync(DIR_APPS, { withFileTypes: true })
    return apps
      .filter(app => app.isDirectory())
      .map(app => app.name)
      .sort() // Sort alphabetically for consistent ordering
  } catch (error) {
    throw new Error(`Failed to read apps directory: ${error}`)
  }
}
