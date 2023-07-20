import { afterAll, beforeAll, expect, it, describe, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { execSync } from 'node:child_process';

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

describe('User Routes', () => {

    it('Should be able to create a new user', async () => {
        const userToCreate = {
            name: 'User',
            email: 'user@mail.com',
            login: 'user.login',
            password: 'user123',
        };
        await request(app.server)
            .post('/user/signup')
            .send(userToCreate)
            .expect(201);
    });

    it('Should be able to sign in with created user', async () => {
        const userToCreate = {
            name: 'User',
            email: 'user@email.com',
            login: 'login.user',
            password: 'randomuser'
        };
        await request(app.server)
            .post('/user/signup')
            .send(userToCreate);
        const { login, password } = userToCreate;
        await request(app.server)
            .post('/user/signin')
            .send({
                login,
                password
            })
            .expect(200);
    });

    it('Should not be able to sign in with user not created', async () => {
        const userToCreate = {
            name: 'User',
            email: 'user@email.com',
            login: 'login.user',
            password: 'randomuser',
        };
        const { login, password } = userToCreate;
        await request(app.server)
            .post('/user/signin')
            .send({
                login,
                password
            })
            .expect(404);
    });

    it('Should be able to sign out with created user', async () => {
        const userToCreate = {
            name: 'User',
            email: 'user@email.com',
            login: 'login.user',
            password: 'randomuser',
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
            .delete('/user/signout')
            .set('Cookie', cookies)
            .send()
            .expect(200);
    });

    it('Should not be able to sign out without signing in first', async () => {
        await request(app.server)
            .delete('/user/signout')
            .send()
            .expect(401);
    });

    it('Should be able to edit a created user', async () => {
        const userToCreate = {
            name: 'User',
            email: 'user@email.com',
            login: 'login.user',
            password: 'randomuser',
        };
        const createdUserNewData = {
            name: 'New User',
            email: 'newuser@mail.com',
            password: 'newnonrandomuser',
            login: userToCreate.login
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
        const updateUserResponse = await request(app.server)
            .put(`/user/update/${userToCreate.login}`)
            .set('Cookie', cookies)
            .send(createdUserNewData);
        expect(updateUserResponse.statusCode).toEqual(200);
        expect(updateUserResponse.body.user).toEqual({
            name: createdUserNewData.name,
            email: createdUserNewData.email,
            login: createdUserNewData.login
        });
    });

    it('Should not be able to edit an user different from the signed in user', async () => {
        const userToCreate = {
            name: 'User',
            email: 'user@email.com',
            login: 'login.user',
            password: 'randomuser',
        };
        const createdUserNewData = {
            name: 'New User',
            email: 'newuser@mail.com',
            password: 'newnonrandomuser',
            login: 'user.login'
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
        const updateUserResponse = await request(app.server)
            .put(`/user/update/${userToCreate.login}`)
            .set('Cookie', cookies)
            .send(createdUserNewData);
        expect(updateUserResponse.statusCode).toEqual(403);
    });

});