import * as bcrypt from 'bcrypt'

export async function encrypt(elementToBeEncrypted: string) {
    const saltRounds = 10
    return await bcrypt.hash(elementToBeEncrypted, saltRounds)
}

