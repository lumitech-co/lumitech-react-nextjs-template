export interface IExtractionFieldListItem {
  id: string;
  fieldName: string;
  displayName: string;
  synonymsCount: number;
  rulesCount: number;
}

export interface IExtractionFieldListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IExtractionFieldListResponse {
  data: IExtractionFieldListItem[];
  totalCount: number;
  hasNextPage: boolean;
}

export interface IFieldValidationRule {
  id: string;
  ruleText: string;
  displayOrder: number;
}

export interface IFieldSynonym {
  id: string;
  synonymText: string;
}

export interface IExtractionField {
  id: string;
  fieldName: string;
  displayName: string;
  category: string | null;
  description: string | null;
  aiHint: string | null;
  targetRow: number | null;
  targetColumn: string | null;
  fieldValidationRules: IFieldValidationRule[];
  fieldSynonyms: IFieldSynonym[];
}

export interface IUpdateExtractionFieldRequest {
  aiHint?: string | null;
  synonyms?: string[];
  validationRules?: string[];
}

export interface IUpdateConfidenceThresholdRequest {
  threshold: number;
}

export interface IUpdateConfidenceThresholdResponse {
  lowConfidenceThreshold: number;
  updatedAt: string;
}
