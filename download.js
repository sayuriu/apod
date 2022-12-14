let data = require('./public/data.json');
const https = require('https');
const fs = require('fs');

const out = {}
function download() {
	for (const image in data)
	{
		if (data[image].media_type === 'image')
		{
			// // Download image
			// https.get(image.url, (res) => {
			// 	const accumulated = [];
			// 	res.on('data', (chunk) => {
			// 		accumulated.push(...chunk.values());
			// 		try {
			// 			fs.writeFileSync(`./public/images/${image.url.split('/').at(-1)}`, Buffer.from(accumulated));
			// 		} catch (e) {
			// 			console.log(e);
			// 		} finally {
			// 		}
			// 	})
			// });
		    out[data[image].url.split('/').at(-1)] = data[image];
		}
	}

	fs.writeFile('./public/data.json', JSON.stringify(out, null, 4), (err) => {
		err && console.log(err);
	});
}

download();
