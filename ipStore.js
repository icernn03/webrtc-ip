const fs = require('fs')

module.exports = function ipStore(data) {
  return new Promise((resolve, reject) => {
    fs.readFile('./ips.json', 'utf8', (err, jsonString) => {
      if (err) {
        console.log(`${data.timestamp}: File read failed`)
        console.log(`${data.timestamp}: ${err}`)
        return reject(err)
      }
      
      let ips = JSON.parse(jsonString); 
      ips.all.push(data);

      fs.writeFile('./ips.json', JSON.stringify(ips, null, 2), err => {
        if (err) {
          console.log(`${data.timestamp}: File write failed`)
          console.log(`${data.timestamp}: ${err}`)
          return reject(err)
        }
        
        return resolve()
      })
    });
  });
}
