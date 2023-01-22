 
const { Client } = require('discord.js-selfbot-v13');
const util = require('minecraft-server-util');
const express = require('express');

const options = {
    timeout: 1000 * 5, 
    enableSRV: true 
};

var isTimePassed = true;

const client = new Client({});

var potentialSpammers = {};

var spammers = [];

const checkForSpam = (message) => {
        if(!potentialSpammers[message.author.id])
        {
                potentialSpammers[message.author.id] = {lastMessage:Date.now(),annen:1};
                setTimeout(()=>{delete potentialSpammers[message.author.id]},30000);
        }
        else
        {
                if(Date.now() - potentialSpammers[message.author.id].lastMessage <= 2000)
                {
                        potentialSpammers[message.author.id].annen = ++potentialSpammers[message.author.id].annen;
                        if(potentialSpammers[message.author.id].annen == 5)
                        {
                                message.reply("Spam yapma lan")
                                spammers.push(message.author.id);
                                delete potentialSpammers[message.author.id];
                                setTimeout(()=>{spammers.splice(spammers.indexOf(message.author.id,1))},3600000);

                        }
                }
                if(typeof potentialSpammers[message.author.id] !== "undefined")
                {
                        potentialSpammers[message.author.id].lastMessage = Date.now();
                }
        }
}


client.on('ready', async () => {
        console.log(`${client.user.username} is ready!`);
})

client.on('message', async (message) => {
                if(spammers.indexOf(message.author.id) !== -1){return true;}
                if ((message.content === "sunucu açık mı?" || message.content === "Sunucu açık mı?"))
                {
                        util.status('payidar.rabisu.net', 25565, options)
                            .then((result) => message.channel.send(`Sunucu açık ve şuan oynayan ${result.players.online} kişi var.`))
                            .catch((error) => message.channel.send("Maalesef sunucu açık değil, genelde 19:00'da açılır."));
                        checkForSpam(message);
                }
                else if( message.content === "süper bot")
                {
                        message.reply("tşk  (⌒ω⌒)");
                        checkForSpam(message);
                }

                else if((message.content === "sunucuda kimler var?" || message.content === "Sunucuda kimler var?"))
                {
                        if(isTimePassed)
                        {
                                let query = await queryServer().catch(err => {message.channel.send("Maalesef sunucu açık değil, genelde 19:00'da açılır."); return;});
                                isTimePassed = false;
                                setTimeout(()=>{isTimePassed = true;},300000)
                                message.reply(query.players.list.reduce((prev,curr,index)=>{
                                return prev + '\n' + "`" + curr.name + "`"},"Şuanda sunucuda olanlar: "))
                        }
                        else
                        {
                        message.reply("Bu komut 5 dakikada bir kullanılabilir.");
                        }
                        checkForSpam(message);


                }

});

const queryServer = async () => {
        return await util.queryFull('payidar.rabisu.net',25845,options).catch(err=>{throw new Error(err)});
        
}


const app = express();
const port = process.env.PORT || 3333;

app.get('/', async (req, res) => {
  res.setHeader("Content-Type","application/json");
  res.end(JSON.stringify(await queryServer()));
})

app.listen(port, () => {
  console.log(`sunucu acık port: ${port}`)
})
client.login(process.env.token);