export const getDomainInfo = () => {
  const hostname = window.location.hostname.toLowerCase();
  // Use import.meta.env (Vite) - fallback to hardcoded if not set
  const base = import.meta.env.VITE_BASE_DOMAIN || "igrowbig.com";
  const mainDomains = [base, `www.${base}`, "localhost"];
  const isMain = mainDomains.includes(hostname);
  const isSubdomain = hostname.endsWith(`.${base}`) && hostname !== `www.${base}` && !isMain;
  const isCustom = !isMain && !isSubdomain;
  return { hostname, base, isMain, isSubdomain, isCustom };
};