import { useCallback, useEffect, useRef, useState } from "react";

export function useWeatherNotifications(alerts = [], enabled = true) {
  const [permission, setPermission] = useState(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "unsupported";
  });

  const notifiedAlertsRef = useRef(new Set());

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return "unsupported";
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (err) {
      console.error("Error requesting notification permission:", err);
      return Notification.permission;
    }
  }, []);

  useEffect(() => {
    if (!enabled || permission !== "granted" || !alerts.length) return;

    alerts.forEach((alert) => {
      const alertKey = `${alert.type}-${alert.title}-${alert.severity}`;

      if (!notifiedAlertsRef.current.has(alertKey)) {
        notifiedAlertsRef.current.add(alertKey);

        try {
          const notification = new Notification(`Weatherly: ${alert.title}`, {
            body: alert.message,
            icon: "/favicon.ico",
            tag: alertKey,
            renotify: false,
          });

          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        } catch (err) {
          console.warn("Failed to dispatch browser notification:", err);
        }
      }
    });
  }, [alerts, enabled, permission]);

  return {
    permission,
    requestPermission,
    isSupported: permission !== "unsupported",
  };
}
