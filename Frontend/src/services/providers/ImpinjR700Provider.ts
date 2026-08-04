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

  constructor(
    private readonly baseUrl: string
  ) {}

  async connect(): Promise<void> {
    this.intervalId =
      window.setInterval(
        async () => {
          try {
            const response =
              await fetch(
                `${this.baseUrl}/api/reads`
              );

            if (!response.ok) {
              return;
            }

            const reads =
              await response.json();

            reads.forEach(
              (read: any) => {
                const event: RFIDRead = {
                  epc: read.epc,
                  timestamp:
                    new Date(
                      read.timestamp
                    ).toLocaleTimeString(),
                };

                this.listeners.forEach(
                  (listener) =>
                    listener(event)
                );
              }
            );
          } catch (error) {
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
    if (this.intervalId) {
      clearInterval(
        this.intervalId
      );

      this.intervalId = null;
    }
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
            listener !== callback
        );
    };
  }
}