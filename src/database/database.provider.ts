/* import { Logger } from '@nestjs/common';
 */import * as loki from 'lokijs';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';


async function passwordEncrypt(data) {
    const allPromises = data.map(async d => {
        const saltRounds = 10
        const hash = await bcrypt.hash(d.password, saltRounds)
        return {
            id: d.id,
            user_name: d.user_name,
            surname: d.surname,
            address: d.address,
            postalZip: d.postalZip,
            city: d.city,
            country: d.country,
            phone: d.phone,
            email: d.email,
            date_of_birth: d.date_of_birth,
            identification: d.identification,
            password: hash
        }
    })
    return await Promise.all(allPromises)
}

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async (): Promise<loki.Db> => {
            try {
                const client = await new loki('beautyshop.db')
                const tables = ['users', 'newProducts']
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