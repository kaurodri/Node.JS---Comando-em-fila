// <Discord Bot>
// npm install discord.js
// Comando em fila para reorganização de informações em diferentes servidores (Discord Server).

client.on('messageCreate', message => {

    const filtro = {
        "channel": ["990770515989901342", "1134435511390437448"],
        "author": ["725483868777611275"]
    };
    const tokens = {
        "990770515989901342": ["991267666620854324", "wjWIt8hK1yPxW5hZT9gZ3nrdCUb0Hs06nqrNOpbggyK8S4bbOWUxg5S2tE92wIW8yu9V"],
        "1134435511390437448": ["", ""]
    };
    const embeds = {
        "990770515989901342": ["929769385114083348", "1126606430431096892"],
        "1134435511390437448": ["", ""]
    }

    if (!filtro["channel"].includes(message.channel.id)) return;
    if (!filtro["author"].includes(message.author.id)) return;

    try {

        // Relógio
        const agora = new Date();
        const hora = agora.getHours();
        const dia = agora.getDate();
        const mes = agora.getMonth() + 1;
        const data = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}`;
        const horaFormatada = hora.toString().padStart(2, '0');

        // Embed
        const embedMine = {
            color: 0x2F3137,
            title: "Hierarquia - Lista de players online",
            thumbnail: {
                url: "https://cdn.discordapp.com/attachments/678637048709775374/991265587265286214/unknown.png"
            },
            fields: [
                { name: "\u200B", value: "\u200B" },
                { name: "\u200B", value: "\u200B" }
            ],
            footer: {
                text: client.guilds.cache.get("437463800883576853").name,
                icon_url: client.guilds.cache.get("437463800883576853").iconURL()
            }
        };

        //Variáveis
        const desc = message.embeds[0].description.replace(/:f>/g, ":t>");
        const onlineContent = desc.replace(/joined/g, "entrou às");
        const offlineContent = desc.replace(/(joined|left)/g, function (x) {
            return x === "joined" ? "entrou" : "saiu às";
        });

        //Webhook
        const webhookClient = new WebhookClient({ id: tokens[message.channel.id][0], token: tokens[message.channel.id][1] });

        //Entrar dentro da Embed do Realmds On
        client.channels.cache.get(embeds[message.channel.id][0]).messages.fetch(embeds[message.channel.id][1]).then(function (Embed) {

            // Verificação se há player online
            const isOnline = message.embeds[0].color === 8043865;
            setTimeout(() => {
                try {
                    if (isOnline) {
                        embedMine.fields[0].name = `Agora: \`\`${horaFormatada}h - ${data}\`\``;
                        embedMine.fields[0].value = onlineContent;
                    } else {
                        embedMine.fields[0].name = "Agora:";
                        embedMine.fields[0].value = "``Nenhum player online``";
                    }

                    embedMine.fields[1].name = Embed.embeds[0].fields[1].name;
                    embedMine.fields[1].value = Embed.embeds[0].fields[1].value;

                    const main = async () => {
                        await webhookClient.editMessage('1126606430431096892', { embeds: [embedMine] });
                    }
                    main();
                } catch (erro) {
                    if (isOnline) {
                        console.log('[Erro] - Online MineRealms - Tem Player :' + erro.message);
                    } else {
                        console.log('[Erro] - Online MineRealms - Não tem Player :' + erro.message);
                    }
                }
            }, 0.5 * 1000 * 60);

            //Offlines
            if (message.embeds[0].color === 9807270) {
                const tem = Embed.embeds[0].fields[1].value.split("\n");
                const tera = offlineContent.split("\n");
                const players = [];
                const users = [];

                for (let i = 0; i < tem.length; i++) {
                    try {
                        const nickTem = tem[i].split(":")[0];
                        const horarioTem = tem[i].split("`")[2].substring(1);
                        players.push([nickTem, horarioTem]);
                        users.push(nickTem);
                    } catch (erro) {
                        console.log('[Erro] - Offline MineRealms - For i:', erro.message);
                    }
                }

                const reverseTera = tera.slice().reverse();
                for (let i = 0; i < tera.length; i++) {
                    try {
                        const nickTera = reverseTera[i].split(":")[0];
                        const horarioTera = reverseTera[i].split("`")[2].substring(1);
                        if (users.includes(nickTera)) {
                            const pos = users.indexOf(nickTera);
                            users.splice(pos, 1);
                        }
                        users.unshift(nickTera);
                        players.push([nickTera, horarioTera]);
                    } catch (erro) {
                        console.log('[Erro] - Offline MineRealms - For i:', erro.message);
                    }
                }

                let novo = '';
                for (let i = 0; i < users.length; i++) {
                    try {
                        novo += users[i] + ":" + players.find(([nick]) => nick === users[i])[1];
                        if (i !== users.length - 1) {
                            novo += "\n";
                        }
                    } catch (erro) {
                        console.log('[Erro] - Offline MineRealms - For i:', erro.message);
                    }
                }


                try {
                    embedMine.fields[1].name = "Últimos a entrar:";
                    embedMine.fields[1].value = novo;
                    embedMine.fields[0].name = Embed.embeds[0].fields[0].name;
                    embedMine.fields[0].value = Embed.embeds[0].fields[0].value;
                    const main = async () => {
                        await webhookClient.editMessage('1126606430431096892', { embeds: [embedMine] })
                    };
                    main();
                } catch (erro) {
                    console.log('[Erro] - Offline MineRealms - Adicionando Players :' + erro.message)
                }

            }

        })

    } catch (error) {
        console.log('[Erro] - MineRealms : ' + error.message)
    }
})