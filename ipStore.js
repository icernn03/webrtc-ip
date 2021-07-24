const fs = require('fs')

module.exports = function ipStore(data) {
  return new Promise((resolve, reject) => {
    fs.readFile('./ips.json', 'utf8', (err, jsonString) => {
      if (err) {
        console.log(`${new Date()}: File read failed`)
        console.log(`${new Date()}: ${err}`)
        return reject(err)
      }
      
      let ips = JSON.parse(jsonString); 
      ips.all.push(data);

      fs.writeFile('./ips.json', JSON.stringify(ips), err => {
        if (err) {
          console.log(`${new Date()}: File write failed`)
          console.log(`${new Date()}: ${err}`)
          return reject(err)
        }
        
        return resolve()
      })
    });
  });
}
