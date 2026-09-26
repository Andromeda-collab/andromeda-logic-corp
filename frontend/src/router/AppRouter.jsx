import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

import Home from "../pages/Home/index.jsx";
import TechnologyHub from "../pages/Technology/index.jsx";
import TechnologyDetail from "../pages/Technology/TechnologyDetail.jsx";
import ProductsHub from "../pages/Products/index.jsx";
import ProductDetail from "../pages/Products/ProductDetail.jsx";
import SolutionsHub from "../pages/Solutions/index.jsx";
import SolutionDetail from "../pages/Solutions/SolutionDetail.jsx";
import Research from "../pages/Research/index.jsx";
import CaseStudiesHub from "../pages/CaseStudies/index.jsx";
import CaseStudyDetail from "../pages/CaseStudies/CaseStudyDetail.jsx";
import Newsroom from "../pages/Newsroom/index.jsx";
import Careers from "../pages/Careers/index.jsx";
import JobDetail from "../pages/Careers/JobDetail.jsx";
import About from "../pages/About/index.jsx";
import Library from "../pages/Library/index.jsx";
import Investors from "../pages/Investors/index.jsx";
import Contact from "../pages/Contact/index.jsx";
import Trust from "../pages/Trust/index.jsx";
import NotFound from "../pages/NotFound/index.jsx";

// Route map — mirrors Section 6.3 (URL Structure) and Annexure A.1 (Header Menu)
export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/technology" element={<TechnologyHub />} />
          <Route path="/technology/:specialtySlug" element={<TechnologyDetail />} />

          <Route path="/products" element={<ProductsHub />} />
          <Route path="/products/:platformSlug" element={<ProductDetail />} />

          <Route path="/solutions" element={<SolutionsHub />} />
          <Route path="/solutions/:personaSlug" element={<SolutionDetail />} />

          <Route path="/research" element={<Research />} />

          <Route path="/missions" element={<CaseStudiesHub />} />
          <Route path="/missions/:missionSlug" element={<CaseStudyDetail />} />

          <Route path="/newsroom" element={<Newsroom />} />
          <Route path="/newsroom/:year/:slug" element={<Newsroom />} />

          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:jobSlug" element={<JobDetail />} />

          <Route path="/about" element={<About />} />

          <Route path="/library" element={<Library />} />
          <Route path="/library/:resourceSlug" element={<Library />} />

          <Route path="/investors" element={<Investors />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/trust" element={<Trust />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}