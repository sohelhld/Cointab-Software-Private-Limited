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

// userRouter.get("/download/:userId", async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const posts = await postModel.find({ userId });

//         // Convert posts data to worksheet
//         const worksheet = xlsx.utils.json_to_sheet(posts);

//         // Create a new workbook and add the worksheet
//         const workbook = xlsx.utils.book_new();
//         xlsx.utils.book_append_sheet(workbook, worksheet, "Posts");

//         // Define the directory path and file path
//         const directoryPath = path.join(__dirname, "downloads");
//         const filePath = path.join(directoryPath, `user_${userId}_posts.xlsx`);

//         // Check if the directory exists, if not create it
//         if (!fs.existsSync(directoryPath)) {
//             fs.mkdirSync(directoryPath);
//         }

//         // Save the workbook to the file path
//         xlsx.writeFile(workbook, filePath);

//         // Send the file as a response
//         res.download(filePath, (err) => {
//             if (err) {
//                 throw err;
//             }

//             // Delete the file after sending
//             fs.unlinkSync(filePath, (unlinkErr) => {
//                 if (unlinkErr) {
//                     throw unlinkErr;
//                 }
//             });
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });

userRouter.get("/download/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await postModel.find({ userId });
        generateReportAsXlsx(posts);
        return res.send(posts);
        // Convert posts data to worksheet
        const worksheet = xlsx.utils.json_to_sheet(posts);

        // Create a new workbook and add the worksheet
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Posts");

        // Define the directory path and file path
        const directoryPath = path.join(__dirname, "downloads");
        const filePath = path.join(directoryPath, `user_${userId}_posts.xlsx`);

        // Check if the directory exists, if not create it
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
        }

        // Save the workbook to the file path
        xlsx.writeFile(workbook, filePath);

        // Send the file as a response
        res.download(filePath, (err) => {
            if (err) {
                throw err;
            }

            // Delete the file after sending
            fs.unlinkSync(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    throw unlinkErr;
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

let fileName = "posts.xlsx";
const headerArray = ["id", "userId", "title", "body"];
let header = headerArray.join("\t");
header = header + "\n";

function generateReportAsXlsx(data) {
    let writeStream = fs.createWriteStream(fileName);
    writeStream.write(header);
    data.forEach((item) => {
        var row_data =
            item.id +
            "\t" +
            item.userId +
            "\t" +
            item.title +
            "\t" +
            item.body +
            "\t" +
            "\n";
        writeStream.write(row_data);
    });
}

module.exports = userRouter;
