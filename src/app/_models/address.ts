export interface DropPoint {
  key: string; // or enum reference
  name: string;
  lat: number;
  lng: number;
}

export const DropLocations: DropPoint[] = [
  { key: 'InnerGate', name: 'Inner Gate, Shiv Nadar University', lat: 28.5255696, lng: 77.5716844},
  { key: 'ParkingOne', name: 'Parking One, Shiv Nadar University', lat: 28.5245085, lng: 77.5742751 },
  { key: 'ParkingTwo', name: 'Parkingn Two, Shiv Nadar University', lat: 28.5272847, lng: 77.5752501 },
];
