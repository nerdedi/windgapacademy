export class ExperimentEngine {
  private reactions: Map<string, ChemicalReaction> = new Map();
  private discoveries: Set<string> = new Set();

  constructor() {
    this.initializeReactions();
  }

  private initializeReactions() {
    // Water formation
    this.reactions.set('H2O', {
      reactants: ['H', 'H', 'O'],
      product: 'Water (H₂O)',
      equation: '2H + O → H₂O',
      energy: -285.8, // kJ/mol
      difficulty: 'beginner',
      points: 50,
      description: 'Two hydrogen atoms combine with one oxygen atom to form water.'
    });

    // Salt formation
    this.reactions.set('NaCl', {
      reactants: ['Na', 'Cl'],
      product: 'Sodium Chloride (NaCl)',
      equation: 'Na + Cl → NaCl',
      energy: -411.2,
      difficulty: 'beginner',
      points: 40,
      description: 'Sodium and chlorine form an ionic bond to create table salt.'
    });

    // Methane formation
    this.reactions.set('CH4', {
      reactants: ['C', 'H', 'H', 'H', 'H'],
      product: 'Methane (CH₄)',
      equation: 'C + 4H → CH₄',
      energy: -74.8,
      difficulty: 'intermediate',
      points: 75,
      description: 'Carbon bonds with four hydrogen atoms to form methane gas.'
    });

    // Ammonia formation
    this.reactions.set('NH3', {
      reactants: ['N', 'H', 'H', 'H'],
      product: 'Ammonia (NH₃)',
      equation: 'N + 3H → NH₃',
      energy: -45.9,
      difficulty: 'intermediate',
      points: 65,
      description: 'Nitrogen combines with three hydrogen atoms to form ammonia.'
    });
  }

  checkReaction(molecules: Element[]): ChemicalReaction | null {
    const moleculeCount = this.countMolecules(molecules);

    for (const [key, reaction] of this.reactions) {
      const reactantCount = this.countMolecules(
        reaction.reactants.map(symbol => ({ symbol }))
      );

      if (this.moleculeCountsMatch(moleculeCount, reactantCount)) {
        return reaction;
      }
    }

    return null;
  }

  createExperiment(molecules: Element[], equipment: string): Experiment {
    const reaction = this.checkReaction(molecules);

    return {
      id: Date.now().toString(),
      molecules,
      equipment,
      reaction,
      timestamp: new Date(),
      status: 'ready'
    };
  }

  async runExperiment(experiment: Experiment): Promise<ExperimentResult> {
    // Simulate experiment duration
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (!experiment.reaction) {
      return {
        success: false,
        reaction: 'No reaction occurred',
        product: 'No product formed',
        points: 0,
        discovery: null
      };
    }

    const success = this.calculateSuccess(experiment);
    const points = success ? experiment.reaction.points : 0;
    let discovery = null;

    if (success && !this.discoveries.has(experiment.reaction.product)) {
      discovery = `First discovery of ${experiment.reaction.product}!`;
      this.discoveries.add(experiment.reaction.product);
    }

    return {
      success,
      reaction: experiment.reaction.equation,
      product: experiment.reaction.product,
      points,
      discovery,
      description: experiment.reaction.description,
      energy: experiment.reaction.energy
    };
  }

  private countMolecules(molecules: any[]): Record<string, number> {
    const count: Record<string, number> = {};
    molecules.forEach(molecule => {
      const symbol = molecule.symbol;
      count[symbol] = (count[symbol] || 0) + 1;
    });
    return count;
  }

  private moleculeCountsMatch(count1: Record<string, number>, count2: Record<string, number>): boolean {
    const keys1 = Object.keys(count1);
    const keys2 = Object.keys(count2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every(key => count1[key] === count2[key]);
  }

  private calculateSuccess(experiment: Experiment): boolean {
    // Equipment affects success rate
    const equipmentBonus = {
      beaker: 0.8,
      microscope: 0.9,
      bunsen: 0.85,
      scale: 0.95
    };

    const baseSuccess = 0.7;
    const bonus = equipmentBonus[experiment.equipment] || 0.5;
    const finalChance = Math.min(baseSuccess + bonus, 0.95);

    return Math.random() < finalChance;
  }

  getDiscoveries(): string[] {
    return Array.from(this.discoveries);
  }
}
