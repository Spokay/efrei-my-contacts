import YAML from 'yamljs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/openapi.yaml'));

const swaggerOptions = {
    explorer: true,
    customSiteTitle: 'EFREI My Contacts API Documentation'
};

export {
    swaggerUi,
    swaggerDocument,
    swaggerOptions
};
