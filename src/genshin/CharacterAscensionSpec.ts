export class CharacterAscensionSpec {
  ascensionLevel: number;
  minimumCharacterLevel: number;
  maximumCharacterLevel: number;
  maximumTalentLevel: number;

  constructor(aLevel: number, minCLevel: number, maxCLevel: number, maxTLevel: number) {
      this.ascensionLevel = aLevel;
      this.minimumCharacterLevel = minCLevel;
      this.maximumCharacterLevel = maxCLevel;
      this.maximumTalentLevel = maxTLevel;
  }
}

export const CharacterAscensionSpecs = [
    new CharacterAscensionSpec(0, 1, 20, 1),
    new CharacterAscensionSpec(1, 20, 40, 1),
    new CharacterAscensionSpec(2, 40, 50, 2),
    new CharacterAscensionSpec(3, 50, 60, 4),
    new CharacterAscensionSpec(4, 60, 70, 6),
    new CharacterAscensionSpec(5, 70, 80, 8),
    new CharacterAscensionSpec(6, 80, 90, 10)
]