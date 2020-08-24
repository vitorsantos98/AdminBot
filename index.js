const express = require('express');
const pug = require('pug');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const Rcon = require('./RCON');
const sqlite3 = require('sqlite3').verbose();
const jsonrpc = require('request');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
//const role = new Discord.Role();



//create database
let db = new sqlite3.Database('./servers.db');

//check table exist if not create table on database
db.run('SELECT ip FROM servers',(err) =>{

	if(err)
	{
		if(err.message == "SQLITE_ERROR: no such table: servers")
		{
			db.run('CREATE TABLE servers(ip TEXT NULL,port TEXT NULL,rconpassword TEXT NULL,server TEXT NULL)');
			console.log("Created table!");
		}

	}

});
	
//Rcontest.sendRcon('2.83.61.190', "12205","12345" , 'getstatus');
client.once('ready', () => {
  console.log("Ready!");
});

client.on('message', msg => {
	//console.log(msg.content);

is_admin = 0;

	var admin = msg.member.roles.cache.array();

  for (var i = 0; i < admin.length; i++) {
    var r = admin[i].permissions;

    try{

    if(r.has({ haspermission: 'Administrator', haspermission: 'KICK_MEMBERS',haspermission: 'BAN_MEMBERS'}))
    {
      is_admin = 1;
    }

    }
    catch(error)
    {

    }
   
  }

//console.log(admin);

//var admin = msg.member.roles.cache.find(r => r.name === "admin");

	if(is_admin == 1)
	{
	
	console.log("Is admin!")
	//help command for the commands of the bot
	switch(msg.content)
	{

				
		case "!bot help":

    const helpembed = new Discord.RichEmbed()
    .setTitle('Help commands')
    .addField('!kickr @user <reason>', 'kick user from discord server with reason')
    .addField('!ban @user <reason>', 'ban user from discord server with reason')
    .addField('!add server1 <IP> <PORT> <RCONPASSWORD>','Add the server1')
    .addField('!add server2 <IP> <PORT> <RCONPASSWORD>','Add the server2')
    .addField('!srv1 ban <ID>', 'Ban player from server1')
    .addField('!srv1 <command/variable> <optional>','Send command to server')
    .addField('!srv2 <command/variable> <optional>','Send command to server')
    .addField('!srv2 ban <ID>', 'Ban player from server2');

    
    msg.channel.send(helpembed);
		break;
 	
 	}

    let command_args = msg.content.split(" ");
    let id = command_args[2];
	  	
    switch(command_args[0])
    {
      case "!kickr":
      case "!banr":
                    kick_ban(msg);
                    console.log("Admin!");
                    break;
      case "!add":                        
      case "!srv1":                  
      case "!srv2":
                    console.log("Server!");
                    check_servers_added(msg,command_args);
                    break

    }

}

});



function check_servers_added(msg,command_args)
{
   //var have_text_1 = msg.content.includes("!add server1");
  
    //query table
		let sql = 'SELECT server FROM servers';

		//get all rows from table
		 db.all(sql, [], (err, rows) => {
  		
  		if(rows.length == 0 && command_args[0] != "!add")
			{
				msg.channel.send("No server set! Add a server first!");
				
			}

      if(command_args[0] == "!add" && command_args[1] == "server1")
      {
             record_servers(msg);
      }
			
      if(rows.length > 0)
			{
				for (var i = 0; i <= rows.length; i++) 
				{
  				row = rows[i];

  					if(row){
  						var sv = row.server;

  						switch(command_args[0])
              {
                case "!srv1":
                              get_server(1,msg,command_args);
                              break;
                case "!srv2":
                              get_server(2,msg,command_args);
                              break
              }
 						

  					}
  				}
			}

  		});
		
}


