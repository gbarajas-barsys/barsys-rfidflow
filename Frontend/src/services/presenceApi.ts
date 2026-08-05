export type PresenceRecord = {
  epc: string;
  lastSeen: string;
  present: boolean;
};

export async function getPresence(): Promise<
  PresenceRecord[]
> {
  const readerUrl =
    localStorage.getItem(
      "rfid-reader-url"
    ) ??
    "http://localhost:5120";

  const response =
    await fetch(
      `${readerUrl}/api/presence`
    );

  if (!response.ok) {
    throw new Error(
      "Unable to retrieve presence data."
    );
  }

  const data =
    await response.json();

  return data as PresenceRecord[];
}