export async function getPokemonSpeciesByUrl(url: string) {
  const res = await fetch(`${url}`)

  if (!res.ok) {
    throw new Error("Pokemon Species not found")
  }

  return res.json()
}