function get_server(sv,msg,cmd)
{
		//query table
  	let sql = 'SELECT ip,port,rconpassword,server FROM servers';

  	//msg.channel.send("Test!");

  	//get all rows from table
  	db.all(sql, [], (err, rows) =>{

  	for (var i = 0; i < rows.length; i++) {
  		
  		row_ip = rows[i].ip;
  		row_port = rows[i].port;
  		row_rcon = rows[i].rconpassword;
  		row_sv = rows[i].server;

  		if(row_ip && row_port && row_rcon){

  			
      
        if(row_sv == "1" && sv == 1 && cmd[1] != "ban")
  				{
  				
  					//console.log(rows[i]);
  					if(cmd[2] == undefined)
            {

            Rcon.sendRcon(row_ip ,row_port ,row_rcon , cmd[1] + "  ",msg);
            }
            else{

            Rcon.sendRcon(row_ip ,row_port ,row_rcon , cmd[1] + " " + cmd[2],msg);
  					 
             }
            break;
  				}

  			if(row_sv == "2" && sv == 2 && cmd[1] != "ban")
  				{
  					
  					//console.log(rows[i]);
  				  if(cmd[2] == undefined)
            {

            Rcon.sendRcon(row_ip ,row_port ,row_rcon , cmd[1] + "  ",msg);
            }
            else{

            Rcon.sendRcon(row_ip ,row_port ,row_rcon , cmd[1] + " " + cmd[2],msg);
             
             }
  					break;
  				}

  		
  			if(row_sv == "1" && sv == 1 && cmd[1] == "ban")
  			{
  				
  				Rcon.sendRcon(row_ip ,row_port ,row_rcon ,'banid ' + cmd[2],msg);
  			}

			if(row_sv == "2" && sv == 2 && cmd[1] == "ban")
  			{
  				Rcon.sendRcon(row_ip ,row_port ,row_rcon ,'banid ' + cmd[2],msg);
  			}
  			

  			}
  		}
  	});

  	
}


function record_servers(msg)
{
    //var have_text_3 = msg.content.includes('!add server1');
    //var have_text_4 = msg.content.includes('!add server2');

    let command_args = msg.content.split(" ");
    let ip = command_args[2];
    let port = command_args[3];
    let rconpassword = command_args[4];

      let sql = 'SELECT ip FROM servers';

      db.all(sql, [], (err,rows) =>{

      if(rows.length == 0)
      {
        console.log("Theres no rows!");

        if(command_args[0] == "!add" && command_args[1] == "server1")
        {
        db.run('INSERT INTO servers(ip,port,rconpassword,server) VALUES("' + ip + '","' + port + '","' + rconpassword + '","1")');
        msg.channel.send("Server 1 have been set!");
        }
        else
        {
          db.run('INSERT INTO servers(ip,port,rconpassword,server) VALUES("' + ip + '","' + port + '","' + rconpassword + '","2")');
          msg.channel.send("Server 2 have been set!");
        }
      }
      else
      {
        console.log("Theres one row!");
        
        if(command_args[0] == "!add" && command_args[1] == "server1")
        {
        db.run('UPDATE servers SET ip = "' + ip + '",port = ' + port + ',rconpassword = ' + rconpassword + ' WHERE server = 1');
        msg.channel.send("Server 1 have been updated!");
        }
        else
        {
          db.run('UPDATE servers SET ip = "' + ip + '",port = ' + port + ',rconpassword = ' + rconpassword + ' WHERE server = 2');
          msg.channel.send("Server 2 have been updated!");
        }

      }

      


      });
    

    }

    function kick_ban(msg)
    {
      
     let command_args = msg.content.split(" ");

     let mb = msg.mentions.members.first();  
      
      if(command_args[0] == "!kickr")
      {

        mb.kick().then((mb) => {
          
          msg.channel.send('User ' + mb.displayName + ' has been kick for ' + command_args[2] + '!');

        });

      }

      if(command_args[0] == "!banr")
      {
          mb.ban().then((mb) => {

        msg.channel.send('User ' + mb.displayName + ' has been banned for ' + command_args[2] + '!');
        
        });
      
      }
    
    }

client.login(token);