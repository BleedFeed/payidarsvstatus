 
const { Client } = require('discord.js-selfbot-v13');
const util = require('minecraft-server-util');
const express = require('express');

const options = {
    timeout: 1000 * process.env.requestTimeout, 
    enableSRV: false
}

var isTimePassed = true;

const client = new Client({});


var cooldownList = [];

const checkForSpam = (message) => {
        if(cooldownList.indexOf(message.author.id) === -1)
        {
                cooldownList.push(message.author.id);
                setTimeout(()=>{cooldownList.splice(cooldownList.indexOf(message.author.id),1)},process.env.cooldown);
        }
}


client.on('ready', async () => {
        console.log(`${client.user.username} is ready!`);
})

client.on('message', async (message) => {
                if(cooldownList.indexOf(message.author.id) !== -1){return true;}
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
                        if(message.channel.type !== "GUILD_TEXT") return;
                        if(isTimePassed)
                        {
                                try
                                {
                                        let query = await queryServer();
                                        isTimePassed = false;
                                        setTimeout(()=>{isTimePassed = true;},300000);
                                        message.reply(query.players.list.reduce((prev,curr,index)=>{
                                        return prev + '\n' + "`" + curr + "`"},"Şuanda sunucuda olanlar: "));
                                }
                                catch(err)
                                {
                                        message.channel.send("Maalesef sunucu açık değil, genelde 19:00'da açılır.");
                                }
                              

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
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Content-Type","application/json");
  try
  {
        res.end(JSON.stringify(await queryServer()));
  }
  catch(err)
  {
        res.end(JSON.stringify({error:err.message}));
  }

})

app.listen(port, () => {
  console.log(`sunucu acık port: ${port}`)
})

client.login(process.env.token);