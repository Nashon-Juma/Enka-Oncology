export declare const uploadToS3: (fileBuffer: Buffer, originalName: string, mimeType: string) => Promise<string>;
export declare const deleteFromS3: (key: string) => Promise<void>;
export declare const generatePresignedUrl: (key: string, filename: string) => Promise<string>;
//# sourceMappingURL=s3Service.d.ts.map