import type { EvolutionChain } from "../interfaces/evo-chain";

export class EvolutionChainModel implements EvolutionChain {
  name: string
  evolvesTo: EvolutionChainModel[]

  constructor(chain: any) {
    this.name = chain.species.name
    this.evolvesTo = chain.evolves_to.map(
      (e: any) => new EvolutionChainModel(e)
    )
  }
}
