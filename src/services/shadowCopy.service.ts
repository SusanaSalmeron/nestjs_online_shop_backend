import { Injectable, Logger } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class ShadowCopyService {
    private readonly logger = new Logger(ShadowCopyService.name)

    async getShadowCopy() {
        const content = fs.readFileSync(path.resolve(__dirname, "..", 'database', 'data', 'shadow_copy.json'));
        return JSON.parse(content.toString())
    }
}