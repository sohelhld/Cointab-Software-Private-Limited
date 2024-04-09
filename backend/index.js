const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const { connected } = require("./db");
const userRouter = require("./routes/route");

app.use(express.json());
app.use("/users", userRouter);
// app.use("/posts", route);

app.listen(PORT, async () => {
    try {
        await connected;
        console.log("db is connected");
    } catch (error) {
        console.log(error);
    }

    console.log(`Server is running on port ${PORT}`);
});
