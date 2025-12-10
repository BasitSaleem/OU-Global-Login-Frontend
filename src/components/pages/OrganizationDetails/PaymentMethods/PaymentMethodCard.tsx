import React from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Button } from '@/components/ui';

interface PaymentMethodCardProps {
    variant: 'display' | 'add';
    cardType?: 'visa' | 'mastercard';
    last4?: string;
    expiry?: string;
    isPrimary?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onMakePrimary?: () => void;
    onAdd?: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
    variant,
    cardType,
    last4,
    expiry,
    isPrimary,
    onEdit,
    onDelete,
    onMakePrimary,
    onAdd
}) => {
    if (variant === 'add') {
        return (
            <div
                onClick={onAdd}
                className="flex flex-col items-center justify-center w-full h-[180px] bg-bg-secondary border border-dashed border-primary rounded-xl cursor-pointer hover:bg-primary/10 transition-colors"
            >
                <Plus strokeWidth={1.5} className="w-30 h-30 text-primary mb-2" />
                <span className="text-primary font-medium">Add New</span>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[180px] bg-bg-secondary rounded-xl p-6 border flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    {cardType && <SvgIcon name={cardType} width={48} height={48} />}
                    <div>
                        <p className="font-semibold">....{last4}</p>
                        <p className="text-sm">Expires {expiry}</p>
                    </div>
                </div>
                {isPrimary && (
                    <span className="text-primary text-xs px-3 py-1 rounded-full font-medium">
                        Primary
                    </span>
                )}
            </div>

            <div className="flex justify-between items-end">
                {!isPrimary ? (
                    <Button
                        onClick={onMakePrimary}
                        variant='basic'
                        className='text-primary'
                    >
                        Make Primary
                    </Button>
                ) : (
                    <div></div>
                )}

                <div className="flex items-center gap-3">
                    <Button
                        onClick={onEdit}
                        variant='basic'
                        className='hover:scale-110 transition-all duration-300'
                    >
                        <Edit2 size={18} />
                    </Button>
                    <Button
                        variant='basic'
                        className='hover:scale-110 transition-all duration-300'
                        onClick={onDelete}                    >
                        <Trash2 size={18} color='red' />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodCard;
