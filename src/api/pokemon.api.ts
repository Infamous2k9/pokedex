

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

export async function getPokemonDataByName(name: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)

  if (!res.ok) {
    throw new Error("Pokemon not found")
  }

  return res.json()
}
export async function getPokemonDataById(id: number) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)

  if (!res.ok) {
    throw new Error("Pokemon not found")
  }

  return res.json()
}