import { useEffect, useState } from "react";

import { rfidService }
  from "../services/rfidService";

type RFIDRead = {
  epc: string;
  timestamp: string;
};

export default function TestReaderPage() {
  const [reads, setReads] =
    useState<RFIDRead[]>([]);

  useEffect(() => {
    let unsubscribe =
      () => {};

    const start = async () => {
      await rfidService.connect();

      unsubscribe =
        rfidService.subscribe(
          (read: RFIDRead) => {
            setReads(
              (prev) => [
                read,
                ...prev,
              ]
            );
          }
        );
    };

    start();

    return () => {
      unsubscribe();

      rfidService.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        padding: "24px",
      }}
    >
      <h1>
        Test Reader
      </h1>

      <h2>
        Total Lecturas:
        {reads.length}
      </h2>

      {reads.map(
        (read, index) => (
          <div
            key={index}
          >
            <div>
              EPC:
              {" "}
              {read.epc}
            </div>

            <div>
              Timestamp:
              {" "}
              {read.timestamp}
            </div>

            <hr />
          </div>
        )
      )}
    </div>
  );
}