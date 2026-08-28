export interface Reader {
  id: number;

  name: string;

  model: string;

  ipAddress: string;

  status:
    | "online"
    | "offline";
}