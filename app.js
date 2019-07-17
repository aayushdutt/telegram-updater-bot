const TELEGRAM_BOT_TOKEN = '945298348:AAHa2OFEJQ-dvsS4gzE4EfWsAca8Y1wT7_c'
const TeleBot = require('telebot');
const htmlFetcher = require('./htmlFetcher')

const bot = new TeleBot(TELEGRAM_BOT_TOKEN);

const friendsFetcher = new htmlFetcher('.info ul li:nth-of-type(3)', 'http://codeforces.com/profile/aayushdutt')
const followersFetcher = new htmlFetcher('.AboutListItem.ContentViewsAboutListItem span.body_text span.main_text',
                                         'https://www.quora.com/profile/Aayush-Dutt-1')
                                         
bot.on('/check', async (msg) => {
    msg.reply.text("checking for updates... ")
    friends = await friendsFetcher.fetchData()
    followers = await followersFetcher.fetchData()
    msg.reply.text(friends + '\n' + followers)
});

bot.start();