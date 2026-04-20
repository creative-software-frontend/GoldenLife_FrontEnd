import { Box, Package, CheckCircle } from 'lucide-react'

interface TimelineItem {
    time: string;
    date: string;
    status: string;
    icon?: JSX.Element;
}

interface OrderTimeline {
    items: TimelineItem[];
    trackingNumber: string;
    courier: string;
    deliveryType: string;
}

export function OrderTimeline({ items, trackingNumber, courier, deliveryType }: OrderTimeline) {
    return (
        <div className="p-4">
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Shipment details</h3>
                <div className="flex items-center gap-8 text-sm text-muted-foreground">
                    <div>
                        <span className="block">Delivery Type: {deliveryType}</span>
                        <span className="block">Courier: {courier}</span>
                    </div>
                    <div>
                        <span className="block">Tracking Number:</span>
                        <span className="block">{trackingNumber}</span>
                    </div>
                </div>
            </div>
            <div className="relative">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-3 mb-8 relative">
                        <div className="relative">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.icon ? 'bg-primary/10 text-primary' : 'bg-muted'
                                }`}>
                                {item.icon || <div className="w-3 h-3 rounded-full bg-muted-foreground" />}
                            </div>
                            {index !== items.length - 1 && (
                                <div className="absolute top-8 left-1/2 bottom-0 w-0.5 -ml-[1px] bg-muted" />
                            )}
                        </div>
                        <div>
                            <div className="text-sm font-medium">
                                {item.time}
                                <span className="text-muted-foreground ml-2 font-normal">
                                    Nov {item.date}
                                </span>
                            </div>
                            <p className="text-muted-foreground text-sm">{item.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

