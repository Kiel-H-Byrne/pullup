export interface GLocation { lat: number, lng: number }

export interface PullUp {
  pid: string;
  uid: string;
  message: string;
  location: GLocation;
  timestamp: Date;
  media?: object;
}