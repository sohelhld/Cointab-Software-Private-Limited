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

let arr = [
    {
        id: "1",
        title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
        userId: "1",
    },
    {
        id: "2",
        title: "qui est esse",
        body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
        userId: "1",
    },
    {
        id: "5",
        title: "nesciunt quas odio",
        body: "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque",
        userId: "1",
    },
    {
        id: "6",
        title: "dolorem eum magni eos aperiam quia",
        body: "ut aspernatur corporis harum nihil quis provident sequi\nmollitia nobis aliquid molestiae\nperspiciatis et ea nemo ab reprehenderit accusantium quas\nvoluptate dolores velit et doloremque molestiae",
        userId: "1",
    },
    {
        id: "7",
        title: "magnam facilis autem",
        body: "dolore placeat quibusdam ea quo vitae\nmagni quis enim qui quis quo nemo aut saepe\nquidem repellat excepturi ut quia\nsunt ut sequi eos ea sed quas",
        userId: "1",
    },
    {
        id: "8",
        title: "dolorem dolore est ipsam",
        body: "dignissimos aperiam dolorem qui eum\nfacilis quibusdam animi sint suscipit qui sint possimus cum\nquaerat magni maiores excepturi\nipsam ut commodi dolor voluptatum modi aut vitae",
        userId: "1",
    },
    {
        id: "9",
        title: "nesciunt iure omnis dolorem tempora et accusantium",
        body: "consectetur animi nesciunt iure dolore\nenim quia ad\nveniam autem ut quam aut nobis\net est aut quod aut provident voluptas autem voluptas",
        userId: "1",
    },
    {
        id: "10",
        title: "optio molestias id quia eum",
        body: "quo et expedita modi cum officia vel magni\ndoloribus qui repudiandae\nvero nisi sit\nquos veniam quod sed accusamus veritatis error",
        userId: "1",
    },
    {
        id: "4",
        title: "eum et est occaecati",
        body: "ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit",
        userId: "1",
    },
    {
        id: "3",
        title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
        body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
        userId: "1",
    },
    {
        id: "12",
        title: "in quibusdam tempore odit est dolorem",
        body: "itaque id aut magnam\npraesentium quia et ea odit et ea voluptas et\nsapiente quia nihil amet occaecati quia id voluptatem\nincidunt ea est distinctio odio",
        userId: "1",
    },
    {
        id: "16",
        title: "sint suscipit perspiciatis velit dolorum rerum ipsa laboriosam odio",
        body: "suscipit nam nisi quo aperiam aut\nasperiores eos fugit maiores voluptatibus quia\nvoluptatem quis ullam qui in alias quia est\nconsequatur magni mollitia accusamus ea nisi voluptate dicta",
        userId: "1",
    },
    {
        id: "11",
        title: "et ea vero quia laudantium autem",
        body: "delectus reiciendis molestiae occaecati non minima eveniet qui voluptatibus\naccusamus in eum beatae sit\nvel qui neque voluptates ut commodi qui incidunt\nut animi commodi",
        userId: "1",
    },
    {
        id: "14",
        title: "voluptatem eligendi optio",
        body: "fuga et accusamus dolorum perferendis illo voluptas\nnon doloremque neque facere\nad qui dolorum molestiae beatae\nsed aut voluptas totam sit illum",
        userId: "1",
    },
    {
        id: "15",
        title: "eveniet quod temporibus",
        body: "reprehenderit quos placeat\nvelit minima officia dolores impedit repudiandae molestiae nam\nvoluptas recusandae quis delectus\nofficiis harum fugiat vitae",
        userId: "1",
    },
    {
        id: "13",
        title: "dolorum ut in voluptas mollitia et saepe quo animi",
        body: "aut dicta possimus sint mollitia voluptas commodi quo doloremque\niste corrupti reiciendis voluptatem eius rerum\nsit cumque quod eligendi laborum minima\nperferendis recusandae assumenda consectetur porro architecto ipsum ipsam",
        userId: "1",
    },
    {
        id: "19",
        title: "adipisci placeat illum aut reiciendis qui",
        body: "illum quis cupiditate provident sit magnam\nea sed aut omnis\nveniam maiores ullam consequatur atque\nadipisci quo iste expedita sit quos voluptas",
        userId: "1",
    },
    {
        id: "20",
        title: "doloribus ad provident suscipit at",
        body: "qui consequuntur ducimus possimus quisquam amet similique\nsuscipit porro ipsam amet\neos veritatis officiis exercitationem vel fugit aut necessitatibus totam\nomnis rerum consequatur expedita quidem cumque explicabo",
        userId: "1",
    },
    {
        id: "18",
        title: "voluptate et itaque vero tempora molestiae",
        body: "eveniet quo quis\nlaborum totam consequatur non dolor\nut et est repudiandae\nest voluptatem vel debitis et magnam",
        userId: "1",
    },
    {
        id: "17",
        title: "fugit voluptas sed molestias voluptatem provident",
        body: "eos voluptas et aut odit natus earum\naspernatur fuga molestiae ullam\ndeserunt ratione qui eos\nqui nihil ratione nemo velit ut aut id quo",
        userId: "1",
    },
];

userRouter.get("/download/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await postModel.find(
            {},
            { _id: 0, id: 1, userId: userId, title: 1, body: 1 }
        );
        const data = posts.map((post) => {
            return post;
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

module.exports = userRouter;
