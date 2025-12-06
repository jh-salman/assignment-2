import { app } from "./app"
import { config } from "./config"

app.listen(config.port, ()=>{
    console.log("Server is listen on port "+ `${config.port}`)
})