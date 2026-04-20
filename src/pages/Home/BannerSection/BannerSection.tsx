import React from 'react';
import sampleImage1 from '../../../../public/image/Banner/Screenshot_6.png';
import sampleImage2 from '../../../../public/image/Banner/Screenshot_5.png';
import sampleImage3 from '../../../../public/image/Banner/Screenshot_7.png';

const Banner: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 md:max-w-[1040px]  " >

            {/* First Image Div */}
            <img src={sampleImage1} alt="Discount Image 1" className=" min-w-[300px] h-auto md:w-full md:h-auto rounded-lg" />
            <img src={sampleImage2} alt="Discount Image 1" className=" min-w-[300px] h-auto rounded-lg" />
            <img src={sampleImage3} alt="Discount Image 1" className=" min-w-[300px]  h-auto rounded-lg" />




        </div>
    );
};

export default Banner;
