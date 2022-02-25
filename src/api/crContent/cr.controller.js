const Model = require("./cr.model");
const { endConnection } = require("../../helpers/databaseConnection");
const chalk = require("chalk");
const config = require("../../config");
const fs = require("fs");
const md5 = require('md5');
const path = require("path");

require('dotenv').config();
const rootPath = path.dirname(
  require.main.filename || process.mainModule.filename
);


const Updatedata = async (req, res, next) => {
  let table = req.params.table;
  let body = req.body;
  let files = req.files ? req.files : null
  let id = req.params.id
  console.log(files, body);
  try {
    // if (table == 'tbl_user') {
    //   if (body.password) {
    //     body.encrypt = md5(body.password)
    //   }
    // }

    let result = {}
    if (id == 'id') {
      // console.log(table, body, req);
      result = await Model.Create(`tbl_${table}`, body);
    } else {
      result = await Model.Update(`tbl_${table}`, `id=${id}`, body);
    }

    if (result) {
      if (files) {
        //create a folder for table
        // let path = `${FILEUPLOAD}/${table}/${result.insertId}`
        const path1 = path.join(__dirname, `files/${table}/${result.insertId}`);
        if (!fs.existsSync(`${__dirname}/files/${table}`)) {
          fs.mkdirSync(`${__dirname}/files/${table}`);
        }
        //create a folder for that id
        if (!fs.existsSync(`${__dirname}/files/${table}/${result.insertId}`)) {
          fs.mkdirSync(`${__dirname}/files/${table}/${result.insertId}`);
        }

        // saving files insides that directort
        let upfiles = []

        if (files) {
          let images = files.file;
          if (images) {
            const keyName = Model.keyName(images.name);
            await images.mv(`${__dirname}/files/${table}/${result.insertId}/${keyName}`)
            let url = `${table}/${result.insertId}/${keyName}`
            upfiles.push(url)
          }

        }

        let newBody = {}
        if (upfiles.length > 0) {
          newBody.image = JSON.stringify(upfiles)
          let result1 = await Model.Update(`tbl_${table}`, `id=${result.insertId}`, newBody)
        }
      }
      res.send('Success');

    }
  } catch (error) {
    endConnection()
    console.error(chalk.red(error));
    res.status(500);
    next(error);
  }
};

const loginCheck = async (req, res, next) => {
  const body = req.body;

  // let password = md5(body.pass);
  try {
    const result = await Model.getFreedom(
      '*',
      "tbl_user",
      `email='${body.name}' and password='${body.pass}' and status=0`, 1, 1
    );
    res.send(result);
  } catch (error) {
    console.error(chalk.red(error));
    res.status(500);
    // next(error);
  }
  // db end connection
  endConnection();
};


const GetData = async (req, res, next) => {
  try {
    let body = req.body;
    let { type, id } = req.params;
    let result = []

    if (type == 'user') {
      result = await UserPage(id)
    }
    if (type == 'product') {
      result = await ProductPage(id, body)
    }
    if (type == 'userproduct') {
      result = await userProductPage(id)
    }
    if (type == 'allproduct') {
      result = await allProductPage(id)
    }
    res.send(result)

  } catch (error) {
    console.error(chalk.red(error));
    res.status(500);
  }
}

async function UserPage(id) {
  let result = {}
  result.data = await Model.getFreedom(`*`, 'tbl_user', 'status=0', 1, 'id desc');
  return result
}
async function ProductPage(id, body) {
  let result = {}
  result.data = await Model.getFreedom(`*`, 'tbl_product', `user=${body.id}`, 1, 'id desc');
  return result
}
async function userProductPage(id) {
  let result = {}
  // result.data = await Model.getFreedom(`*`, 'tbl_product', 'status=1', 1, 'id desc');
  result.data = await Model.getFreedom(`tbl_product.*,tbl_user.district`, 'tbl_product,tbl_user', 'tbl_product.status=1 and tbl_product.user=tbl_user.id', 1, 'tbl_product.id desc');

  return result
}

async function allProductPage(id) {
  let result = {}
  result.data = await Model.getFreedom(`*`, 'tbl_product', 1, 1, 'id desc'); return result
}
const Delete = async (req, res, next) => {
  let table = req.body.table;
  let id = req.body.id;
  // let body = req.body;
  try {
    let body = {}
    body.status = Date.now()
    //console.log(body);
    let result = await Model.Update(`tbl_${table}`, `id=${id}`, body);
    res.send(result);
  } catch (error) {
    console.error(chalk.red(error));
    res.status(500);
    next(error);
  }
};

const GetRandomNumber = async (req, res, next) => {
  try {
    let min = 0;
    let max = req.query.max
    let random = Math.floor(Math.random() * (max - min + 1) + min)
    let percent = (100 * random) / max
    res.send({ data: random, percent: percent })
  } catch (error) {
    console.error(chalk.red(error));
    res.status(500);
    next(error);
  }
}
module.exports = {
  Updatedata,
  loginCheck,
  GetData,
  Delete,
  GetRandomNumber
};
