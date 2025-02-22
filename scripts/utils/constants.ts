import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const DIR_PROJECT = path.join(__dirname, '../..')
export const DIR_TEMPLATE = path.join(DIR_PROJECT, 'scripts/_template')
export const DIR_APPS = path.join(DIR_PROJECT, 'apps')

