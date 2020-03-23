fs = require('fs');
tmdb = require('tmdbv3')

function getExtension(filename)
{
	var re = /.(avi|mkv|mp4?)$/;
	if(re.test(filename) && re.exec(filename)[1].length >= 3) {
    	return re.exec(filename)[1];
    }else{
    	return 'avi';
    }
}   
//tmdb.setLanguage('fr');
fs.readdir(process.argv[2], function (err, files) {
	files.forEach(function(file){
		if(/\[([0-9a-z_]+)\]/.test(file)) {
			console.log(/\[([0-9a-z_]+)\]/.exec(file)[1]);
			tmdb.movie.info(/\[([0-9a-z_]+)\]/.exec(file)[1], (err ,res) => {
				console.log(res);	
		    });
		}
	});
});