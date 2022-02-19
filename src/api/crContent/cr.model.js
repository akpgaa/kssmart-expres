const { startConnection } = require("../../helpers/databaseConnection");
let connection = startConnection();
class Model {
  static Create(t, d) {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO ${t} set ? `, [d], (err, rows) => {
        if (err) return reject(err);
        console.log(rows, "in Create");
        resolve(rows);
      });
    });
  }

  static Read(s, t, c) {
    // console.log(`SELECT ${s} FROM ${t} WHERE ${c}`);
    return new Promise((resolve, reject) => {
      poolconnection.query(`SELECT ${s} FROM ${t} WHERE ${c}`, (err, rows) => {
        if (err) return reject(err);
        // console.log(rows, "in Read");
        resolve(rows);
      });
    });
  }
  static Update(t, c, d) {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE ${t} SET ? WHERE ${c}`, [d], (err, rows) => {
        if (err) return reject(err);
        // console.log(rows, "in Update");
        resolve(rows);
      });
    });
  }

  static Delete(t, c) {
    return new Promise((resolve, reject) => {
      // console.log(`DELETE ${t} FROM ${t} WHERE ${c}`);
      connection.query(`DELETE ${t} FROM ${t} WHERE ${c}`, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  static getFreedom(selection, tableName, condition, groupby, orderby) {

    return new Promise((resolve, reject) => {
      connection.query(
        `select ${selection} from ${tableName} where ${condition} group by ${groupby} order by ${orderby}`,
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }
  static Read(query) {

    return new Promise((resolve, reject) => {
      connection.query(
        query,
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }
  static keyName(filename) {
    const timestamp = Date.parse(new Date());
    let name = filename.substring(0, filename.lastIndexOf('.'))
    let fileType = filename.substring(filename.lastIndexOf('.') + 1, filename.length)
    const keyName = `${name}_${timestamp}.${fileType}`;
    return keyName;
  }

}

module.exports = Model;
