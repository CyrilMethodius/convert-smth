import { Engine, MachineDesignation, CargoBay, CrewPerson,
  FlyingMachineMeasurements, FlyingMachineWeights, FlyingMachinePerformance, FlyingMachineTakeOff } from '../eintities';
import { DomainEntity } from '../../_shared/base.entities';

export interface AircraftDescription extends DomainEntity {
    designation: MachineDesignation,
    measurements: FlyingMachineMeasurements,
    weights: FlyingMachineWeights,
    performance: FlyingMachinePerformance,
    takeoff?: FlyingMachineTakeOff,
    cargo?: CargoBay,
  
    cockpitCrew: CrewPerson[],
    powerplant: Engine[]
  
    firstFlight: Date,
    listPriceMlnUsd2020?: number
  }


export interface LinerDescription extends AircraftDescription {
  maxSeats: number
}

export interface CargoAirplaneDescription extends AircraftDescription {
  airlinerDerivative: boolean,
  unpressurized?: boolean
}