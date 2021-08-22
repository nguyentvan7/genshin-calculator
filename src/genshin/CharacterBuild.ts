export class CharacterBuild {
    characterAscension: number;
    characterLevel: number;
    normalTalentLevel: number;
    skillTalentLevel: number;
    burstTalentLevel: number;

    constructor(ascension: number = 0, level: number = 1, nLevel: number = 1, sLevel: number = 1, bLevel: number = 1) {
        this.characterAscension = ascension;
        this.characterLevel = level;
        this.normalTalentLevel = nLevel;
        this.skillTalentLevel = sLevel;
        this.burstTalentLevel = bLevel;
    }
}