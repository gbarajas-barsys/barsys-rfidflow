export const calculateOperationTimes =
(
  events: ProductionEvent[]
) => {

  const result = [];

  for (
    let i = 0;
    i < events.length - 1;
    i++
  ) {

    const current =
      events[i];

    const next =
      events[i + 1];

    const durationMs =
      new Date(
        next.timestamp
      ).getTime()
      -
      new Date(
        current.timestamp
      ).getTime();

    result.push({
      zone:
        current.zone,

      durationHours:
        durationMs /
        1000 /
        60 /
        60,
    });

  }

  return result;

};