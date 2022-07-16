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
  const { 
    memberno, atmreferencecode, atmname, licensetag, adress,
    district, neighborhood, servicedependency, restrictedatm,
    airportlocated, malllocated, universitylocated, depositflag, withdrawflag,
    terminalcoinoperator, nfcflag, biometryflag, visuallyimpairedflag, orthopedicdisabledflag,
    atmage, geocodelatitude, geocodelongitude
  } = req.body;

  try {
    const client = await db.connect();
    client.query('SELECT * FROM atmunits WHERE memberno = $1 AND atmreferencecode = $2', 
      [memberno, atmreferencecode], 
      (error, results) => {
        try { 
          if (error) throw error;
          if (results.rows.length) {
            res.status(455).send('Hata. Belirtilen referans kodu ile oluşturulmuş ATM kaydı bulunmaktadır.');
            res.end();
          } else {
            client.query(`
              INSERT INTO atmunits
              (memberno, atmreferencecode, atmname, licensetag, adress,
                district, neighborhood, servicedependency, restrictedatm, airportlocated,
                malllocated, universitylocated, depositflag, withdrawflag, terminalcoinoperator,
                nfcflag, biometryflag, visuallyimpairedflag, orthopedicdisabledflag, atmage,
                geocodelatitude, geocodelongitude)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)`,
            [
              memberno, atmreferencecode, atmname, licensetag, adress,
              district, neighborhood, servicedependency, restrictedatm, airportlocated,
              malllocated, universitylocated, depositflag, withdrawflag, terminalcoinoperator,
              nfcflag, biometryflag, visuallyimpairedflag, orthopedicdisabledflag, atmage,
              geocodelatitude, geocodelongitude
            ],
            (error, results) => {
              try {
                if (error) throw error;
                res.status(251).send('ATM Kaydı Oluşturuldu.');
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
          res.status(451).send('Hata. ATM Bulunamadı.');
        } else {
          client.query('DELETE FROM atmunits WHERE globalatmid = $1', [id], (error, results) => {
            try {
              if (error) throw error;
              res.status(250).send(`${id} ID'li ATM kaydı silindi.`);
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
  const { 
    atmreferencecode, atmname, licensetag, adress, district,
    neighborhood, servicedependency, restrictedatm, airportlocated,
    malllocated, universitylocated, depositflag, withdrawflag, terminalcoinoperator, 
    nfcflag, biometryflag, visuallyimpairedflag, orthopedicdisabledflag, atmage,
    geocodelatitude, geocodelongitude
  } = req.body;
  const client = await db.connect();
  try {
    client.query('SELECT * FROM atmunits WHERE globalatmid = $1', [id], (error, results) => {
      try {
        if (error) throw error;
        if (!results.rows.length) {
          res.status(451).send('Hata. ATM Bulunamadı')
        } else {
          client.query(`
            UPDATE atmunits SET 
              atmreferencecode = $2, atmname = $3, licensetag = $4, adress = $5,
              district = $6, neighborhood = $7, servicedependency = $8, restrictedatm = $9, airportlocated = $10,
              malllocated = $11, universitylocated = $12, depositflag = $13, withdrawflag = $14, terminalcoinoperator = $15,
              nfcflag = $16, biometryflag = $17, visuallyimpairedflag = $18, orthopedicdisabledflag = $19, atmage = $20,
              geocodelatitude = $21, geocodelongitude = $22
            WHERE globalatmid = $1`,
            [
              id, atmreferencecode, atmname, licensetag, adress,
              district, neighborhood, servicedependency, restrictedatm, airportlocated,
              malllocated, universitylocated, depositflag, withdrawflag, terminalcoinoperator,
              nfcflag, biometryflag, visuallyimpairedflag, orthopedicdisabledflag, atmage,
              geocodelatitude, geocodelongitude
            ],
            (error, results) => {
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