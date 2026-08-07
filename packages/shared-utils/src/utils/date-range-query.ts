type DateRangeQuery = {
  startDate?: string | Date;
  endDate?: string | Date;
};

export const buildDateRangeQuery = ({ startDate, endDate }: DateRangeQuery) => {
  if (!startDate && !endDate) return undefined;

  const createdAt: Record<string, Date> = {};

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    createdAt.$gte = start;
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    end.setHours(0, 0, 0, 0);
    createdAt.$lt = end;
  }

  return createdAt;
};
