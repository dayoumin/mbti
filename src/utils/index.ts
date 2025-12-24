/**
 * Utils index - 공통 유틸리티 export
 */

export { formatRelativeTime, timeAgo, formatNumber, formatDate } from './format';
export { getDeviceId, hasDeviceId, USER_KEY } from './device';
export { getIconComponent, type IconComponent } from './icons';
export {
  generateShareUrl,
  generateCurrentPageShareUrl,
  parseUTMFromUrl,
  parseAndStoreUTM,
  getStoredUTM,
  clearStoredUTM,
  storeReferrer,
  getStoredReferrer,
  getAcquisitionInfo,
  getUTMForAnalytics,
  type UTMParams,
  type SharePlatform,
  type ShareContent,
  type ReferrerInfo,
} from './utm';
export {
  FACT_REQUIRED_CATEGORIES,
  isFactRequiredCategory,
  generateFactId,
  parseFactId,
  isValidFactId,
  getNextFactNumber,
  getDaysSinceVerification,
  getVerificationStatus,
  generateFactMarkdown,
  type VerificationStatus,
} from './fact';
