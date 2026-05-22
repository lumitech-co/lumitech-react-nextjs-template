export interface IScreeningConfigData {
  excludedSectors: string[];
  marketCapThresholdMinGbp: number;
  updatedAt: string;
}

export interface IGetScreeningConfigResponse {
  message: string;
  data: IScreeningConfigData;
}

export interface IUpdateScreeningConfigRequest {
  excludedSectors: string[];
  marketCapThresholdMinGbp: number;
}

export interface IUpdateScreeningConfigResponse {
  message: string;
  data: IScreeningConfigData;
}
