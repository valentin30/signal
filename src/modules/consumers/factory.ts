import { Consumer } from '@valentin30/signal/core/contracts/consumer'
import { Consumers } from '@valentin30/signal/core/interfaces/consumers'

export function ConsumersFactory() {
    class C extends Set<Consumer> implements Consumers {
        public active(): boolean {
            return this.size > 0
        }

        public invalidate(): void {
            for (const consumer of this.values()) consumer.invalidate()
        }

        public link(consumer: Consumer): void {
            this.add(consumer)
        }

        public unlink(consumer: Consumer): void {
            this.delete(consumer)
        }
    }

    return function c(): Consumers {
        return new C()
    }
}
