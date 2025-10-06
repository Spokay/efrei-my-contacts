import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const swaggerDocument = YAML.load(path.join(dirname, '../docs/openapi.yaml'));

const swaggerOptions = {
    explorer: true,
    customSiteTitle: 'EFREI My Contacts API Documentation'
};

export {
    swaggerUi,
    swaggerDocument,
    swaggerOptions
};
