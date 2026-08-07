import moment from "moment-timezone";

(moment as any).tz.setDefault("Africa/Addis_Ababa");

export const formatDateTime = (
  dateString: string | Date | null | undefined,
  format?: string,
): string => {
  if (!dateString) return "";
  // Format: 20 Sep 2025, 2:30 PM //example output you can change the format as per your need
  return moment(dateString).format(format ?? "DD MMM YYYY, h:mm A");
};
