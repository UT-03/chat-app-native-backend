const socket = require('socket.io');
const ActiveUser = require('./models/ActiveUser');

const addSockets = (server) => {
    const io = socket(server, {
        cors: {
            origin: false,
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(socket.id, 'connected')
        socket.on("user active", async ({ userId }) => {
            try {
                console.log(userId, socket.id, 'joined')
                // Checking is user already exists
                let existingUser = await ActiveUser.findOne({ userId: userId });
                console.log(existingUser)

                // If user with this userId already exists
                if (existingUser) {
                    existingUser.socketId = socket.id;
                }
                else {
                    // Else => create a new active user
                    existingUser = new ActiveUser({
                        userId: userId,
                        socketId: socket.id
                    })
                }

                // Saving active user in DB
                await existingUser.save();
            } catch (err) {
                console.log(err);
            }
        });

        socket.on("user inactive", async ({ userId }) => {
            try {
                // Checking if there is any existing active user with the given userId
                let existingUser = await ActiveUser.findOne({ userId: userId });

                // If user does not exist => simply return the function
                if (!existingUser)
                    return;

                // Else => remove active User
                await existingUser.remove();
            } catch (err) {
                console.log(err);
            }
        });

        socket.on("send-msg", async ({ from, to, text }) => {
            try {
                const activeUser = await ActiveUser.findOne({ userId: to });

                if (activeUser) {
                    socket.to(activeUser.socketId).emit("msg-recieve", {
                        sender: from,
                        message: {
                            text: text,
                            fromSelf: false
                        }
                    });
                }
            } catch (error) {
                console.log(error);
            }
        })

        socket.on('disconnect', async () => {
            console.log(socket.id, 'disconnected')
            try {
                // Checking if there is any existing active user with the given socketId
                let existingUser = await ActiveUser.findOne({ socketId: socket.id });

                // If user does not exist => simply return the function
                if (!existingUser)
                    return;

                // Else => remove active User
                await existingUser.remove();
            } catch (err) {
                console.log(err);
            }
        })
    });
}

module.exports = {
    addSockets
};