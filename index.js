 
const { Client } = require('discord.js-selfbot-v13');
const util = require('minecraft-server-util');
const express = require('express');

const options = {
    timeout: 1000 * 5, // timeout in milliseconds
    enableSRV: true // SRV record lookup
};

var isTimePassed = true;

const client = new Client({
	// See other options here
	// https://discordjs-self-v13.netlify.app/#/docs/docs/main/typedef/ClientOptions
	// All partials are loaded automatically
});

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
                                util.status('payidar.rabisu.net', 25565, options)
                                .then((result) =>{
                                        isTimePassed = false;
                                        setTimeout(()=>{isTimePassed = true;},300000)
                                        message.reply(result.players.sample.reduce((prev,curr,index)=>{
                                        return prev + '\n' + "`" + curr.name + "`"},"Şuanda sunucuda olanlar: "))}
                                ).catch((error) => message.channel.send("Maalesef sunucu açık değil, genelde 19:00'da açılır."));
                        }
                        else
                        {
                        message.reply("Bu komut 5 dakikada bir kullanılabilir.");
                        }
                        checkForSpam(message);


                }

});


const app = express();
app.get('/',(req,res)=>{
   res.send("emreyi gotten");     
});
app.listen(80);

client.login(process.env.token);