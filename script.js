const fs = require('fs');
const prefectures = require('./json/prefectures');
const geoDataRaw = require('./geo data v2/raw');

const latinifyNames = str => str.replace(/ō/g, 'o').replace(/ū/g, 'u')

// const geoDataRawPrefectureList = geoDataRaw.objects.JPN_adm1.geometries.map(elem => elem.properties.NAME_1.toLowerCase());
// const prefectureList = prefectures.map(elem => latinifyNames(elem.prefectureEn.split('-')[0].toLowerCase()));

// const omittedItems = {
//   geoDataRawPrefectureList: geoDataRawPrefectureList.filter(elem => prefectureList.findIndex(elem2 => elem2 === elem) < 0),
//   prefectureList: prefectureList.filter(elem =>geoDataRawPrefectureList.findIndex(elem2 => elem2 === elem) < 0)
// }

// console.log(omittedItems)


const getprefectureId = (properties) => {
  const result = prefectures.find(prefecture => {
    return latinifyNames(prefecture.prefectureEn.split('-')[0].toLowerCase()) === properties.NAME_1.toLowerCase()
  })

  if(!result){
    const error = `No prefecture found for ${properties.NAME_1}`;
    console.error(error);
    console.error(properties);

    throw new Error(error);
  }

  return result.iso;
}

const {geometries} = geoDataRaw.objects.JPN_adm1
geoDataRaw.objects.JPN_adm1.geometries = geometries.map(elem => ({
  ...elem,
  properties: {
    ...['ID_1', 'TYPE_1'].reduce((a, key) => ({...a, [key]: elem.properties[key]}), {}),
    prefectureId: getprefectureId(elem.properties)
  }
}))


// console.log(prefectures[0])
// console.log(geoDataRaw.objects.JPN_adm1.geometries)


fs.writeFileSync(
  "./geo data v2/prefectures.json",
  JSON.stringify(geoDataRaw)
);

console.log('done!');