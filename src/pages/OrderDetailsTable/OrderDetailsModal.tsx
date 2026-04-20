import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { OrderTimeline } from "./OrderTimeline"
import { Box, CheckCircle, Package } from "lucide-react";

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
}

export function OrderDetailsModal({ isOpen, onClose, orderId }: OrderDetailsModalProps) {
    const timelineItems = [
        {
            time: "11:20",
            date: "16",
            status: "Order Received",
            icon: <Package className="w-4 h-4" />
        },
        {
            time: "12:35",
            date: "16",
            status: "Your order is being processed in Dubai - UAE warehouse."
        },
        {
            time: "15:00",
            date: "16",
            status: "Your order is ready to be shipped from Dubai - UAE warehouse."
        },
        {
            time: "15:10",
            date: "16",
            status: "Your order is shipped",
            icon: <Box className="w-4 h-4" />
        },
        {
            time: "10:00",
            date: "18",
            status: "Your order has arrived in Riyadh - KSA warehouse."
        },
        {
            time: "10:30",
            date: "18",
            status: "Your order has been picked up by ARAMEX and on the way to Jeddah."
        },
        {
            time: "17:00",
            date: "18",
            status: "Your order has arrived in Jeddah and expected scheduled delivery is 19th November."
        },
        {
            time: "08:00",
            date: "19",
            status: "Your order is out for delivery."
        },
        {
            time: "13:00",
            date: "19",
            status: "Delivered",
            icon: <CheckCircle className="w-4 h-4" />
        }
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[400px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Order #{orderId}</DialogTitle>
                </DialogHeader>
                <OrderTimeline
                    items={timelineItems}
                    trackingNumber="7Y937849CV2"
                    courier="ARAMEX"
                    deliveryType="2-6 Days"
                />
            </DialogContent>
        </Dialog>
    )
}
