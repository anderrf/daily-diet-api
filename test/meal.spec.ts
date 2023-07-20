import { afterAll, beforeAll, expect, it, describe, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { execSync } from 'node:child_process';
import { Meal } from '../src/models/meal';
import { MealsSummary } from '../src/models/meals-summary';

beforeAll(async () => {
  await app.ready();
});

beforeEach(() => {
  execSync('npm run knex migrate:rollback --all');
  execSync('npm run knex migrate:latest');
});

afterAll(async () => {
  await app.close();
});

describe('Meal Routes', () => {

    it('Should be able to create a new meal', async () => {
        const userToCreate = {
            name: 'User',
            email: 'user@mail.com',
            login: 'user.login',
            password: 'user123',
        };
        const mealToCreate = {
            name: 'Hambúrguer',
            description: 'Lanche gorduroso',
            isDiet: false,
            dateTime: new Date()
        };
        await request(app.server)
            .post('/user/signup')
            .send(userToCreate);
        const { login, password } = userToCreate;
        const signinResponse = await request(app.server)
            .post('/user/signin')
            .send({
                login,
                password
            });
        const cookies = signinResponse.get('Set-Cookie');
        await request(app.server)
            .post(`/meal/${login}/create`)
            .set('Cookie', cookies)
            .send(mealToCreate)
            .expect(201);
    });

    it('Should be able to get an user\'s list of meals', async () => {
        const userToCreate = {
            name: 'User',
            email: 'user@mail.com',
            login: 'user.login',
            password: 'user123',
        };
        const currentDate = new Date();
        const unhealthyMealToCreate = {
            name: 'Hambúrguer',
            description: 'Lanche gorduroso',
            isDiet: false,
            dateTime: new Date(currentDate.getDate() - 2)
        };
        const healthyMealToCreate = {
            name: 'Salada',
            description: 'Verduras e legumes',
            isDiet: true,
            dateTime: new Date(currentDate.getDate() - 1)
        };
        await request(app.server)
            .post('/user/signup')
            .send(userToCreate);
        const { login, password } = userToCreate;
        const signinResponse = await request(app.server)
            .post('/user/signin')
            .send({
                login,
                password
            });
        const cookies = signinResponse.get('Set-Cookie');
        await request(app.server)
            .post(`/meal/${login}/create`)
            .set('Cookie', cookies)
            .send(unhealthyMealToCreate);
        await request(app.server)
            .post(`/meal/${login}/create`)
            .set('Cookie', cookies)
            .send(healthyMealToCreate);
        const allMealsResponse = await request(app.server)
            .get(`/meal/${login}`)
            .set('Cookie', cookies)
            .send(healthyMealToCreate);
        expect(allMealsResponse.statusCode).toBe(200);
        expect.objectContaining([
            expect.objectContaining({
                name: 'Hambúrguer',
                description: 'Lanche gorduroso',
                isDiet: false,
            }),
            expect.objectContaining({
                name: 'Salada',
                description: 'Verduras e legumes',
                isDiet: true,
            })
        ]);
    });

    it('Should be able to get an user\'s single meal', async () => {
        const userToCreate = {
            name: 'User',
            email: 'user@mail.com',
            login: 'user.login',
            password: 'user123',
        };
        const currentDate = new Date();
        const unhealthyMealToCreate = {
            name: 'Hambúrguer',
            description: 'Lanche gorduroso',
            isDiet: false,
            dateTime: new Date(currentDate.getDate() - 2)
        };
        const healthyMealToCreate = {
            name: 'Salada',
            description: 'Verduras e legumes',
            isDiet: true,
            dateTime: new Date(currentDate.getDate() - 1)
        };
        await request(app.server)
            .post('/user/signup')
            .send(userToCreate);
        const { login, password } = userToCreate;
        const signinResponse = await request(app.server)
            .post('/user/signin')
            .send({
                login,
                password
            });
        const cookies = signinResponse.get('Set-Cookie');
        await request(app.server)
            .post(`/meal/${login}/create`)
            .set('Cookie', cookies)
            .send(unhealthyMealToCreate);
        await request(app.server)
            .post(`/meal/${login}/create`)
            .set('Cookie', cookies)
            .send(healthyMealToCreate);
        const allMealsResponse = await request(app.server)
            .get(`/meal/${login}`)
            .set('Cookie', cookies)
            .send();
        const createdMeals: Meal[] = allMealsResponse.body.meals;
        await request(app.server)
            .get(`/meal/${login}/${createdMeals[0].mealId}`)
            .set('Cookie', cookies)
            .send()
            .expect(200);
        expect.objectContaining({
            name: 'Hambúrguer',
            description: 'Lanche gorduroso',
            isDiet: false,
        });
    });

    it('Should not be able to get an user\'s single meal by another user login', async () => {
        const userToCreate = {
            name: 'User',
            email: 'user@mail.com',
            login: 'user.login',
            password: 'user123',
        };
        const otherUserToCreate = {
            name: 'Other',
            email: 'other@mail.com',
            login: 'other.login',
            password: 'other098',
        };
        const currentDate = new Date();
        const unhealthyMealToCreate = {
            name: 'Hambúrguer',
            description: 'Lanche gorduroso',
            isDiet: false,
            dateTime: new Date(currentDate.getDate() - 2)
        };
        const healthyMealToCreate = {
            name: 'Salada',
            description: 'Verduras e legumes',
            isDiet: true,
            dateTime: new Date(currentDate.getDate() - 1)
        };
        await request(app.server)
            .post('/user/signup')
            .send(userToCreate);
        const { login, password } = userToCreate;
        const signinResponse = await request(app.server)
            .post('/user/signin')
            .send({
                login,
                password
            });
        const cookies = signinResponse.get('Set-Cookie');
        await request(app.server)
            .post(`/meal/${login}/create`)
            .set('Cookie', cookies)
            .send(unhealthyMealToCreate);
        await request(app.server)
            .post(`/meal/${login}/create`)
            .set('Cookie', cookies)
            .send(healthyMealToCreate);
        const allMealsResponse = await request(app.server)
            .get(`/meal/${login}`)
            .set('Cookie', cookies)
            .send();
        const createdMeals: Meal[] = allMealsResponse.body.meals;
        await request(app.server)
            .post('/user/signup')
            .send(otherUserToCreate);
        const signinOtherResponse = await request(app.server)
            .post('/user/signin')
            .send({
                login: otherUserToCreate.login,
                password: otherUserToCreate.password
            });
        const otherCookies = signinOtherResponse.get('Set-Cookie');
        await request(app.server)
            .get(`/meal/${otherUserToCreate.login}/${createdMeals[0].mealId}`)
            .set('Cookie', otherCookies)
            .send()
            .expect(401);
    });

    it('Should be able to get an user\'s summary', async () => {
        const userToCreate = {
            name: 'User',
            email: 'user@mail.com',
            login: 'user.login',
            password: 'user123',
        };
        const currentDate = new Date();
        const mealsToCreate: Meal[] = [
            {
                name: 'Fora da dieta 1',
                description: '',
                isDiet: false,
                dateTime: new Date(currentDate.getDate() - 7)
            },
            {
                name: 'Dentro da dieta 1',
                description: '',
                isDiet: true,
                dateTime: new Date(currentDate.getDate() - 6)
            },
            {
                name: 'Dentro da dieta 2',
                description: '',
                isDiet: true,
                dateTime: new Date(currentDate.getDate() - 5)
            },
            {
                name: 'Dentro da dieta 3',
                description: '',
                isDiet: true,
                dateTime: new Date(currentDate.getDate() - 4)
            },
            {
                name: 'Fora da dieta 2',
                description: '',
                isDiet: false,
                dateTime: new Date(currentDate.getDate() - 3)
            },
            {
                name: 'Dentro da dieta 4',
                description: '',
                isDiet: true,
                dateTime: new Date(currentDate.getDate() - 2)
            },
            {
                name: 'Dentro da dieta 5',
                description: '',
                isDiet: true,
                dateTime: new Date(currentDate.getDate() - 1)
            }
        ];
        await request(app.server)
            .post('/user/signup')
            .send(userToCreate);
        const { login, password } = userToCreate;
        const signinResponse = await request(app.server)
            .post('/user/signin')
            .send({
                login,
                password
            });
        const cookies = signinResponse.get('Set-Cookie');
        for(let meal of mealsToCreate){
            await request(app.server)
                .post(`/meal/${login}/create`)
                .set('Cookie', cookies)
                .send(meal);
        }
        const summaryResponse = await request(app.server)
            .get(`/meal/${login}/summary`)
            .set('Cookie', cookies)
            .send();
        const summary: MealsSummary = summaryResponse.body.summary;
        expect(summaryResponse.statusCode).toBe(200);
        expect.objectContaining({
            totalMeals: 7,
            totalDietMeals: 5,
            totalNonDietMeals: 2,
            bestSequenceOfDietMeals: 3
        });
    });

});
