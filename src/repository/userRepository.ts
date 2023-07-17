import { randomUUID } from "crypto";
import { knex } from "../database"
import { User } from "../models/user";

export const userRepository = {

    async createUser(user: User): Promise<void>{
        return await knex('user')
            .insert({
                ...user,
                userId: randomUUID()
            });
    },

    async getUserByLogin(login: string): Promise<User | undefined>{
        return await knex('user')
            .where({login})
            .first();
    },

    async getSimpleUserDataByLogin(userLogin: string): Promise<User | undefined>{
        const { name, login, email } = (await this.getUserByLogin(userLogin))!;
        return {
            login,
            name,
            email
        };
    },

    async updateUserByLogin(user: User): Promise<User | undefined>{
        await knex('user')
            .where(
                {login: user.login}
            )
            .update({
                name: user.name,
                email: user.email,
                password: user.password
            });
        return this.getSimpleUserDataByLogin(user.login);
    }

}