import { ConfigService } from '@nestjs/config';
export declare class S3Service {
    private configService;
    private readonly client;
    private readonly bucket;
    private readonly logger;
    constructor(configService: ConfigService);
    upload(file: Express.Multer.File, folder?: string): Promise<{
        url: string;
        key: string;
    }>;
    delete(key: string): Promise<void>;
    getSignedUrl(key: string, expiresIn?: number): Promise<string>;
}
