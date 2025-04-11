const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const axios = require('axios');
const db = require('./models');
const BadRequestError = require('./errors/BadRequestError');
const FileProcessingError = require('./errors/FileProcessingError');
const InternalServerError = require('./errors/InternalServerError');

const app = express();

app.use(bodyParser.json());

app.use(express.static(`${__dirname}/static`));

app.get('/api/games', (req, res) => db.Game.findAll()
  .then((games) => res.send(games))
  .catch((err) => {
    console.log('There was an error querying games', JSON.stringify(err));
    return res.send(err);
  }));

app.post('/api/games', (req, res) => {
  const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
  return db.Game.create({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
    .then((game) => res.send(game))
    .catch((err) => {
      console.log('***There was an error creating a game', JSON.stringify(err));
      // Error 400 is a HTTP status mainly use when data fails validation 👇
      // return res.status(400).send(err);
      throw new InternalServerError('there was an error creating a game');
    });
});

app.post('/api/games/search', (req, res) => {
  const { platform, name } = req.body;

  const where = {};

  if (platform) {
    const allowedPlatforms = ['ios', 'android'];
    const allPlatforms = 'all';

    if (![...allowedPlatforms, allPlatforms].includes(platform)) {
      throw new BadRequestError('Invalid platform');
    }

    where.platform = platform === allPlatforms ? allowedPlatforms : platform;
  }

  if (name) {
    where.name = { [Op.like]: `%${name}%` };
  }

  db.Game.findAndCountAll({ where })
    .then((results) => res.send(results));
});

app.put('/api/games/populate', async (req, res) => {
  const urls = [
    'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json',
    'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json',
  ];

  try {
    res.setHeader('Content-Type', 'application/json');
    res.write('');

    // Cannot upsert or updateFileOnDuplicate does not work with SQL on Sequelize
    // Hence, I need to dirty call .destroy 👇
    await db.Game.destroy({
      where: {},
    });

    const sanitize = (value) => value.replace(/'/g, "''").replace(/\+/g, ' ').replace(/[^\x20-\x7E\t\n\r]/g, ' ');

    const processFilePromises = urls.map(async (url) => {
      const platform = url.includes('android') ? 'android' : 'ios';

      try {
        const response = await axios({
          method: 'GET',
          url,
          responseType: 'stream',
        });

        return new Promise((resolve, reject) => {
          let buffer = '';

          response.data
            .on('data', async (chunk) => {
              buffer += chunk.toString();
            })
            .on('end', async () => {
              try {
                const games = (JSON.parse(buffer)).flat(Infinity);
                games.sort((a, b) => b.rating - a.rating);

                await db.Game.bulkCreate(games.slice(0, 100)
                  .filter((cursor) => !!cursor.name && !!cursor.app_id)
                  .map((cursor) => ({
                    name: sanitize(cursor.name),
                    platform: cursor.os,
                    storeId: cursor.app_id,
                    publisherId: String(cursor.publisher_id),
                    bundleId: cursor.bundle_id,
                    appVersion: cursor.version,
                    isPublished: true,
                  })));

                resolve();
              } catch (err) {
                reject(err);
              }
            })
            .on('error', (err) => {
              reject(err);
            });
        });
      } catch (error) {
        return { platform, error: error.message || 'Unknown error' };
      }
    });

    await Promise.allSettled(processFilePromises);
    res.end();
  } catch (error) {
    throw new FileProcessingError(error.message);
  }
});

app.delete('/api/games/:id', (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  return db.Game.findByPk(id)
    .then((game) => game.destroy({ force: true }))
    .then(() => res.send({ id }))
    .catch((err) => {
      console.log('***Error deleting game', JSON.stringify(err));
      res.status(400).send(err);
    });
});

app.put('/api/games/:id', (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  return db.Game.findByPk(id)
    .then((game) => {
      const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
      return game.update({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
        .then(() => res.send(game))
        .catch((err) => {
          console.log('***Error updating game', JSON.stringify(err));
          // Error 400 is a HTTP status mainly use when data fails validation 👇
          // return res.status(400).send(err);
          throw new InternalServerError(err.message);
        });
    });
});

app.use((err, req, res, _) => {
  if (err.code) {
    return res.status(err.code).send({ message: err.message });
  }

  return res.status(500).send({ message: err.message || 'Something broke!' });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});

module.exports = app;
