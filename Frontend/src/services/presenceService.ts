export type PresenceRecord = {
  epc: string;
  lastSeen: string;
};

class PresenceService {
  private readonly storageKey =
    "rfid-presence";

  registerRead(
    epc: string,
    timestamp: string
  ) {
    const records =
      this.getRecords();

    records[epc] = {
      epc,
      lastSeen: timestamp,
    };

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(records)
    );
  }

  private getRecords(): Record<
    string,
    PresenceRecord
  > {
    return JSON.parse(
      localStorage.getItem(
        this.storageKey
      ) ?? "{}"
    );
  }

  getLastSeen(
    epc: string
  ) {
    const records =
      this.getRecords();

    return records[epc];
  }

  isPresent(
    epc: string
  ) {
    const record =
      this.getLastSeen(epc);

    if (!record) {
      return false;
    }

    const lastSeen =
      new Date(
        record.lastSeen
      ).getTime();

    const now =
      Date.now();

    return (
      now - lastSeen <
      60000
    );
  }

  getAll() {
    return Object.values(
      this.getRecords()
    );
  }
}

export const presenceService =
  new PresenceService();