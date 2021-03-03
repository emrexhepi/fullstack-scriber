import { Client } from '@elastic/elasticsearch';

let elasticClient:Client;

export const getClient = ():Client => {
    if(!elasticClient) elasticClient = new Client({ node: 'http://localhost:9200' });
    return elasticClient;
}