import { OS } from "../enums";
import { DESKTOP_OS_LIST, MOBILE_OS_LIST } from "../consts";

export const getOS = (): OS => {
  //@ts-ignore
  const platform = navigator?.userAgentData?.platform || navigator.platform;
  const userAgent = navigator.userAgent;

  // Check for iOS
  if (
    /iPad|iPhone|iPod/.test(platform) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  )
    return OS.IOS;

  // Check for macOS
  if (platform.startsWith("Mac") || /Mac/.test(userAgent)) return OS.DARWIN;

  // Check for Windows
  if (platform.startsWith("Win") || /Win/.test(userAgent)) return OS.WINDOWS;

  // Check for Android
  if (/Android/.test(userAgent)) return OS.ANDROID;

  // Check for Linux
  if (/Linux/.test(platform)) return OS.LINUX;

  return OS.UNKNOWN;
};

export const isDesktop = (): boolean => DESKTOP_OS_LIST.includes(getOS());
export const isMobile = (): boolean => MOBILE_OS_LIST.includes(getOS());
