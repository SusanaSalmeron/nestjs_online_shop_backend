/* import { Logger } from '@nestjs/common';
 */import * as loki from 'lokijs';
import * as fs from 'fs';
import * as path from 'path';
import { AccountUserData } from '../classes/accountUserData';
import { encrypt } from '../services/security.service'



async function passwordEncrypt(data) {
    const allPromises = data.map(async d => {
        return new AccountUserData(
            d.id,
            d.user_name,
            d.surname,
            d.address,
            d.postalZip,
            d.city,
            d.country,
            d.phone,
            d.email,
            d.date_of_birth,
            d.identification,
            await encrypt(d.password)
        )
    })
    return await Promise.all(allPromises)
}

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async (): Promise<loki.Db> => {
            try {
                const client = await new loki('beautyshop.db')
                const tables = ['addresses', 'newProducts', 'orderPosition', 'orders', 'users', 'wishlist']
                for (let i = 0; i < tables.length; i++) {
                    const rawdata = fs.readFileSync(path.resolve(__dirname, 'data', `${tables[i]}.json`));
                    let data = JSON.parse(rawdata.toString());
                    if (tables[i] === 'users') {
                        data = await passwordEncrypt(data)
                    }
                    const table = client.addCollection(tables[i]);
                    table.insert(data)
                }
                /* const pt = client.getCollection('users')
                console.log(pt)
                Logger.log(JSON.stringify(pt.find(true))) */
                return client;
            } catch (error) {
                throw error;
            }
        }
    }
]