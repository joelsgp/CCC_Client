/**
 * A EventHandler helps to handle events
 */
export abstract class EventHandler {
    private listeners: Map<string, Set<Function>>;

    constructor() {
        this.listeners = new Map();
    }

    /**
     * Adds a listener to an event
     * @param event name of the event. See at class description
     * @param listener the listener function. See at class description for parameters
     */
    on(event: string, listener: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        this.listeners.get(event).add(listener);
    }

    /**
     * Removes a listener from an event
     * @param event name of the event.
     * @param listener listener function
     */
    off(event: string, listener: Function) {
        this.listeners.get(event).delete(listener);
    }

    /**
     * Fires an event.
     * @param event name of the event
     * @param args arguments which will transfered to the listeners
     */
    protected notify(event: string, ...args: any[]) : void {
        console.log(`${event} triggerd`);

        if (!this.listeners.has(event)) return;

        this.listeners.get(event).forEach(element => {
            element.apply(element, args);
        });
    }
}