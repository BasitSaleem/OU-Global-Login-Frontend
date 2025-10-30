import Image from 'next/image'
import React from 'react'

const Check = () => {
    return <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.5 7.3708C0.5 7.3708 1.94 8.3308 2.9 9.2908C3.86 10.2508 4.5 11.1908 4.5 11.1908C5.14 8.7908 6.008 4.5308 11 0.690796" stroke="white" />
    </svg>

}
const Page = () => {
    return (
        <div className='bg-[#fff]  py-10 flex flex-col items-center justify-center'>
            <Image
                src="/logo/logo.png"
                alt="logo"
                width={150}
                height={100}
            />


            <div className='p-5 max-w-[600px] text-base mt-6 font rounded-3xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-white border-[2px] border-solid border-[#795CF5]'>
                {/* WELCOME SECTION */}

                <div className="relative w-[560px] h-[290px] rounded-4xl overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#795CF5] to-[#B11E67]"></div>

                    {/* Wavy Bottom */}
                    <svg
                        className="absolute bottom-0 left-0 w-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 630 80"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,50 C150,80 480,0 630,40 L830,80 L0,80 Z"
                            fill="#fff"
                            opacity="1"
                        />
                    </svg>
                    <div className='text-center '>

                        <p className="absolute w-[380px]  inset-0 text-[40px] font-bold text-center  text-white z-20">
                            Welcome to Owners Inventory!
                        </p>
                    </div>
                </div>

                <div className='mt-4'>
                    <div className='flex flex-col gap-y-6'>

                        <p className='font-semibold'>Hi, Ahmed</p>
                        <p className=''>You’ve officially joined the [Organization Name] Organization on Owners Inventory — your all-in-one platform for managing inventory, POS, HR, finance, and eCommerce.</p>
                        <p className=''>
                            Your account is now active, and you’re just a few steps away from confidently running your day-to-day operations.                        </p>
                        <p className=''>
                            To help you get started quickly, we recommend watching our short walkthrough video and exploring key features like product setup, stock tracking, and sales management.                    </p>
                        <p className='flex items-center justify-center mt-[-30px]'>

                            <a href="" className='mt-6 px-2 py-3 bg-[#795CF5] text-white rounded-sm'>
                                Start Exploring Owners Inventory                            </a>
                        </p>
                    </div>
                    <div >
                        <p className='font-semibold mt-4'>Get Get Started Quickly</p>
                        <div className='mt-4 flex flex-col gap-y-5'>

                            <div className='rounded-xl border-l-[#FFCB00] bg-white border-l-solid border-l-[6px] py-6 px-14 h-auto relative'>
                                <p className='font-semibold text-[18px]'>Read the Docs</p>
                                <p className='text-base text-[#6B7280] '>Quick answers for every module</p>

                            </div>
                            <div className='rounded-xl border-l-[#1AD1B9] bg-white border-l-solid border-l-[6px] py-6 px-14 h-auto relative'>
                                <p className='font-semibold text-[18px]'>Watch a Product Walkthrough</p>
                                <p className='text-base text-[#6B7280] '>Get familiar with product setup, stock tracking & sales management</p>

                            </div>
                            <div className='rounded-xl border-l-[#F95C5B] bg-white border-l-solid border-l-[6px] py-6 px-14 h-auto relative'>
                                <p className='font-semibold text-[18px]'>24/7 Chat Support</p>
                                <p className='text-base text-[#6B7280] '>We’re always here if you need help</p>

                            </div>
                        </div>
                        <div className='border-[2px] border-[#E5E7EB] border-solid p-4 mt-4 rounded-[20px]'>
                            <p className='font-semibold text-center'>What You Can Access</p>
                            <p className='text-base text-[#6B7280] text-center '>Your access to features in [Organization Name] Organization is customized based on your role. </p>
                            <div className='bg-[#795CF512] p-4'>
                                <p className='font-[600]'>Depending on your permissions, you may be able to:</p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default Page