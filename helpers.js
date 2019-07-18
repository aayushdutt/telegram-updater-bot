//logging functions
function userString(ctx) {
    return JSON.stringify(ctx.from.id == ctx.chat.id ? ctx.from : {
        from: ctx.from,
        chat: ctx.chat
    });
}

function logMsg(ctx) {
    var from = userString(ctx);
    console.log('->', ctx.message.text, from)
}

function logOutMsg(ctx, text) {
    console.log('<-', {
        id: ctx.chat.id
    }, text);
}

module.exports = {userString, logMsg, logOutMsg}