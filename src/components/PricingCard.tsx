import React from 'react';

// Define the types for our pricing card
interface PricingFeature {
    text: string;
    included: boolean;
}

interface PricingCardProps {
    title: string;
    price: string;
    pricePeriod?: string;
    buttonText: string;
    userCount: string;
    features: string[] | PricingFeature[];

    borderColor: string;
    buttonColor: string;
    priceColor: string;
    background?: string;

    badge?: {
        text: string;
        backgroundColor: string;
        textColor?: string;
    };

    isCurrentPlan?: boolean;
    isPopular?: boolean;

    onButtonClick?: () => void;

    className?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
    title,
    price,
    pricePeriod = '/month',
    buttonText,
    userCount,
    features,
    borderColor,
    buttonColor,
    priceColor,
    background = 'white',
    badge,
    isCurrentPlan = false,
    isPopular = false,
    onButtonClick,
    className = '',
}) => {
    const renderFeatures = () => {
        if (features.length === 0) return null;

        if (typeof features[0] === 'string') {
            return (features as string[]).map((feature, index) => (
                <div
                    key={index}
                    className="text-center flex justify-center flex-col  text-base font-normal leading-9 break-words font-inter"
                >
                    {feature}
                </div>
            ));
        } else {
            return (features as PricingFeature[]).map((feature, index) => (
                <div
                    key={index}
                    className={`text-center flex justify-center flex-col text-base font-normal leading-9 break-words font-inter ${feature.included
                        ? 'text-[#231F20] opacity-100'
                        : 'text-[#6B7280] opacity-60 line-through'
                        }`}
                >
                    {feature.text}
                </div>
            ));
        }
    };

    return (
        <div
            className={`relative flex flex-col items-center p-5 rounded-3xl border-2 box-border bg-bg-secondary h-[830px] cursor-pointer ${className}`}
            style={{
                borderColor,
            }}
        >
            {badge && (
                <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-36 h-7 flex items-center justify-center z-10 rounded-2xl"
                    style={{
                        backgroundColor: badge.backgroundColor,
                    }}
                >
                    <div
                        className="text-center flex justify-center flex-col text-white text-sm font-semibold break-words font-inter"
                        style={{ color: badge.textColor || 'white' }}
                    >
                        {badge.text}
                    </div>
                </div>
            )}

            <div
                className={`w-full flex flex-col justify-start items-center gap-2.5 ${badge ? 'mt-2.5' : ''
                    }`}
            >
                <div className="w-full text-center text-2xl font-semibold break-words font-inter">
                    {title}
                </div>

                <div className="w-full text-center flex justify-center flex-col">
                    <span
                        className="text-4xl font-semibold break-words font-inter"
                        style={{ color: priceColor }}
                    >
                        {price}
                    </span>
                    {pricePeriod && (
                        <span
                            className="text-sm font-normal break-words font-inter"
                            style={{ color: priceColor }}
                        >
                            {pricePeriod}
                        </span>
                    )}
                </div>

                {/* Button */}
                <div
                    className="w-full h-10 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ backgroundColor: buttonColor }}
                    onClick={onButtonClick}
                >
                    <div className="text-center flex justify-center flex-col text-white text-base font-semibold break-words font-inter">
                        {buttonText}
                    </div>
                </div>

                {/* User Count */}
                <div className="w-full h-5 text-center flex justify-center flex-col text-base font-normal leading-9 break-words font-inter">
                    {userCount}
                </div>

                {/* Features */}
                <div className="w-full text-center flex justify-center flex-col gap-1">
                    {renderFeatures()}
                </div>
            </div>
        </div>
    );
};

// Export the component and types
export { PricingCard };
export type { PricingCardProps, PricingFeature };