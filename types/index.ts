import {Prisma, Role} from "@/app/generated/prisma";
import {ReactNode} from "react";

export type UserType = {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: Role | null;
};
export type OrderDetails = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    note?: string;
};
export const orderInclude = {
    user: {
        select: {
            id: true,
            name: true,
        },
    },

    items: {
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                },
            },

            variant: {
                include: {
                    images: {
                        orderBy: {
                            order: "asc",
                        },
                        take: 1,
                    },
                },
            },
        },
    },
} satisfies Prisma.OrderInclude;

export type RawOrderWithDetails = Prisma.OrderGetPayload<{
    include: typeof orderInclude;
}>;


export type RawCartWithItems = Prisma.CartGetPayload<{
    include: {
        items: {
            include: {
                product: true;
                variant: { include: { images: true } };
            };
        };
    };
}>;

export type CartWithItems = Omit<RawCartWithItems, "items"> & {
    items: Array<
        Omit<RawCartWithItems["items"][number], "product"> & {
        product: Omit<RawCartWithItems["items"][number]["product"], "price" | "salePrice"> & {
            price: number;
            salePrice: number | null;
        };
    }
    >;
};

export type OrderWithDetails = Omit<RawOrderWithDetails, "total" | "items"> & {
    total: number;
    createdAtFormatted: string;
    items: Array<
        Omit<RawOrderWithDetails["items"][number], "price" | "product"> & {
        price: number;

        product: Omit<
            RawOrderWithDetails["items"][number]["product"],
            "price"
        > & {
            price: number;
        };
    }
    >;
};


export type ContactMessage = Prisma.MessageGetPayload<{
    select: {
        id: true;
        userId: true;
        sender: true;
        subject: true;
        email: true;
        message: true;
        status: true;
        updatedAt: true;
        createdAt: true;
    }
}>;

export type ContactMessageSerialized = Omit<ContactMessage, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
};

export const productWithVariants =
    Prisma.validator<Prisma.ProductDefaultArgs>()({
        include: {
            variants: {
                include: {
                    images: true,
                },
            },
            category: true,
        },
    });

export const variantWithImages = Prisma.validator<Prisma.VariantDefaultArgs>()({
    include: {
        images: true,
    },
});

export type ProductWithVariantsSerialized = Omit<
    ProductWithVariants,
    "price" | "salePrice"
> & {
    price: string;
    salePrice: string | null;
};

export const cartItemFull = Prisma.validator<Prisma.CartItemDefaultArgs>()({
    include: {
        product: {include: {category: true}},
        variant: {include: {images: {take: 1}}},
    },
});

export const orderFull = Prisma.validator<Prisma.OrderDefaultArgs>()({
    include: {
        items: {
            include: {
                product: true,
                variant: {include: {images: {take: 1}}},
            },
        },
    },
});

export type ProductWithVariants = Prisma.ProductGetPayload<
    typeof productWithVariants
>;
export type VariantWithImages = Prisma.VariantGetPayload<
    typeof variantWithImages
>;
export type CartItemFull = Prisma.CartItemGetPayload<typeof cartItemFull>;
export type OrderFull = Prisma.OrderGetPayload<typeof orderFull>;

export type ImageItem =
    ProductWithVariants["variants"][number]["images"][number];
export type CategoryBasic = ProductWithVariants["category"];

export interface ShopSearchParams {
    category?: string;
    min?: string;
    onSale?: string;
    room?: string | string[];
    max?: string;
    sort?: "price-asc" | "price-desc" | "newest";
    material?: string | string[];
    color?: string | string[];
}

export type SortOption = NonNullable<ShopSearchParams["sort"]>;

export interface ProductFormData {
    name: string;
    description: string;
    dimensions: string;
    price: string;
    category: string;
    materials: string[];
}

export interface VariantFormItem {
    color: string;
    images: UploadImageItem[];
}

export interface UploadImageItem {
    file: File;
    preview: string;
}

export type ActionResult<T = void> =
    | { success: true; data: T }
    | { success: false; error: string };

export type AddProductResult = ActionResult<{ productId: number }>;
export type UpdateProductResult = ActionResult<{ productId: number }>;
export type DeleteResult = ActionResult;

export interface CartSummary {
    items: CartItemFull[];
    total: number;
    count: number;
}

export interface FilterState {
    category?: string;
    colors: string[];
    materials: string[];
    price: [number, number];
    sort: SortOption;
    onSale: boolean;
}

export interface PaginationState {
    page: number;
    perPage: number;
    total: number;
}

export type SerializedImage = {
    id: number;
    url: string;
    order: number;
    variantId: number;
};

export type SerializedVariant = {
    id: number;
    color: string;
    productId: number;
    images: SerializedImage[];
};

export type SerializedProduct = {
    id: number;
    name: string;
    price: number;
    salePrice: number | null;
    categoryId: number;
    description?: string | null;
    dimensions?: string | null;
    materials?: string[];
    createdAt?: string;
    variants: {
        id: number;
        color: string;
        images: { url: string }[];
    }[];
};

export type SerializedSimilar = {
    id: number;
    name: string;
    price: string;
    category: string;
    variants: { images: SerializedImage[] }[];
};
export type ProductWithRelations = Omit<
    Prisma.ProductGetPayload<{
        include: {
            category: true;
            variants: { include: { images: true } };
        };
    }>,
    "price"
> & { price: string };

export type ColumnDef<T> = {
    key: string;
    header: string;
    cell: (row: T) => ReactNode;
    className?: string;
};

export type DataTableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];
    keyExtractor: (row: T) => string | number;
    emptyMessage?: string;
    isLoading?: boolean;
};

interface ProductIntf {
    id: number;
    title: string;
    originalPrice: string;
    salePrice: string;
    discount: string;
    image: string;
    href: string;
}

export interface SaleGridProps {
    products: SerializedProduct[];
    product?: SerializedProduct;
    header?: string;
    paragraf?: string;
}