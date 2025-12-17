/**
 * Utils index - 공통 유틸리티 export
 */

export { formatRelativeTime, timeAgo, formatNumber, formatDate } from './format';
export { getDeviceId, hasDeviceId, USER_KEY } from './device';
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
