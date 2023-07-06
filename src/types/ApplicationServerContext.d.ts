import type { NullstackServerContext } from 'nullstack';
import type { bingMaps } from '../services/bingMaps';

export type ApplicationServerContext<T = Record<string, never>> = NullstackServerContext<T & { bingMaps: typeof bingMaps }>
