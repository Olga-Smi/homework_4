const express = require("express");
const path = require("path");
const fs = require("fs");

const webserver = express();

webserver.use(express.urlencoded({ extended: true }));
webserver.use(express.static(path.resolve(__dirname, "../front")));


const port = 7881;

const formFile = path.resolve(__dirname, "../front/index.html");
let form = fs.readFileSync(formFile, 'utf-8');

webserver.route('/index')
.get((req, res) => {
  const templateRepl = {
    "[nameErr]": "",
    "[nameValue]": "Введите ваше имя",
    "[famErr]": "",
    "[famValue]": "Введите вашу фамилию"
  }

  const indexForm = repl(templateRepl, form);
  res.send(indexForm);
})
.post((req, res) => {
  try {
    const name = req.body.name;
    const fam = req.body.fam;
   

    const regexUpper = /^[A-ZА-Я]/; 

    const nameErr = name.length < 5 || !regexUpper.test(name[0]) || name.includes(' ') ? "Имя должно составлять более 5 символов, начинаться с заглавной буквы и не содержать пробелы" : "";
    const famErr = fam.length < 10 || !regexUpper.test(fam[0]) || fam.includes(' ') ? "Фамилия должна составлять более 10 символов, начинаться с заглавной буквы и не содержать пробелы" : "";
  
    const templateRepl = {
      "[nameErr]": nameErr,
      "[nameValue]": name,
      "[famErr]": famErr,
      "[famValue]": fam
    }
        
    if(nameErr || famErr){
      const homeForm = repl(templateRepl, form);

      res.send(homeForm);
    } else {
      res.redirect(302, `/home?name=${name}&fam=${fam}`);
    }   
  } catch (error) {
    console.error(`Your error: ${error}`);
  }
})

webserver.get('/home', (req, res) => {
  const name = req.query.name;
  const fam = req.query.fam;

  res.send(`${name} ${fam}, Вы успешно зарегестрированы на нашем сайте!`)
})

webserver.listen(port, () => {
  console.log(`Webserver running on port ${port}`);
});

const repl = (replObj, startForm) => {
  let newForm = startForm;
  newForm = newForm.replace(/\[nameErr\]|\[nameValue\]|\[famErr\]|\[famValue\]/g, (data) => replObj[data]);
  
  return newForm;
};
