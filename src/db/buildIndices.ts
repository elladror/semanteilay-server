import 'dotenv/config';
import { initialize } from '../repositories/roomRepository';

async function build() {
    await initialize();
    console.log("room index built");
}

build();