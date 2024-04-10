const express = require("express");
const userRouter = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const { postModel } = require("../modules/post.model");
const User = require("../modules/user.model");

userRouter.get("/all", async (req, res) => {
    try {
        const response = await axios.get(
            "https://jsonplaceholder.typicode.com/users"
        );
        const users = response.data;
        const newUsers = await Promise.all(
            users.map(async (user) => {
                const isUserPresent = await User.findOne({ id: user.id });
                user.added = !!isUserPresent;
                return user;
            })
        );

        res.send(newUsers);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

userRouter.post("/add", async (req, res) => {
    try {
        const user = req.body;
        const isUserPresent = await User.findOne({ id: user.id });
        if (isUserPresent) {
            return res.status(200).send({ message: "user is already present" });
        }
        let data = new User(user);
        await data.save();
        res.status(201).send({ message: "User added successfully", data });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

userRouter.get("/:id", async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) {
            return res.status(401).send({ message: "user not present" });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

userRouter.get("/posts/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await axios.get(
            `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );
        const posts = response.data;
        res.send(posts);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

userRouter.post("/bulk-add/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await axios.get(
            `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );
        const posts = response.data;

        posts?.map((post) => {
            return createPost(post);
        });

        const user = await User.findOne({ id: userId });

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                uploaded: true,
            },
            { new: true }
        );

        res.status(200).send({ message: "Successfully ", user: updatedUser });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

async function createPost(post) {
    try {
        const data = new postModel(post);
        await data.save();
    } catch (error) {
        return;
    }
}

userRouter.get("/download/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await postModel.find(
            { userId: userId },
            { _id: 0, id: 1, userId: 1, title: 1, body: 1 }
        );

        const data = posts.map((post) => {
            return {
                id: post.id,
                userId: post.userId,
                title: post.title,
                body: post.body,
            };
        });

        const worksheet = xlsx.utils.json_to_sheet(data);

        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Posts");

        const directoryPath = path.join(__dirname, "downloads");
        const filePath = path.join(directoryPath, `user_${userId}_posts.xlsx`);

        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
        }

        xlsx.writeFile(workbook, filePath);

        // Set the response headers to indicate a file download
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=user_${userId}_posts.xlsx`
        );

        // Send the file as a response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Delete the file after sending
        fileStream.on("end", () => {
            fs.unlinkSync(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error(unlinkErr);
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = userRouter;
