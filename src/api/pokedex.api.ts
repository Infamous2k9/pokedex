const POKEDEX_URL: string = "https://pokeapi.co/api/v2/pokemon/"

export async function getAllPokemonData() {
       
    try {
        const response = await fetch(POKEDEX_URL)
        if(!response.ok){
            throw new Error(
                `Response status: ${response.status} (${response.statusText})`
            )
        }
        return await response.json()
    } catch (error) {
        console.error(error)
        throw error
    }
}
export async function getNextPokemonData(offset: number, limit: number) {
       
    try {
        const response = await fetch(`${POKEDEX_URL}?offset=${offset}&limit=${limit}`)
        if(!response.ok){
            throw new Error(
                `Response status: ${response.status} (${response.statusText})`
            )
        }
        return await response.json()
    } catch (error) {
        console.error(error)
        throw error
    }
}
export async function getPreviousPokemonData(url: string) {
       
    try {
        const response = await fetch(url)
        if(!response.ok){
            throw new Error(
                `Response status: ${response.status} (${response.statusText})`
            )
        }
        return await response.json()
    } catch (error) {
        console.error(error)
        throw error
    }
}