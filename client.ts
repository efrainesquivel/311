import Nullstack from 'nullstack';
import Application from './src/Application';
import type { ApplicationClientContext } from './src/types/ApplicationClientContext';

const context = Nullstack.start(Application) as ApplicationClientContext;

context.start = async function start() {};

export default context;
