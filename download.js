let data = require('./data2.json');
const https = require('https');
const fs = require('fs');

const out = {}
function download() {
	for (const image of data)
	{
		// if (image.media_type === 'image')
		// {
		// 	// Download image
		// 	https.get(image.url, (res) => {
		// 		const accumulated = [];
		// 		res.on('data', (chunk) => {
		// 			accumulated.push(...chunk.values());
		// 			try {
		// 				fs.writeFileSync(`./images/${image.url.split('/').at(-1)}`, Buffer.from(accumulated));
		// 			} catch (e) {
		// 				console.log(e);
		// 			} finally {
		// 				out.add(image);
		// 			}
		// 		})
		// 	});
		// }
		out[image.url.split('/').at(-1)] = image;
	}

	fs.writeFile('./data.json', JSON.stringify(out, null, 4), (err) => {
		err && console.log(err);
	});
}

download();