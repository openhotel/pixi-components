import React, { ReactNode, useContext, useMemo } from "react";
import { useApplication } from "@pixi/react";

type SystemState = {
  browser: {
    name: string;
    version: string;
  };
  cpu: {
    arch: string;
    cores: number;
  };
  gpu: {
    name: string;
    vendor: string;
  };
};

const SystemContext = React.createContext<SystemState>(undefined);

type SystemProps = {
  children: ReactNode;
};

export const SystemProvider: React.FunctionComponent<SystemProps> = ({
  children,
}) => {
  const { app } = useApplication();

  const data = useMemo(() => {
    let browserName = "unknown";
    let browserVersion = "unknown";

    let cpuArch = "unknown";
    let cpuCores = 1;

    let gpuName = "unknown";
    let gpuVendor = "unknown";

    //browser
    let match =
      navigator.userAgent.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i,
      ) || [];

    browserName = match[1] ?? "unknown";
    browserVersion = match[2] || "unknown";

    //cpu
    cpuCores = navigator.hardwareConcurrency ?? 1;
    cpuArch =
      //@ts-ignore
      navigator.userAgentData?.platform || navigator.platform || "unknown";

    //gpu
    try {
      //@ts-ignore
      const gl = app.renderer.gl;
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

      if (debugInfo) {
        gpuName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      }
    } catch (e) {}

    return {
      browser: {
        name: browserName,
        version: browserVersion,
      },
      cpu: {
        arch: cpuArch,
        cores: cpuCores,
      },
      gpu: {
        name: gpuName,
        vendor: gpuVendor,
      },
    };
  }, [app]);

  return <SystemContext.Provider value={data} children={children} />;
};

export const useSystem = (): SystemState => useContext(SystemContext);
