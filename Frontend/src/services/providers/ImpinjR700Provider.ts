export type RFIDRead = {
  epc: string;
  timestamp: string;
};

export class ImpinjR700Provider {
  private listeners: ((
    read: RFIDRead
  ) => void)[] = [];

  private intervalId:
    number | null = null;

  private connected =
    false;

  private lastSuccessfulPoll:
    string | null = null;

  private readonly baseUrl: string;

constructor(baseUrl: string) {
  this.baseUrl = baseUrl;
}

  public isConnected() {
    return this.connected;
  }

  public getLastSuccessfulPoll() {
    return this.lastSuccessfulPoll;
  }

  async connect(): Promise<void> {
    if (
      this.intervalId !==
      null
    ) {
      return;
    }

    this.intervalId =
      window.setInterval(
        async () => {
          try {
            const response =
              await fetch(
                `${this.baseUrl}/api/reads`
              );

            if (
              !response.ok
            ) {
              this.connected =
                false;

              return;
            }

            this.connected =
              true;

            this.lastSuccessfulPoll =
              new Date().toLocaleTimeString();

            const reads =
              await response.json();

            reads.forEach(
              (read: {
                epc: string;
                timestamp: string;
              }) => {
                const event: RFIDRead =
                  {
                    epc:
                      read.epc,
                    timestamp:
                      new Date(
                        read.timestamp
                      ).toLocaleTimeString(),
                  };

                this.listeners.forEach(
                  (
                    listener
                  ) =>
                    listener(
                      event
                    )
                );
              }
            );
          } catch (
            error
          ) {
            this.connected =
              false;

            console.error(
              "R700 Provider Error",
              error
            );
          }
        },
        5000
      );
  }

  async disconnect(): Promise<void> {
    if (
      this.intervalId !==
      null
    ) {
      clearInterval(
        this.intervalId
      );

      this.intervalId =
        null;
    }

    this.connected =
      false;
  }

  subscribe(
    callback: (
      read: RFIDRead
    ) => void
  ): () => void {
    this.listeners.push(
      callback
    );

    return () => {
      this.listeners =
        this.listeners.filter(
          (listener) =>
            listener !==
            callback
        );
    };
  }
}