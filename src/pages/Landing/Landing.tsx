import React from 'react'; // Updated import
import LandingHeader from "../common/LandingHeader/LandingHeader";
import LandingFooter from '../common/LandingFooter/LandingFooter';
import Stats from "../Landing/sections/Stats";
import Features from "../Landing/sections/Features";

import Products from "../Landing/sections/Products";


import Services from "../Landing/sections/Services";

import Reviews from "../Landing/sections/Reviews";
import DynamicProductFAQ from "../Landing/sections/DynamicProductFAQ";
import Experience from"../Landing/sections/Experience";
import OurInventory from "../Landing/sections/OurInventory";

const Landing: React.FC = () => {
    return (
        <div className="flex flex-col w-full">
            <LandingHeader/>
            <Stats></Stats>
            <Features />
            {/* 1. HERO (Full Width) */}
       
            {/* 3. REVIEWS (Full Width) */}
            {/* We place this OUTSIDE the container so the background hits the edges */}
             {/* <Products /> */}
            <OurInventory />
            <Services />
            <Reviews />
          <DynamicProductFAQ />
        
             <Experience></Experience>
            <LandingFooter/>

        </div>
    );
};

export default Landing;