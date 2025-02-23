import {readFile} from 'node:fs/promises'

const SYMBOLS_API_BASE_URL = 'stock-symbols';
const MARKET_CAPS_API_BASE_URL = 'stock-market-caps';
const PRICES_API_BASE_URL = 'stock-prices';

import {dirname} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))


async function fetchJson(fileName) {
  const data = await readFile(`${__dirname}/data/${fileName}.json`, 'utf-8')
  return JSON.parse(data)
}

async function getSymbolNameMap() {
  const data = await fetchJson(SYMBOLS_API_BASE_URL)
  return Object.fromEntries(data.map(c => [c.symbol, c.name]))
}

async function getTopNBasedOnMarketCap(topN) {
  const data =  await fetchJson(MARKET_CAPS_API_BASE_URL)
  data.sort((a,b) => b['market-cap'] - a['market-cap'])
  return data.slice(0, topN)
}
async function getPriceInfo(symbols) {
  const sym = new Set(symbols)
  const res = await fetchJson(PRICES_API_BASE_URL)
  const data = res.filter(datum => sym.has(datum.symbol))
  return Object.fromEntries(data.map(datum => [datum.symbol, datum]))
}

async function trendingStocks(n) {
  const symbolMapPromise = getSymbolNameMap()
  const topN = await getTopNBasedOnMarketCap(n)
  const priceInfo = await getPriceInfo(topN.map(n => n.symbol))
  const symbolMap = await symbolMapPromise

  return topN.map(c => ({
    ...priceInfo[c.symbol],
    ...c,
    name: symbolMap[c.symbol],
  }))
}

const data = await trendingStocks(1)
console.log(data)