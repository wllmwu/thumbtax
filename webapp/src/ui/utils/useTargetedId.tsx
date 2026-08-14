import { useLocation } from "react-router";

export function useTargetedId() {
  const location = useLocation();
  return location.hash.replace("#", "");
}
