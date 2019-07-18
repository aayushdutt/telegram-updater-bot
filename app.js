const Telegraf = require('telegraf')
const TelegrafInlineMenu = require('telegraf-inline-menu')

const db = require('./db')
const htmlFetcher = require('./htmlFetcher')
const {logOutMsg, logMsg} = require('./helpers')

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

// -------MIDDLEWARES----------

//logging
bot.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log('%sms', ms) //response time
})

// -------------MENU-------------
const menu = new TelegrafInlineMenu(ctx => `Hey ${ctx.from.first_name}!`)

menu.setCommand('start')

//  LIST
menu.simpleButton('List Checkers', 'listCheckers', {
    doFunc: ctx => {
        var checkers = db.getCheckers(ctx.from.id)
        if(checkers.length < 1) {
            ctx.answerCbQuery("No checkers found.")
            return;
        }
        var reply = "*Checkers:* \n"
        checkers.forEach( (checker, idx) => {
            reply+= `${idx+1}. ${checker.name}\n`
        })
        ctx.replyWithMarkdown(reply)
    }
})

//  CREATE
menu.question('Create a new Checker', 'createCheckerMenu', {
    questionText: "Enter HTML element to check: \n" + "Format: \n" + "name~~url~~selector", 
    setFunc: (ctx, ans) => {
        var checkerElements = ans.split("~~")
        var newChecker= {
            name: checkerElements[0],
            url: checkerElements[1],
            selector: checkerElements[2]
        }
        if(!newChecker) ctx.answerCbQuery("Invalid Format")
        
        db.addChecker(ctx, newChecker)
    }
})

//  CHECK (MENU)
menu.simpleButton('Check!', 'checkForUpdates', {
    doFunc: async ctx => {
        ctx.reply("checking for updates... ")
        reply = await check(ctx.from.id)
        ctx.replyWithMarkdown(reply)
    }
})

bot.use(menu.init({
    backButtonText: 'Back…',
    mainMenuButtonText: 'Back to main menu…'
}))


//BOT COMMANDS
bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.command('/check', async (ctx) => {
    logMsg(ctx)
    ctx.reply("checking for updates... ")

    reply = await check(ctx.from.id)

    ctx.replyWithMarkdown(reply)
    logOutMsg(ctx, reply)
})

async function check(userId) {
    var checkers = await db.getCheckers(userId)
    var promiseArray =  []

    checkers.forEach(checker => {
        var fetcher = new htmlFetcher(checker.selector, checker.url)
        promiseArray.push(fetcher.fetchData())
    })

    const data = await Promise.all(promiseArray)
    var reply = ""
    data.forEach((el, idx) => {
        reply += `${idx+1}. *${checkers[idx].name}:* ${el}`
    })
    return reply;
}

// Launch Bot
bot.launch()