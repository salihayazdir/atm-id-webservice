import { pool } from '../config/db.js'
const db = pool
  
const listAll = async (req, res) => {
  const { limit, offset,
    memberno, globalatmid, atmreferencecode, atmname, licensetag, adress,
    district, neighborhood, servicedependency, restrictedatm,
    airportlocated, malllocated, universitylocated, depositflag, withdrawflag,
    terminalcoinoperator, nfcflag, biometryflag, visuallyimpairedflag, orthopedicdisabledflag,
    atmage, geocodelatitude, geocodelongitude
  } = req.query
  const conditions = [];
  const values = [];

  if (memberno) { conditions.push(`memberno`); values.push(memberno); }
  if (globalatmid) { conditions.push(`globalatmid`); values.push(globalatmid); }
  if (atmreferencecode) { conditions.push(`atmreferencecode`); values.push(atmreferencecode); }
  if (atmname) { conditions.push(`atmname`); values.push(atmname); }
  if (licensetag) { conditions.push(`licensetag`); values.push(licensetag); }
  if (adress) { conditions.push(`adress`); values.push(adress); }
  if (district) { conditions.push(`district`); values.push(district); }
  if (neighborhood) { conditions.push(`neighborhood`); values.push(neighborhood); }
  if (servicedependency) { conditions.push(`servicedependency`); values.push(servicedependency); }
  if (restrictedatm) { conditions.push(`restrictedatm`); values.push(restrictedatm); }
  if (airportlocated) { conditions.push(`airportlocated`); values.push(airportlocated); }
  if (malllocated) { conditions.push(`malllocated`); values.push(malllocated); }
  if (universitylocated) { conditions.push(`universitylocated`); values.push(universitylocated); }
  if (depositflag) { conditions.push(`depositflag`); values.push(depositflag); }
  if (withdrawflag) { conditions.push(`withdrawflag`); values.push(withdrawflag); }
  if (terminalcoinoperator) { conditions.push(`terminalcoinoperator`); values.push(terminalcoinoperator); }
  if (nfcflag) { conditions.push(`nfcflag`); values.push(nfcflag); }
  if (biometryflag) { conditions.push(`biometryflag`); values.push(biometryflag); }
  if (visuallyimpairedflag) { conditions.push(`visuallyimpairedflag`); values.push(visuallyimpairedflag); }
  if (orthopedicdisabledflag) { conditions.push(`orthopedicdisabledflag`); values.push(orthopedicdisabledflag); }
  if (atmage) { conditions.push(`atmage`); values.push(atmage); }
  if (geocodelatitude) { conditions.push(`geocodelatitude`); values.push(geocodelatitude); }
  if (geocodelongitude) { conditions.push(`geocodelongitude`); values.push(geocodelongitude); }

  const paramQuery = conditions.map((condition, index) => {
    return `${condition} = $${index + 1} ${(index + 1 === conditions.length) ? '' : 'AND '}`
  })

  try {
    const client = await db.connect();
    client.query(
      `SELECT * FROM atmunits ${(conditions.length) ? (`WHERE ${paramQuery.join('')}`) : ''}order by globalatmid desc${(limit) ? (` limit ${limit}`) : ''}${(offset) ? (` offset ${offset}`) : ''}`,
      values, 
      (error, results) => {
        try {
          if (error) throw error;
          res.json( results.rows );
        } catch (err) {
          console.error(err);
          res.send("Error " + err);
        }
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
          if (results.rows.length) throw 'Hata. Belirtilen referans kodu ile oluşturulmuş ATM kaydı bulunmaktadır.';
          if (memberno !== res.locals.data.memberno) throw 'Belirtilen memberno (banka kodu) ile kayıt ekleme yetkiniz bulunmuyor.';
          
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
              res.json({success: true, message: 'Atm kaydı oluşturuldu', data: results});
            } catch (err) {
              console.error(err);
              res.json({success: false, message: `Atm kaydı oluşturulamadı. ${err}`});
            }
          })
        }
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
        if (!results.rows.length) throw 'ATM Bulunamadı.';
        if (results.rows[0].memberno !== res.locals.data.memberno) throw 'Bu kaydı silme yetkiniz bulunmuyor.';
  
        client.query('DELETE FROM atmunits WHERE globalatmid = $1', [id], (error, results) => {
          try {
            if (error) throw error;
            res.json({success: true, message: `${id} ID'li ATM kaydı silindi.`, data: results});
          } catch (err) {
            console.error(err);
            res.json({success: false, message: `ATM kaydı silinemedi. ${err}`})
          }
        })
      } catch (err) {
        console.error(err);
        res.json({success: false, message: `ATM kaydı silinemedi. ${err}`})
      }
    })
    client.release();
  } catch (err) {
    console.error(err);
    res.json({success: false, message: `ATM kaydı silinemedi. ${err}`})
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
    client.query('SELECT * FROM atmunits WHERE globalatmid = $1', [id], (error, results) => {
      try {
        if (error) throw 'Veritabanına bağlanılamadı.';
        if (!results.rows.length) throw 'Atm kaydı bulunamadı.'
        if (results.rows[0].memberno !== res.locals.data.memberno) throw 'Bu kaydı düzenleme yetkiniz bulunmuyor.';

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
            res.json({success: true, message: `${id} ID'li ATM başarıyla güncellendi.`, data: results})
          }
          catch (err) {
            console.error(err);
            res.json({success: false, message: `Kayıt veritabanında güncellenemedi. ${err}`})
          }
        })
      }
      catch (err) {
        console.error(err);
        res.json({success: false, message: err})
      }
    })
}

// const checkMemberAuthorization = (req, res, next) => {
//   console.log('----localdata-------' + JSON.stringify(res.locals.data))
//   console.log('----req.usermemberno---------' + req.user.memberno)
//   if (res.locals.memberno === req.body.memberno) return next();
//   res.json({success: false, message: 'Yetkisiz işlem. Farklı banka.'})
// }

// const validateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
  
//   try {
//     if (!token) throw true;
//     const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     if (!data.expirationDate || (Date.parse(data.expirationDate) < Date.now())) throw 'Token geçerliliğini yitirdi.';
//     req.user = {};
//     Object.keys(data).forEach((key) => {
//     req.user[key] = data[key];
//     });
//     res.locals.data = data
//     return next();
//   } catch (err) {
//       return res.json({success: false, message: `Token doğrulanamadı. ${err}`});
//   }
// };


export {
  listAll,
  newAtm,
  getAtm,
  editAtm,
  deleteAtm,
}