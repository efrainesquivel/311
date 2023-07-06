import Nullstack from 'nullstack';
import Application from './src/Application';
import { bingMaps } from './src/services/bingMaps';
import type { ApplicationServerContext } from './src/types/ApplicationServerContext';

const context = Nullstack.start(Application) as ApplicationServerContext<{ bingMaps: typeof bingMaps }>;

context.start = async function start() {
    context.bingMaps = bingMaps;
};

export default context;
