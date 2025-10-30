import Image from 'next/image'
import React from 'react'
const Page = () => {
    return (
        <div className='bg-[#F5F5F5] h-screen flex flex-col items-center justify-center'>
            <Image
                src="/logo/logo.png"
                alt="logo"
                width={150}
                height={100}
            />


            <div className='p-6 min-w-[530px] text-base mt-6 font rounded-3xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-white border-[2px] border-solid border-[#795CF5]'>
                <p className='font-semibold'> We’re confirming that you changed your password was successfully changed.</p>


                <p className='mt-4'>
                    If you made this change, no further action is needed.
                </p>

                <p className='mt-8 flex items-center justify-center'>
                    If you didn’t authorize this change, please <a href="" className='underline text-blue-500 ml-2 mr-2'> reset your password</a> immediately to protect your account.
                </p>

                <div className="mt-8">

                    <p>Thanks,</p>
                    <p className='font-semibold'>The Owners Universe Team</p>
                </div>
            </div>

            <div className='text-center mt-4 text-[14px]'>
                <p>Need help? Reach us at <a className='underline text-[#795CF5]'>support@ownersuniverse.com</a></p>
                <p>© 2025 Owners Universe <a className='underline text-[#795CF5]'>· Privacy Policy</a> <a className='underline text-[#795CF5]'>· Terms of Use</a></p>
                <p>[Company Address]</p>
            </div>
        </div >
    )
}

export default Page