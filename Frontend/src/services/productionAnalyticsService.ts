import type {
  ProductionEvent,
} from "../models/ProductionEvent";

export const calculateOperationTimes = (
  events: ProductionEvent[]
) => {

  const sortedEvents =
    [...events].sort(
      (a, b) =>
        new Date(
          a.timestamp
        ).getTime()
        -
        new Date(
          b.timestamp
        ).getTime()
    );

  const operationTimes =
    [];

  for (
    let i = 0;
    i < sortedEvents.length - 1;
    i++
  ) {

    const current =
      sortedEvents[i];

    const next =
      sortedEvents[i + 1];

    const durationMs =
      new Date(
        next.timestamp
      ).getTime()
      -
      new Date(
        current.timestamp
      ).getTime();

    const durationHours =
      Number(
        (
          durationMs /
          1000 /
          60 /
          60
        ).toFixed(2)
      );

    operationTimes.push({
      zone:
        current.zone,

      durationHours,
    });

  }

  return operationTimes;
};