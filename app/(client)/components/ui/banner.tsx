import React from 'react'
import {ArrowLeftIcon, ArrowRightIcon} from "lucide-react";
import {Zoom} from "react-slideshow-image";
import 'react-slideshow-image/dist/styles.css'

const Banner = () => {
    const images = [
        "images/for-her.png",
        "images/for-him.png",
    ];
    const zoomInProperties = {
        scale:1,
        duration:5000,
        transitionDuration:300,
        infinity:true,

        prevArrow:(
            <div className='ml-10 top-40 md:top-72'>
                <ArrowLeftIcon className='h-8 w-8 text-white cursor-pointer'/>
            </div>
        ),
        nextArrow:(
            <div className='mr-10 top-40 md:top-72'>
                <ArrowRightIcon className='h-8 w-8 text-white cursor-pointer'/>
            </div>
        )
    }
    return (
        <div className='w-full h-1/3'>
            <Zoom {...zoomInProperties}>
                {images.map((each, index) =>
                <div key={index} className='flex justify-center md:items-center items-start w-screen h-1/3 relative'>
                    <img className='w-screen' src={each} alt='v'/>
                </div>
                )}
            </Zoom>
        </div>
    )
}

export default Banner
