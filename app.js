{
    "name": "饾懏饾應饾拃饾懇饾懍饾懝 饾懇饾懚饾懟 session",
    "description": "ORMAN-BOT WA bot, Created by Mr Gmax K to simplify your digital lives",
    "logo": "https://files.catbox.moe/3xfxhw.jpg",
    "repository": "https://github.com/Orman87/SESSION-ID",
    "keywords": ["Gcyberbot"],
    "success_url": "/", 
    "buildpacks": [{ "url": "https://github.com/heroku/heroku-buildpack-nodejs#latest" } ],
    "env": {      
      "PORT": {
        "description": "Port for web app.4000,5000,3000... any!",
        "value": "5000",
        "required": false 
      },
      "MESSAGE": {
        "description": "set session id conformation message",
        "value": "",
        "required": false 
      }
    }   

}
