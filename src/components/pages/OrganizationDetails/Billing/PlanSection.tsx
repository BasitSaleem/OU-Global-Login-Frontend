import React from 'react';
import { motion } from "framer-motion";
import { PricingCard } from "@/components/PricingCard";
import { Button } from '@/components/ui';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const PlanSection = () => {
    const pricingPlans = [
        {
            title: "Basic",
            price: "Free",
            pricePeriod: "",
            buttonText: "Activated",
            userCount: "2 seats",
            features: [
                "Human Resource",
                "Single Location",
                "Single Warehouse",
                "100 Products",
                "Advance Point of Sales",
                "100 Invoices / Month",
                "50 Purchase Orders / Month",
                "100 Transfer Orders / Month",
                "Online Store",
                "Coupons",
                "Basic Accounts & Financials"
            ],
            borderColor: "#FFCB00",
            buttonColor: "#1AD1B9",
            priceColor: "#1AD1B9",
            badge: {
                text: "Current Plan",
                backgroundColor: "#FFCB00",
                textColor: "#231F20"
            },
            isCurrentPlan: true
        },
        {
            title: "Standard",
            price: "$49",
            pricePeriod: "/month",
            buttonText: "Upgrade Now",
            userCount: "5 users",
            features: [
                "5 users",
                "Human Resource",
                "02 Locations",
                "02 Warehouse",
                "Unlimited Products",
                "Advance Point of Sales",
                "700 Invoices / Month",
                "500 Purchase Orders / Month",
                "700 Transfer Orders / Month",
                "Online Store",
                "Coupons",
                "Basic Accounts & Financials"
            ],
            borderColor: "#E5E7EB",
            buttonColor: "#38ACCC",
            priceColor: "#38ACCC"
        },
        {
            title: "Professional",
            price: "$99",
            pricePeriod: "/month",
            buttonText: "Upgrade Now",
            userCount: "10 users",
            features: [
                "10 users",
                "Human Resource",
                "04 Locations",
                "03 Warehouse",
                "Unlimited Products",
                "Advance Point of Sales",
                "3000 Invoices / Month",
                "1500 Purchase Orders / Month",
                "3000 Transfer Orders / Month",
                "Online Store",
                "Coupons",
                "Loyality",
                "Production Orders",
                "Machines",
                "Advance Accounts & Financials"
            ],
            borderColor: "#5588DF",
            buttonColor: "#5588DF",
            priceColor: "#5588DF",
            background: "linear-gradient(0deg, rgba(85, 136, 223, 0.02) 0%, rgba(85, 136, 223, 0.02) 100%), white",
            badge: {
                text: "Most Popular",
                backgroundColor: "#5588DE"
            },
            isPopular: true,
            onButtonClick: () => console.log('Upgrade to Professional')
        },
        {
            title: "Premium",
            price: "$199",
            pricePeriod: "/month",
            buttonText: "Upgrade Now",
            userCount: "Unlimited Users",
            features: [
                "Unlimited Users",
                "Human Resource",
                "06 Locations",
                "06 Warehouse",
                "Unlimited Products",
                "Advance Point of Sales",
                "4500 Invoices / Month",
                "5500 Purchase Orders / Month",
                "2500 Transfer Orders / Month",
                "Online Store",
                "Coupons",
                "Loyalty",
                "Production Orders",
                "Machines",
                "Advance Accounts & Financials"
            ],
            borderColor: "#8B5CF6",
            buttonColor: "#8B5CF6",
            priceColor: "#8B5CF6",
            badge: {
                text: "Best Value",
                backgroundColor: "#8B5CF6"
            },
            onButtonClick: () => console.log('Upgrade to Premium')
        },
        // {
        //     title: "Enterprise",
        //     price: "$399",
        //     pricePeriod: "/month",
        //     buttonText: "Contact Sales",
        //     userCount: "Unlimited Users",
        //     features: [
        //         "Unlimited Users",
        //         "Human Resource",
        //         "10 Locations",
        //         "10 Warehouse",
        //         "Unlimited Products",
        //         "Advance Point of Sales",
        //         "10000 Invoices / Month",
        //         "10000 Purchase Orders / Month",
        //         "10000 Transfer Orders / Month",
        //         "Online Store",
        //         "Coupons",
        //         "Loyalty",
        //         "Production Orders",
        //         "Machines",
        //         "Advanced Accounts & Financials",
        //         "Priority Support",
        //         "Custom Integrations",
        //         "Dedicated Account Manager"
        //     ],
        //     borderColor: "#10B981",
        //     buttonColor: "#10B981",
        //     priceColor: "#10B981",
        //     badge: {
        //         text: "Enterprise",
        //         backgroundColor: "#10B981"
        //     },
        //     onButtonClick: () => console.log('Contact for Enterprise')
        // },
        {
            title: "Starter",
            price: "$19",
            pricePeriod: "/month",
            buttonText: "Get Started",
            userCount: "1 user",
            features: [
                "1 user",
                "Single Location",
                "Single Warehouse",
                "50 Products",
                "Basic Point of Sales",
                "50 Invoices / Month",
                "25 Purchase Orders / Month",
                "50 Transfer Orders / Month",
                "Basic Accounts"
            ],
            borderColor: "#6B7280",
            buttonColor: "#6B7280",
            priceColor: "#6B7280",
            onButtonClick: () => console.log('Get Starter Plan')
        }
    ];
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const CARD_WIDTH = 320;
    const GAP = 16;
    const TOTAL_MOVE = CARD_WIDTH + GAP;
    const VISIBLE_CARDS = 4;
    const maxOffset = -((pricingPlans.length - VISIBLE_CARDS) * TOTAL_MOVE);
    const handleNext = () => {
        if (currentIndex < pricingPlans.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <div className="text-center md:text-left">
            <h1 className="text-heading-1 font-bold mb-1 pt-8 pb-4">
                Your plan
            </h1>
            <p className="text-body-small">
                Your Organization is currently on the Basic Plan.
            </p>

            <div className="mt-9 relative group w-full grid grid-cols-1">
                <Button
                    variant='basic'
                    onClick={handlePrev}
                    // disabled={currentIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 -ml-4 cursor-pointer disabled:cursor-not-allowed bg-primary/40 rounded-full py-8 "
                > <ChevronLeft size={40} color="white" />
                </Button>

                <Button
                    variant='basic'
                    onClick={handleNext}
                    disabled={currentIndex === pricingPlans.length - 4}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 -mr-4 cursor-pointer disabled:cursor-not-allowed bg-primary/40 rounded-full py-8 "
                > <ChevronRight size={40} color="white" />
                </Button>

                <div className="overflow-hidden w-full px-1 py-4 -my-4">
                    <motion.div
                        className="flex gap-4 touch-pan-y cursor-grab active:cursor-grabbing"
                        style={{ touchAction: "pan-y", overscrollBehaviorX: "none" }}
                        animate={{ x: -currentIndex * TOTAL_MOVE }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        drag="x"
                        dragElastic={0.1}
                        dragConstraints={{ right: 0, left: maxOffset }}
                        onDragEnd={(e, { offset }) => {
                            const swipe = offset.x;

                            if (swipe < -50 && currentIndex < pricingPlans.length - VISIBLE_CARDS) {
                                setCurrentIndex(prev => prev + 1);
                            } else if (swipe > 50 && currentIndex > 0) {
                                setCurrentIndex(prev => prev - 1);
                            }
                        }}
                    >
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={index}
                                className="flex-shrink-0 w-80"
                            // animate={{
                            //     scale: index === currentIndex ? 1 : 0.95,
                            //     opacity: index === currentIndex ? 1 : 0.7
                            // }}
                            // transition={{ duration: 0.3 }}
                            >
                                <PricingCard
                                    title={plan.title}
                                    price={plan.price}
                                    pricePeriod={plan.pricePeriod}
                                    buttonText={plan.buttonText}
                                    userCount={plan.userCount}
                                    features={plan.features}
                                    borderColor={plan.borderColor}
                                    buttonColor={plan.buttonColor}
                                    priceColor={plan.priceColor}
                                    background={plan.background}
                                    badge={plan.badge}
                                    isCurrentPlan={plan.isCurrentPlan}
                                    isPopular={plan.isPopular}
                                    onButtonClick={plan.onButtonClick}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PlanSection;