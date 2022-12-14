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
          res.json( {success: true, results: results} );
        } catch (err) {
          console.error(err);
          res.json({success: false, message: `Veri listelenemedi. ${err}`});
        }
      });
    client.release();
  } 
  catch (err) {
    console.error(err);
    res.json({success: false, message: `${err}`});
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
    res.json({success: false, message: `${err}`});
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
          if (results.rows.length) throw 'Hata. Belirtilen referans kodu ile olu??turulmu?? ATM kayd?? bulunmaktad??r.';
          if (memberno !== res.locals.data.memberno) throw 'Belirtilen memberno (banka kodu) ile kay??t ekleme yetkiniz bulunmuyor.';
          
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
              res.json({success: true, message: 'Atm kayd?? olu??turuldu', data: results});
            } catch (err) {
              console.error(err);
              res.json({success: false, message: `Atm kayd?? olu??turulamad??. ${err}`, data: results});
            }
          })
        }
        catch (err) {
          console.error(err);
          res.json({success: false, message: `${err}`});
        }
      } 
    )
    client.release();
  } 
  catch (err) {
    console.error(err);
    res.json({success: false, message: `${err}`});
  }
}

const deleteAtm = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const client = await db.connect();
    client.query('SELECT * FROM atmunits WHERE globalatmid = $1', [id], (error, results) => {
      try {
        if (error) throw error;
        if (!results.rows.length) throw 'ATM Bulunamad??.';
        if (results.rows[0].memberno !== res.locals.data.memberno) throw 'Bu kayd?? silme yetkiniz bulunmuyor.';
  
        client.query('DELETE FROM atmunits WHERE globalatmid = $1', [id], (error, results) => {
          try {
            if (error) throw error;
            res.json({success: true, message: `${id} ID'li ATM kayd?? silindi.`, data: results});
          } catch (err) {
            console.error(err);
            res.json({success: false, message: `ATM kayd?? silinemedi. ${err}`})
          }
        })
      } catch (err) {
        console.error(err);
        res.json({success: false, message: `Veritaban??na ba??lan??lamad??. ${err}`})
      }
    })
    client.release();
  } catch (err) {
    console.error(err);
    res.json({success: false, message: `Veritaban??na ba??lan??lamad??. ${err}`})
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
        if (error) throw 'Veritaban??na ba??lan??lamad??.';
        if (!results.rows.length) throw 'Atm kayd?? bulunamad??.'
        if (results.rows[0].memberno !== res.locals.data.memberno) throw 'Bu kayd?? d??zenleme yetkiniz bulunmuyor.';

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
            res.json({success: true, message: `${id} ID'li ATM ba??ar??yla g??ncellendi.`, data: results})
          }
          catch (err) {
            console.error(err);
            res.json({success: false, message: `Kay??t veritaban??nda g??ncellenemedi. ${err}`})
          }
        })
      }
      catch (err) {
        console.error(err);
        res.json({success: false, message: err})
      }
    })
}

const getMembers = async (req, res) => {
  try {
    const client = await db.connect();
    client.query('SELECT * FROM members', (error, results) => {
      try {
        if (error) throw error;
        if (!results.rows.length) throw 'Banka kayd?? bulunamad??.';
        res.json({success: true, data: results.rows})
      } catch (err) {
        console.error(err);
        res.json({success: false, message: `Bankalar listelenemedi. ${err}`})
      }
    })
    client.release();
  } catch (err) {
    console.error(err);
    res.json({success: false, message: `Veritaban??na ba??lan??lamad??. ${err}`})
  }  
}



export {
  listAll,
  newAtm,
  getAtm,
  editAtm,
  deleteAtm,
  getMembers,
}