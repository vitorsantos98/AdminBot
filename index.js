const express = require('express');
const pug = require('pug');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const Rcontest = require('./RCON');
const sqlite3 = require('sqlite3').verbose();

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

	var admin = msg.guild.roles.some(r => r.name == "admin");


	if(admin === true)
	{
	
	
	//help command for the commands of the bot
	switch(msg.content)
	{

		
		
		case "!bot help":
		{
		//show bot commands
		msg.channel.send("!kickr @user <reason> - kick user from discord server with reason");
		msg.channel.send("!ban @user <reason> - ban user from discord server with reason")

		msg.channel.send("!add server1 <IP> - Add to the server1 a IP");
		msg.channel.send("!add server1 <PORT> - Add to the server1 a PORT");
		msg.channel.send("!add server2 <IP> - Add to the server2 a IP");
		msg.channel.send("!add server2 <PORT> - Add to the server2 a PORT");
		msg.channel.send("!qs 1 - Query server number 1");
		msg.channel.send("!qs 2 - Query server number 2");
		msg.channel.send("!srv1 kick <ID> - Kick player from server1");
		msg.channel.send("!srv1 ban <ID> - Ban player from server1");
		msg.channel.send("!srv2 kick <ID> - Kick player from server2");
		msg.channel.send("!srv2 ban <ID> - Ban player from server2");
		break;

		}
		case "!qs 1":
		{
	
  		check_servers_added(msg);
  		break;
  					  		
  		}
  		 case "!qs 2":
		{
	
  		check_servers_added(msg);
  		break;				  		
  		}

  	}

  	var have_text_1 = msg.content.includes('!kickr ');
  	var have_text_2 = msg.content.includes('!banr');
  	var have_text_3 = msg.content.includes('!add server1');
  	var have_text_4 = msg.content.includes('!add server2');
  	var have_text_5 = msg.content.includes('!srv1 kick');
  	var have_text_6 = msg.content.includes('!srv1 banid');
  	var have_text_7 = msg.content.includes('!srv2 kick');
  	var have_text_8 = msg.content.includes('!srv2 banid');
  	
  	
  	if(have_text_1 === true || have_text_2 === true)
  	{
  		
  		
  		//split message in user and reason
		var text = "";

			for (var i = 0; i < msg.content.length; i++) {
				c = msg.content[i];

				text += c;

				if(text_cleaned == 2 && i == ( msg.content.length - 1))
				{
					var reason = text;
					text = "";
				}


				if(text_cleaned == 1 && c == " ")
				{
					text_cleaned = 2;
					var user = text;
					text = "";
				}


				if(text == "!kickr ")
				{
					text_cleaned = 1;
					text = "";
				}

				if(text == "!banr ")
				{
					text_cleaned = 1;
					text = "";
				}


			}

			var mb = msg.mentions.members.first();	
			//console.log(mb);
			
			if(have_text_1 == true)
			{
			

			mb.kick().then((mb) => {

				msg.channel.send('User ' + mb.displayName + ' has been kick for ' + reason + '!');

			});

			}

			if(have_text_2 == true)
			{
				
				mb.ban().then((mb) => {

				msg.channel.send('User ' + mb.displayName + ' has been banned for ' + reason + '!');
				
			});
			
			

			}

			
		
	}
		


  	if(have_text_3 == true || have_text_4 == true)
  	{
  		console.log("Add trig!");

  		var text = "";
  		var space = 0;

  		for (var i = 0; i < msg.content.length; i++) {
  			c = msg.content[i];
  			
  			if(c != " ")
  			{
  			text += c;
  			}

  			if(text_cleaned == 3 && i == ( msg.content.length - 1) )
  			{
  				var rconpassword = text;
  				var text = "";
  				

  			}

  			if(text_cleaned == 2 && c == " ")
  			{
  				var port = text;
  				var text = "";
  				var text_cleaned = 3
  		
  			}

  			if(text_cleaned == 1 && c == " ")
  			{
  				ip = text;
  				var text = "";
  				var text_cleaned = 2
  				
  			}
  			 		
  		
  			if(text == "!addserver1" && i == 12)
  			{
  				var text = "";

  				var text_cleaned = 1;
  				
  			}

  			if(text == "!addserver2" && i == 12)
  			{
  				var text = "";

  				var text_cleaned = 1;
  				
  			}
  			




  		}

  		let sql = 'SELECT ip FROM servers';

  		db.all(sql, [], (err,rows) =>{

  		if(rows.length == 0)
  		{

  			if(have_text_1 == true)
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
  			if(have_text_1 == true)
  			{
  			db.run('UPDATE servers SET ip = "' + ip + '","port = ' + port + '",rconpassword = ' + rconpassword + ' WHERE server = 1');
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

  	if(have_text_5 == true || have_text_6 == true || have_text_7 == true || have_text_8 == true)
  	{
  		
  		console.log("Srv trig!");
  		var text = "";

  		for (var i = 0; i < msg.content.length; i++) {
  			
  			c = msg.content[i];

  			text += c;

  			if(text_cleaned == 1 && i == ( msg.content.length - 1))
  			{
  				var id = text;
  			}

  			if(text == "!srv1 kick ")
  			{
  				var text = "";
  				var text_cleaned = 1;
  				var sv = 1;
  			}

  			if(text == "!srv1 banid ")
  			{
  				var text = "";
  				var text_cleaned = 1;
  				var sv = 2;
  			}

  			if(text == "!srv2 kick ")
  			{
  				var text = "";
  				var text_cleaned = 1;
  				var sv = 3;
  			}

  			if(text == "!srv2 banid ")
  			{
  				var text = "";
  				var text_cleaned = 1;
  				var sv = 4;
  			}

  		}

  		switch(sv)
  		{
  			case 1:
  			get_server(1,msg,id,"kick");
 			break;
  			case 2:
  			get_server(1,msg,id,"banid");
  			break;

  			case 3:
  			get_server(2,msg,id,"kick");
  			break;
  			case 4:
  			get_server(2,msg,id,"banid");
  			break;
  			
  		}



  	}


}

});




	

client.login(token);


function check_servers_added(msg)
{
		//query table
		let sql = 'SELECT server FROM servers';

		//get all rows from table
		 db.all(sql, [], (err, rows) => {
  		
  			if(rows.length == 0)
			{
				msg.channel.send("No server set! Add a server first!");
				
			}
			else
			{
				for (var i = 0; i <= rows.length; i++) 
				{
  				row = rows[i];

  					if(row){
  						var sv = row.server;

  						if(rows.length == 1)
  						{
  							  						
  							if(msg.content == "!qs 1" && sv == "1")
  							{
  								get_server(1,msg,"NULL","NULL");
  							}

  							if(msg.content == "!qs 2" && sv == "2")
  							{
  								get_server(2,msg,"NULL","NULL");
  							}

  							if(msg.content == "!qs 1" && sv == "2")
  							{
  								msg.channel.send("Server 1 not set!");
  							}
  							
  							if(msg.content == "!qs 2" && sv == "1")
  							{
  								msg.channel.send("Server 2 not set!");
  							}
							

  						}

  					}
  				}
			}

  		});


		
		
}


function get_server(sv,msg,id,type)
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

  			if(row_sv == "1" && sv == 1 && type == "NULL")
  				{
  					console.log("Kick trig4!");
  					//console.log(rows[i]);
  					//Rcontest.sendRcon(row_ip ,row_port ,row_rcon , 'status');
  					break;
  				}

  			if(row_sv == "2" && sv == 2 && type == "NULL")
  				{
  					console.log("Kick trig3!");
  					//console.log(rows[i]);
  					Rcontest.sendRcon(row_ip ,row_port ,row_rcon ,'status',msg);
  					break;
  				}


  			if(row_sv == "1" && sv == 1 && type == "kick")
  			{
  				console.log("Kick trig2!");
  				Rcontest.sendRcon(row_ip ,row_port ,row_rcon ,'clientkick' + id,msg);
  			}

  			if(row_sv == "1" && sv == 1 && type == "banid")
  			{
  				console.log("Kick trig2!");
  				Rcontest.sendRcon(row_ip ,row_port ,row_rcon ,'clientkick ' + id,msg);
  			}

			if(row_sv == "2" && sv == 2 && type == "kick")
  			{
  				Rcontest.sendRcon(row_ip ,row_port ,row_rcon ,'clientkick ' + id,msg);
  			}
  			

  			if(row_sv == "2" && sv == 2 && type == "banid")
  			{
  				Rcontest.sendRcon(row_ip ,row_port ,row_rcon ,'banid ' + id,msg);
  			}

  			}
  		}
  	});

  	
}


