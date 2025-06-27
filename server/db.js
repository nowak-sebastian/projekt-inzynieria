import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)

// Podaj domyślne dane jako drugi argument Low:
const defaultData = {
    "tickets": []
}

const db = new Low(adapter, defaultData)

export async function init() {
  await db.read()
  
  if (!db.data) {
    db.data = defaultData
    await db.write()
  }
}
export { db }