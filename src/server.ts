import app from './app'
import { env } from './env';

app.get('/meal', async () => {
    return 'Meal informed!'
})
app.listen({
    port: env.PORT
}).then(() => {
    console.log('Server running!')
}, (err) => {
    console.log(err)
})
.catch((err) => {
    console.log(err)
});