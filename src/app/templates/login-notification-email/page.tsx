import Image from 'next/image'
import React from 'react'
const Page = () => {
    return (
        <div className='bg-[#795CF512] h-screen flex flex-col items-center justify-center'>
            <Image
                src="/logo/logo.png"
                alt="logo"
                width={150}
                height={100}
            />


            <div className='p-5 text-base mt-6 font rounded-3xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-white border-[2px] border-solid border-[#795CF5]'>
                <p>Hi, <span className='font-semibold'> Basit</span>,</p>
                <p className='font-semibold mt-4'>We noticed a new login to your account from a new device or location.</p>
                <div className='mt-4'>
                    <p className='font-semibold'>
                        IP Address: [IP Address]
                    </p>
                    <p className='font-semibold'> Location: [City, Country] </p>
                    <p className='font-semibold'>Time: [Date], [Time], [Time Zone]</p>
                </div>
                <p className='mt-8'><span className='font-semibold'> If this looks familiar</span>, you’re all set!</p>
                <div className='mt-8'>

                    <p> If not, we strongly recommend you:</p>
                    <ul className='list-disc pl-5 space-y-1'>
                        <li><a href="" className='underline text-blue-500'>Reset your password</a></li>
                        <li><a href="" className='underline text-blue-500'>Log out of all devices</a></li>
                        <li>Enable <a href="" className='underline text-blue-500'> Two-Factor Authentication</a> for added security</li>
                    </ul>
                </div>
                <div className="mt-8">

                    <p>Thanks,</p>
                    <p className='font-semibold'>The Owners Universe Team</p>
                </div>
            </div>

            <div className='text-center mt-4 '>
                <p>Need help? Reach us at <a className='underline text-[#795CF5]'>support@ownersuniverse.com</a></p>
                <p>© 2025 Owners Universe <a className='underline text-[#795CF5]'>· Privacy Policy</a> <a className='underline text-[#795CF5]'>· Terms of Use</a></p>
                <p>[Company Address]</p>
            </div>
        </div >
    )
}

export default Page