const Telegraf = require('telegraf')
const htmlFetcher = require('./htmlFetcher')

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

const friendsFetcher = new htmlFetcher('.info ul li:nth-of-type(3)', 'http://codeforces.com/profile/aayushdutt')
const followersFetcher = new htmlFetcher('.AboutListItem.ContentViewsAboutListItem span.body_text span.main_text',
                                         'https://www.quora.com/profile/Aayush-Dutt-1')


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

//middlewares
bot.use(async (ctx, next) => {
    const start = new Date()
    logMsg(ctx)
    await next()
    const ms = new Date() - start
    console.log('%sms', ms)
})

//bot replies
bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))


bot.command('/check', async (ctx) => {
    ctx.reply("checking for updates... ")
    friends = await friendsFetcher.fetchData()
    followers = await followersFetcher.fetchData()
    ctx.reply(friends + '\n' + followers)
    logOutMsg(ctx, friends + '\n' + followers)
})

bot.launch()