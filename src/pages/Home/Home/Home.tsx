import { useSearchParams } from "react-router-dom"; 
import HeroSection from "../HeroSection/HeroSection";
import Categories from "../Categories/Categories";
import ProductCategories from "../ProductCategories/ProductCategories";
import FreshSell from "../FreshSell/FreshSell"; 
import AutoScrollIcons from "../ScrollCategories/ScrollCategories";
import CourseCategories from "../CoursesCategory/CoursesCategory";

const Home = () => {
  // 1. Check if there is a search keyword in the URL
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q");

  return (
    <div>
      {/* ========================================================
        CONDITION 1: IF SEARCHING (?q=something)
        Only show the FreshSell component (it will act as Search Results)
        ========================================================
      */}
      {keyword ? (
        <div className="mx-0 md:mx-4 lg:mx-8">
            <FreshSell />
        </div>
      ) : (
      /* ========================================================
        CONDITION 2: IF NOT SEARCHING (Normal Home Dashboard)
        Show all banners, categories, and normal FreshSell
        ========================================================
      */
        <>
            <div className="mx-0 md:mx-8">
                <HeroSection />
            </div>

            <div className="mx-0 md:mx-4 lg:mx-8">
                <AutoScrollIcons />
            </div>

            <div className="mx-0 md:mx-4 lg:mx-8">
                <CourseCategories />
            </div>

            <div className="mx-0 md:mx-4 lg:mx-8">
                <Categories />
            </div>

            {/* <div className="mx-0 md:mx-4 lg:mx-8">
                <ProductCategories />
            </div> */}

            <div className="mx-0 md:mx-4 lg:mx-8">
                {/* This will show the default Flash Sale products */}
                <FreshSell /> 
            </div>
        </>
      )}
    </div>
  );
};

export default Home;