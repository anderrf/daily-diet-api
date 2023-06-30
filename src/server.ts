import app from './app'

app.get('/meal', async () => {
    return 'Meal informed!'
})
app.listen({
    port: 3333
}).then(() => {
    console.log('Server running!')
}, (err) => {
    console.log(err)
})
.catch((err) => {
    console.log(err)
});