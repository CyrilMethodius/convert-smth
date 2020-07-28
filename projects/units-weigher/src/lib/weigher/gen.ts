import { UVal } from '../cors/z_barrel';
import { mass, lgth, velo, vol } from '../def/z_barrel';
import { IWeigher } from './iWeigher';
import { Lgth } from './measures/Lgth';
import { Mass } from './measures/Mass';
import { Velo } from './measures/Velo';
import { Vol } from './measures/Vol';

export class gen {
    private _weighers: { name: string, measure: IWeigher }[] = [];

    for(uval: UVal<number>): IWeigher {
        const className = uval.constructor.name;

        if (0 === this._weighers.filter(x => x.name === className).length)
            this._weighers.push({ name: className, measure: this.make(className) });

        return this._weighers.filter(x => x.name === className)[0].measure;
    }

    private make(className: string): IWeigher {
        if (mass.name === className)
            return new Mass();
        if (lgth.name === className)
            return new Lgth();
        if (velo.name === className)
            return new Velo();
        if (vol.name === className)
            return new Vol();
        // if (temperature.name === className)
        //     return new Temperature();

        return null; // throw new UValErr(`${className} forgotten`);
    }
}