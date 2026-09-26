import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll position to the top on every route change.
// React Router doesn't do this automatically — without it, navigating to a
// new page keeps whatever scroll position you were at on the previous page.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}