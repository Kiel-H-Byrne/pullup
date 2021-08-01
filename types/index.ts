export interface GLocation { lat: number, lng: number }

export interface PullUp {
  _id: any;
  pid: string;
  uid: string;
  userName: string;
  message: string;
  location: GLocation;
  timestamp: Date;
  media?: object;
}