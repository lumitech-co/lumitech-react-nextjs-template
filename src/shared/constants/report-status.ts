export enum ReportStatus {
  OK_PDF_DOWNLOADED = 'ok_pdf_downloaded',
  OK_HTML_RENDERED_TO_PDF = 'ok_html_rendered_to_pdf',

  PDF_FOUND = 'pdf_found',
  PDF_FOUND_AFTER_INTERACTION = 'pdf_found_after_interaction',
  REPORT_FOUND_UNVERIFIED = 'report_found_unverified',
  CACHE_UNSTABLE_URL_REPLAY = 'cache_unstable_url_replay',

  IR_PAGE_FOUND_STATIC = 'ir_page_found_static',
  IR_PAGE_FOUND_JS_REQUIRED = 'ir_page_found_js_required',
  IR_PAGE_FOUND_BLOCKED = 'ir_page_found_blocked',

  REPORT_NOT_FOUND_FOR_YEAR = 'report_not_found_for_year',
  REPORT_PAGE_FOUND_BUT_PDF_MISSING = 'report_page_found_but_pdf_missing',
  NO_EMBEDDED_PDF_FOUND = 'no_embedded_pdf_found',
  NO_OFFICIAL_DOMAIN = 'no_official_domain',
  OFFICIAL_SITE_NOT_FOUND = 'official_site_not_found',

  SEARCH_FAILED = 'search_failed',
  SEARCH_TIMEOUT = 'search_timeout',

  DOWNLOAD_BLOCKED_BY_CDN = 'download_blocked_by_cdn',
  PDF_SECURITY_INTERSTITIAL = 'pdf_security_interstitial',
  PDF_WRONG_FISCAL_YEAR = 'pdf_wrong_fiscal_year',
  SEMANTIC_REJECTED = 'semantic_rejected',
  DOWNLOAD_FAILED_TRANSPORT = 'download_failed_transport',
  DOWNLOAD_FAILED = 'download_failed',
  PDF_VALIDATION_FAILED = 'pdf_validation_failed',
  REPORT_FOUND_FETCH_FAILED = 'report_found_fetch_failed',

  RENDER_FAILED = 'render_failed',
  RENDER_URL_INVALID = 'render_url_invalid',
  RENDER_INVALID_CONTENT = 'render_invalid_content',

  UNEXPECTED_ERROR = 'unexpected_error',
  PROCESSING = 'processing',
}
