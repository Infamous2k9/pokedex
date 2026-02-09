export async function getEvoChainByUrl(url: string) {
  const res = await fetch(`${url}`)

  if (!res.ok) {
    throw new Error("Evo Chain not found")
  }

  return res.json()
}