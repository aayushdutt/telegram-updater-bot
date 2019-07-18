const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('databases/db.json')
const db = low(adapter)

db.defaults({ users: [] })
  .write()

db.getCheckers = (userId) => {
    var user = db.get('users')
    .find({userId})
    .value()

    if(!user) return [];
    return user.checkers;
}

db.addChecker = (ctx, checker) => {
    userId = ctx.from.id;
    userInfo = ctx.from;

    var user = db.get('users')
    .find({userId})

    if(user.value()) { //TODO:check if already present
        user.get('checkers')
        .push(checker)
        .write()
    }

    else {
        var userObj = {
            userId,
            userInfo,
            checkers: [
                checker
            ]
        }

        db.get("users")
        .push(userObj)
        .write()
    }

    ctx.reply("created!")
}

db.removeChecker = (ctx, name) => {
    userId = ctx.from.id;

    try{
        ctx.reply("removing: " + name);

        db.get('users')
        .find({userId})
        .get('checkers')
        .remove({name: name})
        .write()
        
        ctx.reply("removed: " + name);
    }
    catch {
        ctx.reply("Checker not found");
    }
}

// TODO: update and delete

module.exports = db