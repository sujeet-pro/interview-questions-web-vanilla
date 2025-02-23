import { DataFetcher } from "./infinite-scoll-core"

export type Product = {
    id: number
    title: string
    price: number
}

export type ProductResponse = {
    products: Product[]
    total: number
    skip: number 
    limit: number
}



export function createProductPaginator(pageSize: number): DataFetcher<ProductResponse> {
    let lastResponse: ProductResponse |  null  = null

    async function fetchPageData(): Promise<ProductResponse>  {
        const skip = lastResponse ? lastResponse.skip + lastResponse.limit : 0;
        const response = await fetch(`https://dummyjson.com/products?limit=${pageSize}&skip=${skip}&select=title,price`)
        const data = await response.json() as ProductResponse
        lastResponse = data
        return data;
    }

    fetchPageData.hasNextPage = () => {
        return lastResponse === null || (lastResponse.skip + lastResponse.limit < lastResponse.total)
    }

    return fetchPageData
}