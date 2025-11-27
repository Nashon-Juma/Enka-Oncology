export declare const config: {
    mongodb: {
        uri: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    encryption: {
        key: string;
    };
    aws: {
        accessKeyId: string | undefined;
        secretAccessKey: string | undefined;
        region: string;
        s3Bucket: string;
    };
    email: {
        sendgridApiKey: string | undefined;
        fromEmail: string;
    };
    sms: {
        twilioAccountSid: string | undefined;
        twilioAuthToken: string | undefined;
        twilioPhoneNumber: string | undefined;
    };
    cors: {
        origin: string;
    };
    rateLimit: {
        windowMs: string;
        maxRequests: string;
    };
};
//# sourceMappingURL=config.d.ts.map