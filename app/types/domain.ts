export type ChartToggleKey = "1w" | "1m" | "3m" | "6m" | "1y";

export interface Pilot {
  name: string;
  totalFlightHours: number;
}

export interface FlightHourEntry {
  date: string;
  hours: number;
}

export interface FlightLimits {
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
}

export interface ChartBound {
  limit: number;
  max: number;
  windowDays: number;
  displayRangeDays: number;
}

export type ChartBounds = Record<ChartToggleKey, ChartBound>;

export interface SummaryCardData {
  current: number;
  limit: number;
}

export interface SummaryCards {
  daily: SummaryCardData;
  weekly: SummaryCardData;
  monthly: SummaryCardData;
  annual: SummaryCardData;
}

export interface ChartPoint {
  x: string;
  y: number;
}

export interface FlightDataResponse {
  pilot: Pilot;
  limits: FlightLimits;
  chartBounds: ChartBounds;
  flightHours: FlightHourEntry[];
}

export interface DocumentThresholds {
  warningDays: number;
  comment?: string;
}

export interface DocumentItem {
  id: string;
  label: string;
  expiryDate: string;
}

export interface DocumentStatus {
  label: "Valid" | "Expired" | "Expiring Soon";
  class: string;
}

export interface ProcessedDocument extends DocumentItem {
  status: DocumentStatus;
}

export interface DocumentDataResponse {
  today: string;
  thresholds: DocumentThresholds;
  documents: DocumentItem[];
}

export type DutyType =
  | "DTY"
  | "RLV"
  | "SCK"
  | "TRV"
  | "TRX"
  | "ADM"
  | "FER"
  | "MED"
  | "REC"
  | "ULV";

export interface ScheduleLegendItem {
  code: DutyType;
  label: string;
  color: string;
}

export interface ScheduleItem {
  id: string;
  duty_date: string;
  status: 1 | 2;
  base_name: string;
  base_color: string;
  duty_type: DutyType;
  count_schedules: number;
  count_logbooks: number;
}

export interface ScheduleDataResponse {
  today: string;
  legend: ScheduleLegendItem[];
  schedules: ScheduleItem[];
}
