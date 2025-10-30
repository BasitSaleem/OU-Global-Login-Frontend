import Image from 'next/image'
import React from 'react'
const Page = () => {
    return (
        <div className='bg-[#E5E7EB] h-screen flex flex-col items-center justify-center'>
            <Image
                src="/logo/logo.png"
                alt="logo"
                width={150}
                height={100}
            />


            <div className='p-5 max-w-[650px] text-base mt-6 font rounded-3xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-white border-[2px] border-solid border-[#795CF5]'>
                <p className='font-semibold'> We received a request to reset the password for your account.</p>
                <p className=' mt-4'>To proceed, click the button below to set a new password.</p>
                <p className='mt-2 flex items-center justify-center'>

                    <a href="" className='mt-6 px-2 py-3 bg-[#795CF5] text-white rounded-sm'>
                        Reset Password
                    </a>
                </p>

                <p className='mt-4'>
                    For your security, this link will expire in 24 hours. If it expires, simply <a href="" className='underline text-blue-500'> request a new password reset</a>.
                </p>
                <p className='mt-8'>
                    If you didn’t request this, you can safely ignore this email.
                </p>
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