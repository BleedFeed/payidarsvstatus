 
const { Client } = require('discord.js-selfbot-v13');
const util = require('minecraft-server-util');
const {WebSocketServer} = require('ws');
let websocketChannels = {};
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

        let wss = new WebSocketServer({port:process.env.PORT});
        wss.on('connection',(ws) =>{
                let name;
                let channel;
                ws.on('error',console.error);

                ws.on('message',async (data)=> {
                        let message = dataToJSON(data);
                        if(message instanceof Error) {
                                console.log(message.message);
                                ws.send(message.message);
                                ws.close();
                                return;
                        }
                        if(typeof message.type !== 'string'|| typeof message.message !== 'string') {return;}
                        if(message.type === 'init' && typeof message.name === "string"){
                                   
                                name = message.name;
                                channel = await client.guilds.cache.get('360902871933386753').channels.cache.get('1068073829068447784').createChannel(name);
                                websocketChannels[channel.id] = ws;
                                channel.send(`**${name}** >> ${message.message}`);
                        }
                        else if(message.type === 'message' && channel){
                                console.log("asdsa");
                                channel.send(`**${name}** >> ${message.message}`);
                        }
                });

                ws.on('close',()=>{
                        if(channel){
                                if(!channel.deleted){channel.delete()}
                                delete websocketChannels[channel.id];
                        }

                })
        });


})

function dataToJSON(data){
        try{
                return JSON.parse(data.toString());
        }
        catch(err){
                return new Error("not a valid json");
        }
}


client.on('message', async (message) => {
                if(cooldownList.indexOf(message.author.id) !== -1){return true;}
                if(websocketChannels[message.channelId] && message.author.username !== "d4rkpr1nce"){
                        websocketChannels[message.channelId].send(JSON.stringify({name: message.member.displayName,message:message.content}));
                }
                else if ((message.content === "sunucu açık mı?" || message.content === "Sunucu açık mı?"))
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
                                        if(result.players.online === 0){message.reply("Sunucu açık ama şuanda sunucuda kimse yok."); return;}
                                        message.reply(result.players.list.reduce((prev,curr)=>{
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