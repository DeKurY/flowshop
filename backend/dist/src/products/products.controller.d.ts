import { ProductsService } from './products.service';
import { QueryProductsDto } from './dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: QueryProductsDto): Promise<{
        items: {
            id: any;
            name: any;
            slug: any;
            status: any;
            flowerType: any;
            deliveryAvailable: any;
            featured: any;
            category: any;
            thumbnail: any;
            price: any;
            compareAtPrice: any;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: any;
        name: any;
        slug: any;
        description: any;
        status: any;
        flowerType: any;
        occasion: any;
        deliveryAvailable: any;
        featured: any;
        category: any;
        images: any;
        variants: any;
        createdAt: any;
    }>;
}
