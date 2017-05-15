const fs = require('fs')
let mailgun = require('mailgun-js')
let mustache = require('mustache')
require("./mailin.js")
var blue = function(config, subject, from, to, content){
    let blueTo = {}
    blueTo[to.email] = to.name

    let mailOptions = { 
        to: blueTo,
        from: [from.email, from.name],
        subject,
        html: content
    }

    var client = new Mailin(config.email.sendinblue.url,config.email.sendinblue.key);
  
    client.send_email(mailOptions).on('complete', function(emailRes) {
      console.log(emailRes);
    });
  }

var gun = function(config, subject, from, to, content) {
    let mailgunSender = mailgun({apiKey: config.email.mailgun.key, domain: config.email.mailgun.domain})
      
    let mailOptions = { 
        from: from.name + '<' + from.email + '>',
        to: to.name + '<' + to.email + '>',
        subject: subject,
        html: content    
    }

    mailgunSender.messages().send(mailOptions, function (error, body) {
      console.log(body)
    })
  } 

module.exports = {
  mailgun: gun,
  sendinblue: blue,
  send: function(config, subject, from, to, htmlTemplate, data) {
    console.log(data)
    fs.readFile(`./resources/templates/${htmlTemplate}`, function (err, content) {
      if (err) throw err
      
      htmlTemplate = content.toString()
      const sendHtml = mustache.render(htmlTemplate, data)

      blue(config, subject, from, to, sendHtml)
      gun(config, subject, from, to, sendHtml)
    })
  }
}