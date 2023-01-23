 
const { Client } = require('discord.js-selfbot-v13');
const util = require('minecraft-server-util');
require('dotenv').config();

const options = {
    timeout: 1000 * process.env.requestTimeoutSeconds, 
    enableSRV: false
}

var isTimePassed = true;

const client = new Client({});


var cooldownList = [];

const checkForSpam = (message) => {
        if(cooldownList.indexOf(message.author.id) === -1)
        {
                cooldownList.push(message.author.id);
                setTimeout(()=>{cooldownList.splice(cooldownList.indexOf(message.author.id),1)},process.env.cooldownSeconds * 1000);
        }
}


client.on('ready', async () => {
        console.log(`${client.user.username} is ready!`);
})

client.on('message', async (message) => {
                if(cooldownList.indexOf(message.author.id) !== -1){return true;}
                if ((message.content === "sunucu açık mı?" || message.content === "Sunucu açık mı?"))
                {
                        util.status('payidar.rabisu.net', 25845, options)
                            .then((result) => message.reply(`Sunucu açık ve şuan oynayan ${result.players.online} kişi var.`))
                            .catch((error) => {message.reply("Maalesef sunucu açık değil, genelde 19:00'da açılır."); console.log(error)});
                        checkForSpam(message);
                }
                else if( message.content === "süper bot")
                {
                        message.reply("tşk  (⌒ω⌒)");
                        checkForSpam(message);
                }

                else if((message.content === "sunucuda kimler var?" || message.content === "Sunucuda kimler var?"))
                {
                        if(message.channel.type !== "GUILD_TEXT") return;
                        if(isTimePassed)
                        {

                                util.queryFull('payidar.rabisu.net',25845,options)
                                .then((result)=>{
                                        isTimePassed = false;
                                        setTimeout(()=>{isTimePassed = true;},300000);
                                        message.reply(query.players.list.reduce((prev,curr,index)=>{
                                        return prev + '\n' + "`" + curr + "`"},"Şuanda sunucuda olanlar: "));
                                })
                                .catch((error) => {message.reply("Maalesef sunucu açık değil, genelde 19:00'da açılır."); console.error(error);});
                        }
                        else
                        {
                        message.reply("Bu komut 5 dakikada bir kullanılabilir.");
                        }
                        checkForSpam(message);


                }

});

client.login(process.env.token);