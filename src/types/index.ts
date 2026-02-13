export interface Config {
  token: string;
  oldcord: {
    baseURL: string;
    cdn?: string;
    mediaProxy?: string;
  };
}
