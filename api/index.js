// importing all dependencies
require('./db-connection')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./routes/user');
const posts = require('./routes/post');
const likes = require('./routes/like');
const dislikes = require('./routes/dislike');
const comments = require('./routes/comment');
const conversations = require('./routes/conversation');
const messages = require('./routes/message');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const messageManager = require('./managers/message');
const conversationManager = require('./managers/conversation');

// setting up ExpressJS app
app.use(cors()); // CORS is to allow API to get requests from other apps
app.use(bodyParser.json()); // converting all incoming request data to JSON data because its easy to manipulate
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('uploads')); // setting up static folder to save profile pictures
app.use(fileUpload()); // calling file upload middleware, all incoming files will be available in req.files

// setting up routes for all entities
app.get('/', (req, res) => res.status(200).send("API is working..."));
app.use('/users', users);
app.use('/posts', posts);
app.use('/likes', likes);
app.use('/comments', comments);
app.use('/dislikes', dislikes);
app.use('/conversations', conversations);
app.use('/messages', messages);

// setting up SocketIO server for chat
const server = require("http").Server(app);
const io = require("socket.io")(server);

// managing SocketIO clients
const clients = [];
io.on("connection", client => {
    // console.log("connection: ", client.id);

    // this event will be called when a new socket is connected with SocketIO server
    // Server will keep track of connected sockets
    client.on("init", async userId => {
        // console.log("init: ", userId);
        client.userId = userId;
        if (clients[userId]) {
            clients[userId].push(client);
        } else {
            clients[userId] = [client];
        }
    });

    // this event will be called when a new message is sent
    client.on("new-message", async data => {
        // saving new message in database
        await messageManager.create(data);
        // getting all members of this chat
        const conversationMembers = await conversationManager.getMembersById(data.conversationId);
        // sending newly added message to conversation memebers
        conversationMembers.forEach(member => {
            member = member.toString();
            if(member !== data.authorId.toString()) {
                if(clients[member]) {
                    clients[member].forEach(cli => {
                        cli.emit("message-received");
                    });
                }
            }
        });
    });

    // this event will be called when a socket is disconnected
    client.on('disconnect', () => {
        if (!client.userId || !clients[client.userId]) return;

        // server will remove it from the list of connected sockets
        let targetClients = clients[client.userId];
        for (let i = 0; i < targetClients.length; ++i) {
            if(targetClients[i]) {
                if (targetClients[i] == client) {
                    targetClients.splice(i, 1);
                }
            }
        }
        // console.log("disconnected!!! ", client.id);
    });
});

// setting port for our API
const port = process.env.PORT || 4000;
// starting up the server
server.listen(port, () => console.log(`API started @${port}`));