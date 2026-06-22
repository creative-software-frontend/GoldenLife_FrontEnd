import React from 'react';
import banner1 from '../../../../public/image/Banner/1.png';
import banner2 from '../../../../public/image/Banner/2.png';
import banner3 from '../../../../public/image/Banner/3.png';
import banner3 from '../../../../public/image/Banner/4.png';
import banner3 from '../../../../public/image/Banner/5.png';
import banner3 from '../../../../public/image/Banner/6.png';
import banner3 from '../../../../public/image/Banner/7.png';
import banner3 from '../../../../public/image/Banner/8.png';
import banner3 from '../../../../public/image/Banner/9.png';

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
