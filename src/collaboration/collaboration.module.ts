import { CANNONICAL_NAME } from "../constants";
import { CollaborativeStore } from "./collaborative-store";

export let collaborativeStore: CollaborativeStore;

export default {
    hooks: {
        init() {
            if (!collaborativeStore) {
                collaborativeStore = new CollaborativeStore();
            }
        },
        socketlib() {
            const socket = socketlib.registerModule(CANNONICAL_NAME);
            if (!collaborativeStore) {
                collaborativeStore = new CollaborativeStore();
            }
            collaborativeStore.activateSocketListeners(socket);
        }
    }
};
