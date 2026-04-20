'use client';

import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import Image from 'next/image';
import { Button } from '@/components/ui/button';
import useModalStore from '@/store/modalStore';
import { useTranslation } from 'react-i18next';

export default function TrendingCategory() {
    const sliderRef = useRef<Slider>(null);
    const [cart, setCart] = useState<any[]>([]);
    const { toggleClicked } = useModalStore();
    const { t } = useTranslation("global");

    const products = [
        {
            id: 1,
            name: t('products.product1'), // Translate the product name
            price: '£60.00',
            discount: '-10%',
            oldPrice: '£86.00',
            image: '/image/products/airpods.jpg',
        },
        {
            id: 2,
            name: t('products.product2'),
            price: '£60.00',
            image: '/image/products/beats.jpg',
        },
        {
            id: 3,
            name: t('products.product3'),
            price: '£60.00',
            oldPrice: '£86.00',
            discount: '-7%',
            image: '/image/products/headphone.jpg',
        },
        {
            id: 4,
            name: t('products.product4'),
            price: '£60.00',
            image: '/image/products/sony.jpg',
        },
        {
            id: 5,
            name: t('products.product5'),
            price: '£299.00',
            image: '/image/products/watch.jpg',
        },
        {
            id: 6,
            name: t('products.product6'),
            price: '£249.00',
            discount: t('sections.discount'),
            oldPrice: '£262.00',
            image: '/image/products/pulseoximeter.jpg',
        },
    ];

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(storedCart);
    }, []);

    const parsePrice = (price: string): number => {
        return Number(price.replace(/[^\d.]/g, ''));
    };

    const addToCart = (product: any) => {
        const sanitizedProduct = {
            ...product,
            price: parsePrice(product.price),
            oldPrice: product.oldPrice ? parsePrice(product.oldPrice) : undefined,
            quantity: 1,
        };

        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingProductIndex = storedCart.findIndex((item: any) => item.id === product.id);

        if (existingProductIndex > -1) {
            storedCart[existingProductIndex].quantity += 1;
        } else {
            storedCart.push(sanitizedProduct);
        }

        setCart(storedCart);
        localStorage.setItem('cart', JSON.stringify(storedCart));
        toggleClicked();
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <section className="py-4 px-4 overflow-hidden md:max-w-[1040px] w-full">
            <div className="container mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-4">{t("sections.trendingProductsTitle")}</h2>
                    <p className="text-muted-foreground">
                        {t("sections.trendingProductsDescription")}
                    </p>
                </div>

                <div className="relative">
                    <Slider ref={sliderRef} {...settings}>
                        {products.map((product) => (
                            <div key={product.id} className="px-3">
                                <div className="bg-background rounded-lg shadow-md overflow-hidden">
                                    <div className="p-4">
                                        <div className="relative aspect-square mb-4">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                width={200}
                                                height={200}
                                                className="rounded-md object-cover w-full h-full"
                                            />
                                            {product.discount && (
                                                <span className="absolute top-2 right-2 bg-orange-500 text-white text-sm px-2 py-1 rounded">
                                                    {product.discount}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-medium mb-2 text-start">{product.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold">{product.price}</p>
                                                {product.oldPrice && (
                                                    <p className="text-sm text-muted-foreground line-through">
                                                        {product.oldPrice}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => addToCart(product)}
                                                className='  w-24 -mr-2 '
                                            >
                                                <ShoppingCart className="h-4 w-4 " />
                                                {t("buttons.addToCart")}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>

                    <button
                        className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background shadow-md flex items-center justify-center z-10"
                        onClick={() => sliderRef.current?.slickPrev()}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background shadow-md flex items-center justify-center z-10"
                        onClick={() => sliderRef.current?.slickNext()}
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}
