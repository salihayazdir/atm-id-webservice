const db = require('../config/db')
  
const listAll = async (req, res) => {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT * FROM atmunits', 
      (error, results) => {
        if (error) throw error;
        res.json( results.rows );
      });
    client.release();
  } 
  catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

const getAtm = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const client = await db.connect();
    client.query('SELECT * FROM atmunits WHERE globalatmid = $1', 
    [id], 
    (error, results) => {
        if (error) throw error;
        res.json(results.rows)
    } 
    )
    client.release();
  } 
  catch (err) {
    console.error(err);
    res.send("Error " + err);
  }  
}
      
const newAtm = async (req, res) => {
  const { memberno, atmreferencecode, } = req.body;

  try {
    const client = await db.connect();
    client.query('SELECT * FROM atmunits WHERE memberno = $1 AND atmreferencecode = $2', 
      [memberno, atmreferencecode], 
      (error, results) => {
        try { 
          if (error) throw error;
          if (results.rows.length) {
            res.send('Hata. Belirtilen referans kodu ile oluşturulmuş ATM kaydı bulunmaktadır.');
            res.end();
          } else {
            client.query('INSERT INTO atmunits (memberno, atmreferencecode) VALUES ($1, $2)',
            [memberno, atmreferencecode],
            (error, results) => {
              try {
                if (error) throw error;
                res.send('ATM Kaydı Oluşturuldu.');
                res.end();}
              catch (err) {
                console.error(err);
                res.send("Error " + err);
              }
            })
          }}
        catch (err) {
          console.error(err);
          res.send("Error " + err);
        }
      } 
    )
    client.release();
  } 
  catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

const deleteAtm = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const client = await db.connect();
    client.query('SELECT * FROM atmunits WHERE globalatmid = $1', [id], (error, results) => {
      try {
        if (error) throw error;
        if (!results.rows.length) {
          res.send('Hata. ATM Bulunamadı.');
        } else {
          client.query('DELETE FROM atmunits WHERE globalatmid = $1', [id], (error, results) => {
            try {
              if (error) throw error;
              res.send(`${id} ID'li ATM kaydı silindi.`);
            }
            catch (err) {
              console.error(err);
              res.send("Error " + err);
            }
          })}
      }
      catch (err) {
        console.error(err);
        res.send("Error " + err);
      }})
    client.release();
  } 
  catch (err) {
    console.error(err);
    res.send("Error " + err);
  }  
}

const editAtm = async (req, res) => {
  const id = parseInt(req.params.id);
  const { atmreferencecode } = req.body;
  const client = await db.connect();
  try {
    client.query('SELECT * FROM atmunits WHERE globalatmid = $1', [id], (error, results) => {
      try {
        if (error) throw error;
        if (!results.rows.length) {
          res.send('Hata. ATM Bulunamadı')
        } else {
          client.query('UPDATE atmunits SET atmreferencecode = $2 WHERE globalatmid = $1', [id, atmreferencecode], (error, results) => {
            try {
              if (error) throw error;
              res.send(`${id} ID'li ATM başarıyla güncellendi.`)
            }
            catch (error) {
              console.error(err);
              res.send("Error " + err)
            }
          })
        }
      }
      catch {
        console.error(err);
        res.send("Error " + err)
      }
    })
  }
  catch (err) {
    console.error(err);
    res.send("Error " + err)
  }
}

module.exports = {
  listAll,
  newAtm,
  getAtm,
  editAtm,
  deleteAtm,
}