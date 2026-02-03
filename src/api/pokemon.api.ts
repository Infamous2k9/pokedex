

export async function getPokemonData(url: string) {
       
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