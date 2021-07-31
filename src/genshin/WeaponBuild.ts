export class WeaponBuild {
    weaponStars: number;
    weaponAscension: number;
    weaponLevel: number;

    constructor(stars: number = 4, ascension: number = 0, level: number = 1) {
        this.weaponStars = stars;
        this.weaponAscension = ascension;
        this.weaponLevel = level;
    }
}